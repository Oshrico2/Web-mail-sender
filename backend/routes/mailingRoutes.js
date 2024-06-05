import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { fetchAgents } from "../utils/scripts.js";

const router = express.Router();
const upload = multer();

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "sinergia@tlp-ins.co.il",
    pass: process.env.PASSWORD_TO_MAIL2,
  },
});

const sendMails = async (title, content, attachment, agentsMails) => {
  try {
    await transporter.sendMail({
      from: "sinergia@tlp-ins.co.il",
      subject: title,
      html: content,
      attachments: attachment ? [attachment] : [],
      bcc: agentsMails,
    });

    console.log("Message sent: %s");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/", upload.single("attachment"), async (req, res) => {
  const { title, content } = req.body;
  const attachment = req.file
    ? {
        filename: decodeURIComponent(req.file.originalname),
        content: req.file.buffer,
      }
    : null;
  const rtlContent = `<div style="direction: rtl; text-align: right;">${content.replace(
    /\n/g,
    "<br>"
  )}<br><br><br>להסרה מדיוור <a href="https://webmailsender.onrender.com/agents/remove-mailing">לחץ כאן</a></div>`;

  const agents = await fetchAgents();
  const agentsMailsSet = new Set(
    agents
      .filter((agent) => agent.confirmedMailing === true)
      .map((agent) => agent.email)
  );
  const agentsMails = [...agentsMailsSet];

  const chunks = [];
  for (let i = 0; i < agentsMails.length; i += 100) {
    chunks.push(agentsMails.slice(i, i + 100));
  }
  for (const chunk of chunks) {
    await sendMails(title, rtlContent, attachment, chunk);
  }
  res.send("Message sent successfully");
});

export default router;
