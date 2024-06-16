import express from "express";
import {
  getAllCampaigns,
  getCampaignByName,
  addCampaign,
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
} from "../controllers/campaignsController.js";


const router = express.Router();

router.route('/search/:name').get(getCampaignByName);
router.route('/').get(getAllCampaigns);
router.route('/add').post(addCampaign);
router.route('/:id').get(getCampaignById).put(updateCampaignById).delete(deleteCampaignById);

export default router;
