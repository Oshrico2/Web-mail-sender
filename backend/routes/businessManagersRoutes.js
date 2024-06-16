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
  try {
    const { jsonData } = req.body;
    const campaigns = await fetchCampaigns();
    const agents = await fetchAgents();
    const businessManagers = await fetchBusinessManagers();
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

            if (manager) {
                obj['מנהל פיתוח עסקי'] = manager.name;
            } else {
                obj['מנהל פיתוח עסקי'] = ''; 
            }
        }
        else{
            obj['מנהל פיתוח עסקי'] = ''; 
        }
    }
    removeFields(filteredData,['הערות','תאריך יצירה','תאריך שינוי','שם מטפל','טלפון 1']);
    console.log(filteredData);
    res.send(filteredData);
  } catch (error) {
    throw error;
  }
});

export default router;
