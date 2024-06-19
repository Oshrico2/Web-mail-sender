import express from "express";
import {
  getAllAgents,
  addAgent,
  getAgentById,
  updateAgentById,
  deleteAgentById,
  changeToWeeklyStatus,
  getAllWeeklyAgents,
  getAllConfirmedMailingAgents,
  searchAgentsByName,
  getAllNoCustomerStatusAgents,
  getTenRecentlyAddedAgents
} from "../controllers/agentsController.js";

const router = express.Router();
router.route('/search/:name').get(searchAgentsByName);
router.route('/').get(getAllAgents);
router.route('/add').post(addAgent);
router.route('/per-week').get(getAllWeeklyAgents);
router.route('/no-customer-status').get(getAllNoCustomerStatusAgents);
router.route('/recently-added').get(getTenRecentlyAddedAgents);
router.route('/confirmed-mailing').get(getAllConfirmedMailingAgents);
router.route('/:id/weekly-status').put(changeToWeeklyStatus);
router.route('/:id').get(getAgentById).put(updateAgentById).delete(deleteAgentById);

export default router;
