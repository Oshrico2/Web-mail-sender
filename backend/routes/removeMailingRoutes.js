import express from "express";
import Agent from "../models/agentModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, isEmail, rateLimit } from "../utils/http.js";

const router = express.Router();

// Public endpoint (linked from every mailing). Rate limited so it cannot be
// used to probe the agent list.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "יותר מדי בקשות, נסה שוב מאוחר יותר",
});

router.put(
  "/",
  limiter,
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim();
    if (!isEmail(email)) {
      return res.status(400).json({ message: "כתובת המייל אינה תקינה" });
    }

    // Exact, case-insensitive match. Previously loaded every agent and
    // threw (crashing the server) when the address was not found.
    const agent = await Agent.findOne({
      email: { $regex: `^${escapeRegex(email)}$`, $options: "i" },
    });
    if (!agent) {
      return res.status(404).json({ message: "כתובת המייל לא נמצאה ברשימת התפוצה" });
    }

    if (agent.confirmedMailing !== false) {
      agent.confirmedMailing = false;
      agent.updatedAt = Date.now();
      agent.updatedBy = "הסרה עצמית";
      await agent.save();
      await logActivity(req, {
        title: "הסרה מרשימת תפוצה",
        action: "הסיר את עצמו מרשימת תפוצה",
        entityName: agent.name,
        color: "orange",
        actor: agent.name,
      });
    }

    res.json({ message: "הוסרת מרשימת התפוצה" });
  })
);

export default router;
