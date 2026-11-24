import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const readUserId = (decoded) =>
  // New tokens carry `userId`; tokens issued before this change embedded the
  // whole user document under `user`. Accept both so nobody is logged out.
  decoded?.userId || decoded?.user?._id;

// User must be authenticated. Loads the user fresh from the DB so a deleted
// user or a revoked admin flag takes effect immediately.
const protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "נדרשת התחברות" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(readUserId(decoded)).select("-password");
    if (!user) {
      return res.status(401).json({ message: "המשתמש אינו קיים" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "פג תוקף ההתחברות" });
  }
};

// User must be an admin. Always runs after `protect`.
const requireAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: "אין לך הרשאת מנהל" });
};

const admin = [protect, requireAdmin];

export { protect, admin, requireAdmin };
