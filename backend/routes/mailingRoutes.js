import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import Agent from "../models/agentModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError, isEmail } from "../utils/http.js";

const router = express.Router();
const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } });

const MAIL_FROM = "sinergia@tlp-ins.co.il";
const PUBLIC_URL = process.env.PUBLIC_URL || "https://webmailsender.onrender.com";
const BATCH_SIZE = 100;

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: { user: MAIL_FROM, pass: process.env.PASSWORD_TO_MAIL2 },
});

const uniqueEmails = (list) => {
  const seen = new Map();
  for (const raw of list) {
    const email = String(raw || "").trim();
    if (isEmail(email) && !seen.has(email.toLowerCase())) {
      seen.set(email.toLowerCase(), email);
    }
  }
  return [...seen.values()];
};

// @desc    Number of agents who would receive a mailing (for the confirm step)
// @route   GET /api/mailing/recipients
router.get(
  "/recipients",
  asyncHandler(async (req, res) => {
    // distinct() returns only the addresses, not whole agent documents.
    const emails = await Agent.distinct("email", { confirmedMailing: { $ne: false } });
    res.json({ count: uniqueEmails(emails).length });
  })
);

// @desc    Send a mailing (or a test to one address)
// @route   POST /api/mailing   multipart: title, content, isTest, sendMailTo, attachment
router.post(
  "/",
  upload.single("attachment"),
  asyncHandler(async (req, res) => {
    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "");
    const isTest = req.body.isTest === "true" || req.body.isTest === true;

    if (!title) throw new HttpError(400, "יש להזין נושא למייל");
    if (!content.replace(/<[^>]*>/g, "").trim() && !content.includes("<img")) {
      throw new HttpError(400, "יש להזין תוכן למייל");
    }

    let recipients;
    if (isTest) {
      const testTo = String(req.body.sendMailTo || "").trim();
      if (!isEmail(testTo)) throw new HttpError(400, "כתובת הבדיקה אינה תקינה");
      recipients = [testTo];
    } else {
      recipients = uniqueEmails(
        await Agent.distinct("email", { confirmedMailing: { $ne: false } })
      );
    }

    const attachments = req.file
      ? [
          {
            filename: decodeURIComponent(req.file.originalname),
            content: req.file.buffer,
          },
        ]
      : [];

    const html = `<div dir="rtl">${content}<br>להסרה מדיוור <a href="${PUBLIC_URL}/agents/remove-mailing">לחץ כאן</a></div>`;

    // Send in BCC batches. Keep going if one batch fails and report the
    // numbers: the old code aborted mid-way and answered "error", so a retry
    // re-sent the message to everyone already reached.
    let sent = 0;
    let failed = 0;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      try {
        await transporter.sendMail({
          from: MAIL_FROM,
          bcc: batch,
          subject: title,
          html,
          attachments,
          // Pasted images arrive as data: URIs, which Gmail and Outlook
          // block; embed them as inline attachments instead.
          attachDataUrls: true,
        });
        sent += batch.length;
      } catch (error) {
        failed += batch.length;
        console.error("Mailing batch failed:", error.message);
      }
    }

    await logActivity(req, {
      title: isTest ? "בדיקת תפוצה" : "שליחת תפוצה לסוכנים",
      action: isTest
        ? `נשלחה בדיקה אל ${recipients[0]}`
        : `נשלחה ל-${sent} סוכנים${failed ? `, ${failed} נכשלו` : ""}`,
      entityName: title,
      color: "blue",
    });

    if (sent === 0) {
      throw new HttpError(502, "השליחה נכשלה, לא נשלח אף מייל");
    }
    res.json({ sent, failed, total: recipients.length });
  })
);

export default router;
