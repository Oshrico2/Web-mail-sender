import UserActivity from "../models/userActivityModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { and, paginate, readListParams } from "../utils/paginate.js";

const COLORS = new Set(["green", "orange", "red", "blue"]);

// @desc    Activity records, newest first, paginated
// @route   GET /api/users-activity?page=&limit=&q=&color=
// @access  Admin
const getAllUserActivities = asyncHandler(async (req, res) => {
  const params = readListParams(req, {
    sortable: ["createdAt"],
    defaultSort: "-createdAt",
    searchFields: ["title", "entityName", "action", "createdBy"],
  });
  const color = COLORS.has(req.query.color) ? { color: req.query.color } : null;
  res.json(await paginate(UserActivity, and(params.search, color), params));
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
