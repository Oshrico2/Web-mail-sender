import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler, rateLimit } from "../utils/http.js";

const router = express.Router();
const SESSION_MS = 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

const publicUser = (user) => ({
  _id: user._id,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isAdmin: user.isAdmin,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "יותר מדי ניסיונות התחברות, נסה שוב בעוד כמה דקות",
});

router.post(
  "/",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    if (!username || !password) {
      return res.status(400).json({ message: "יש להזין שם משתמש וסיסמא" });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "שם משתמש או סיסמא לא נכונים" });
    }

    // Only the id goes in the token. The previous token embedded the whole
    // user document, password hash included, readable by anyone holding it.
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: SESSION_MS / 1000,
    });
    const expiration = Date.now() + SESSION_MS;
    res.cookie("token", token, { ...cookieOptions(), maxAge: SESSION_MS });
    res.json({ expiration, user: publicUser(user) });
  })
);

// Who am I? Used by the app on load to validate the cookie session.
router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.json({ message: "התנתקת בהצלחה" });
});

export default router;
