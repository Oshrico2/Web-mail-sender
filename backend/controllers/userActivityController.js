import UserActivity from "../models/userActivityModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError } from "../utils/http.js";

const COLORS = new Set(["green", "orange", "red", "blue"]);

// @desc    Activity records, newest first, paginated
// @route   GET /api/users-activity?limit=50&skip=0
// @access  Admin
const getAllUserActivities = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
  const skip = Math.max(parseInt(req.query.skip, 10) || 0, 0);
  const [items, total] = await Promise.all([
    UserActivity.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserActivity.estimatedDocumentCount(),
  ]);
  res.set("X-Total-Count", String(total));
  res.json(items);
});

// @desc    Add an activity record (kept for compatibility; the server now
//          records every change itself)
// @route   POST /api/users-activity/add
// @access  Private
const addUserActivity = asyncHandler(async (req, res) => {
  const { action, entityName, title, color } = req.body;
  if (!action || !title) throw new HttpError(400, "חסרים פרטי פעולה");
  await logActivity(req, {
    action: String(action),
    title: String(title),
    entityName: String(entityName ?? ""),
    color: COLORS.has(color) ? color : "blue",
  });
  res.status(201).json({ message: "נרשם" });
});

// @route   GET /api/users-activity/:id
// @access  Admin
const getUserActivityById = asyncHandler(async (req, res) => {
  const activity = await UserActivity.findById(req.params.id);
  if (!activity) throw new HttpError(404, "הרשומה לא נמצאה");
  res.json(activity);
});

export { getAllUserActivities, getUserActivityById, addUserActivity };
