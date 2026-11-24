import User from "../models/userModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { paginate, readListParams } from "../utils/paginate.js";

const LIST_OPTIONS = {
  sortable: ["firstName", "lastName", "username", "email", "isAdmin"],
  defaultSort: "firstName",
  searchFields: ["firstName", "lastName", "username", "email"],
};

const MIN_PASSWORD = 6;

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const params = readListParams(req, LIST_OPTIONS);
  res.json(await paginate(User, params.search || {}, { ...params, select: "-password" }));
});

// @desc    User counts for the count strip
// @route   GET /api/users/stats
const getUserStats = asyncHandler(async (req, res) => {
  const [total, admins] = await Promise.all([User.countDocuments({}), User.countDocuments({ isAdmin: true })]);
  res.json({ total, admins });
});

// @desc    Add a user
// @route   POST /api/users/add
// @access  Admin
const addUser = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password, isAdmin } = req.body;
  if (!password || String(password).length < MIN_PASSWORD) {
    throw new HttpError(400, `הסיסמא חייבת להכיל לפחות ${MIN_PASSWORD} תווים`);
  }
  const user = await User.create({
    username,
    firstName,
    lastName,
    email,
    password,
    isAdmin: Boolean(isAdmin),
    createdBy: req.user.username,
  });
  await logActivity(req, {
    title: "הוספת משתמש",
    action: "נוסף",
    entityName: user.username,
    color: "green",
  });
  res.status(201).json(user);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new HttpError(404, "המשתמש לא נמצא");
  res.json(user);
});

// @desc    Update user by ID (password only when a new one is given)
// @route   PUT /api/users/:id
// @access  Admin
const updateUserById = asyncHandler(async (req, res) => {
  const { username, firstName, lastName, email, password, isAdmin } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new HttpError(404, "המשתמש לא נמצא");

  const isSelf = String(user._id) === String(req.user._id);
  if (isSelf && isAdmin === false) {
    throw new HttpError(400, "לא ניתן להסיר הרשאות מנהל מעצמך");
  }

  if (username !== undefined) user.username = username;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (email !== undefined) user.email = email;
  if (isAdmin !== undefined) user.isAdmin = Boolean(isAdmin);
  if (password) {
    if (String(password).length < MIN_PASSWORD) {
      throw new HttpError(400, `הסיסמא חייבת להכיל לפחות ${MIN_PASSWORD} תווים`);
    }
    user.password = password;
  }
  user.updatedAt = Date.now();
  user.updatedBy = req.user.username;

  const updatedUser = await user.save();
  await logActivity(req, {
    title: "עדכון משתמש",
    action: password ? "עודכן (כולל סיסמא)" : "עודכן",
    entityName: updatedUser.username,
    color: "orange",
  });
  res.json(updatedUser);
});

// @desc    Delete user by ID
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUserById = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw new HttpError(400, "לא ניתן למחוק את המשתמש שלך");
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new HttpError(404, "המשתמש לא נמצא");
  await logActivity(req, {
    title: "הסרת משתמש",
    action: "נמחק",
    entityName: user.username,
    color: "red",
  });
  res.json({ message: "המשתמש נמחק" });
});

// @desc    Search users by first name, last name or username
// @route   GET /api/users/search/:name
// @access  Admin
const searchUserByName = asyncHandler(async (req, res) => {
  req.query.q = req.params.name;
  const params = readListParams(req, LIST_OPTIONS);
  res.json(await paginate(User, params.search || {}, { ...params, select: "-password" }));
});

export {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByName,
  getUserStats,
};
