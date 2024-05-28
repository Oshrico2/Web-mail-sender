import express from "express";
import {
  getAllAgents,
  addAgent,
  getAgentById,
  updateAgentById,
  deleteAgentById,
  changeToWeeklyStatus,
  getAllWeeklyAgents,
  searchAgentsByName
} from "../controllers/agentsController.js";

const router = express.Router();

router.route('/search/:name').get(searchAgentsByName);
router.route('/').get(getAllAgents);
router.route('/add').post(addAgent);
router.route('/per-week').get(getAllWeeklyAgents);
router.route('/:id/weekly-status').put(changeToWeeklyStatus);
router.route('/:id').get(getAgentById).put(updateAgentById).delete(deleteAgentById);

export default router;
