import express from 'express'
import {
  getUserActivityById,
  getAllUserActivities,
  addUserActivity,
} from "../controllers/userActivityController.js";

const router = express.Router();

router.route('/add').post(addUserActivity);
router.route('/').get(getAllUserActivities);
router.route('/:id').get(getUserActivityById);

export default router