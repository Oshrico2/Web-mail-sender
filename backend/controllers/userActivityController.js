import UserActivity from "../models/userActivityModel.js";
import {
  getCurrentDateFormatted,
  getCurrentTimeFormatted,
  getUsername,
} from "../utils/scripts.js";

// @desc    get all user activity records
// @route   GET /api/users-activity/
// @access  Admin

const getAllUserActivities = async (req, res) => {
  try {
    const userActivity = await UserActivity.find({}).sort({ createdAt: -1 }); // -1 for descending order
    res.send(userActivity);
  } catch (error) {
    console.error("Error fetching userActivity:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    add a new user activity record
// @route   POST /api/users-activity/add
// @access  Admin
const addUserActivity = async (req, res) => {
  try {
    const { action, entityName,title,color } = req.body;
    const date = Date.now();
    const username = getUsername(req.cookies.token);
    const description = `${entityName} - ${action} על ידי ${ username
    } בתאריך ${getCurrentDateFormatted(date)} בשעה ${getCurrentTimeFormatted(
      date
    )}`;

    const newUserActivity = new UserActivity({
      action,
      title,
      createdBy: username,
      entityName,
      description,
      color
    });

    await newUserActivity.save();
    res.status(201).json(newUserActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    get a user activity record by ID
// @route   GET /api/users-activity/:id
// @access  Admin
const getUserActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const userActivity = await UserActivity.findById(id);
    if (!userActivity) {
      return res.status(404).json({ message: "User activity not found" });
    }
    res.json(userActivity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getAllUserActivities, getUserActivityById, addUserActivity };
