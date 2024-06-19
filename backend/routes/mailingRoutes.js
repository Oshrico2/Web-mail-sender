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
    throw error;
  }
};

router.post("/", upload.single("attachment"), async (req, res) => {
  const { title, content, isTest } = req.body;
  let {sendMailTo} = req.body;

  console.log("sendMailTo:", sendMailTo);
  console.log("isTest:", isTest);
  console.log("title:", title);
  console.log("content:", content);

  if(isTest === 'false'){
    const agents = await fetchAgents();
    const agentsMailsSet = new Set(
      agents
        .filter(agent => agent.confirmedMailing)
        .map(agent => agent.email)
    );
    sendMailTo = [...agentsMailsSet];
  }
  const attachment = req.file
    ? {
        filename: decodeURIComponent(req.file.originalname),
        content: req.file.buffer,
      }
    : null;
  console.log("attachment:", attachment);

  const rtlContent = `<div dir="rtl">${content}<br>להסרה מדיוור <a href="https://webmailsender.onrender.com/agents/remove-mailing">לחץ כאן</a></div>`;


try{
    const chunks = [];
    for (let i = 0; i < sendMailTo.length; i += 100) {
      chunks.push(sendMailTo.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await sendMails(title, rtlContent, attachment, chunk);
    }

    return res.send("Message sent successfully");

  } catch (error) {
    console.error("Error sending mail:", error);
    return res.status(500).send("An error occurred while sending the message");
  }
});

export default router;
