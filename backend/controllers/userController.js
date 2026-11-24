import User from "../models/userModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, HttpError } from "../utils/http.js";

const MIN_PASSWORD = 6;

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ firstName: 1 });
  res.json(users);
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
  const pattern = { $regex: escapeRegex(req.params.name), $options: "i" };
  const users = await User.find({
    $or: [{ firstName: pattern }, { lastName: pattern }, { username: pattern }],
  }).select("-password");
  res.json(users);
});

export {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByName,
};
