import express from "express";
import {
  getUserActivityById,
  getAllUserActivities,
  addUserActivity,
} from "../controllers/userActivityController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/add").post(addUserActivity);
// Reading the log is admin-only; it used to be open to every logged-in user.
router.route("/").get(requireAdmin, getAllUserActivities);
router.route("/:id").get(requireAdmin, getUserActivityById);

export default router;
