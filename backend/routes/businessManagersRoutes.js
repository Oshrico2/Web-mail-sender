import express from "express";
import {
  getAllBusinessManagers,
  addBusinessManager,
  getBusinessManagerById,
  updateBusinessManagerById,
  deleteBusinessManagerById,
} from "../controllers/businessManagersController.js";

import {
  fetchAgents,
  fetchBusinessManagers,
  fetchEmployees,
  fetchCampaigns,
  removeFields,
} from "../utils/scripts.js";

const router = express.Router();

router.route("/").get(getAllBusinessManagers);
router.route("/add").post(addBusinessManager);
router
  .route("/:id")
  .get(getBusinessManagerById)
  .put(updateBusinessManagerById)
  .delete(deleteBusinessManagerById);

  router.post("/report/create", async (req, res) => {
    let noAgentInDataSet = new Set();
    try {
      const { jsonData } = req.body;
      const campaigns = await fetchCampaigns();
      const agents = await fetchAgents();
      const businessManagers = await fetchBusinessManagers();
      const employees = await fetchEmployees();
      const filteredData = jsonData.filter(
        (obj) =>
          !campaigns.some((campaign) => campaign.name === obj["סוכן בכרטיס לקוח"])
      );
  
      for (let obj of filteredData) {
        const agentName = obj['סוכן בכרטיס לקוח'];
        const matchingAgent = agents.find(agent => agent.name === agentName);
  
        if (matchingAgent && matchingAgent.lastName) {
          const lastName = matchingAgent.lastName;
          const manager = businessManagers.find(manager =>
            manager.lettersOfLastNamesUnderCare.includes(lastName.charAt(0))
          );
  
          if (obj['שם מטפל']) {
            const employee = employees.find(employee => employee.name === obj['שם מטפל']);
            obj['תחום'] = employee ? employee.subject : '';
          } else {
            obj['תחום'] = '';
          }
  
          obj['מנהל פיתוח עסקי'] = manager ? manager.name : '';
        } else {
          noAgentInDataSet.add(agentName);
          obj['מנהל פיתוח עסקי'] = '';
        }
      }
      removeFields(filteredData, ['הערות', 'תאריך יצירה', 'תאריך שינוי', 'שם מטפל', 'טלפון 1']);
      const noAgentInDataList = Array.from(noAgentInDataSet);
      res.json({ filteredData, noAgentInDataList });
    } catch (error) {
      console.error('Error processing report:', error);
      res.status(500).send('Internal Server Error');
    }
  });
export default router;
