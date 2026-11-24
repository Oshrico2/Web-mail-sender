import UserActivity from "../models/userActivityModel.js";
import { getCurrentDateFormatted, getCurrentTimeFormatted } from "./scripts.js";

// Activity is recorded on the server, inside the request that made the change.
// The old client-side "log after success" call could be skipped, forged, or
// logged for a request that actually failed.
export const logActivity = async (
  req,
  { title, action, entityName = "", color = "blue", actor }
) => {
  try {
    const date = Date.now();
    const username = actor || req?.user?.username || "מערכת";
    const description = `${entityName} - ${action} על ידי ${username} בתאריך ${getCurrentDateFormatted(
      date
    )} בשעה ${getCurrentTimeFormatted(date)}`;

    await UserActivity.create({
      action,
      title,
      createdBy: username,
      entityName,
      description,
      color,
      createdAt: date,
    });
  } catch (error) {
    // Logging must never fail the operation it describes.
    console.error("Failed to record activity:", error.message);
  }
};
