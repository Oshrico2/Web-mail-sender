import express from "express";
import { fetchAgents } from "../utils/scripts.js";
import UserActivity from "../models/userActivityModel.js";
import {
  getCurrentDateFormatted,
  getCurrentTimeFormatted,
} from "../utils/scripts.js";

const router = express.Router();

router.put("/", async (req, res) => {
  const { email } = req.body;

  console.log(email);
  const agents = await fetchAgents();
  const agent = agents.find((agent) => agent.email === email);
  const date = Date.now()
  if (agent) {
    agent.confirmedMailing = false;
    await agent.save();
    const activity = new UserActivity({
        action: "הסיר את עצמו מרשימת תפוצה",
        title: "הסרה מרשימת תפוצה",
        createdBy: "undefined",
        entityName: agent.name,
        description: `${agent.name} - הסיר את עצמו מרשימת תפוצה 
       בתאריך ${getCurrentDateFormatted(date)} בשעה ${getCurrentTimeFormatted(
          date
        )}`,
        color: 'orange',
        createdAt: date,
      });
      await activity.save();
    res.status(200).send("Successfully saved agent details");
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
});

export default router;
