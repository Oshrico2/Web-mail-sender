import express from "express";
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  searchUserByName,
} from "../controllers/userController.js";

const router = express.Router();

router.route('/search/:name').get(searchUserByName);
router.route("/").get(getAllUsers);
router.route("/add").post(addUser);
router
  .route("/:id")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

export default router;
