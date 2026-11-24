import Campaign from "../models/campaignModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, HttpError } from "../utils/http.js";

// @route   GET /api/campaigns
const getAllCampaigns = asyncHandler(async (req, res) => {
  res.json(await Campaign.find({}).sort({ name: 1 }));
});

// @route   GET /api/campaigns/search/:name
const getCampaignByName = asyncHandler(async (req, res) => {
  res.json(
    await Campaign.find({
      name: { $regex: escapeRegex(req.params.name), $options: "i" },
    }).sort({ name: 1 })
  );
});

// @route   POST /api/campaigns/add
const addCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({
    name: req.body.name,
    createdBy: req.user.username,
  });
  await logActivity(req, {
    title: "הוספת קמפיין",
    action: "נוסף",
    entityName: campaign.name,
    color: "green",
  });
  res.status(201).json(campaign);
});

// @route   GET /api/campaigns/:id
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new HttpError(404, "הקמפיין לא נמצא");
  res.json(campaign);
});

// @route   PUT /api/campaigns/:id
const updateCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new HttpError(404, "הקמפיין לא נמצא");
  if (req.body.name !== undefined) campaign.name = req.body.name;
  campaign.updatedAt = Date.now();
  campaign.updatedBy = req.user.username;
  const updated = await campaign.save();
  await logActivity(req, {
    title: "עדכון קמפיין",
    action: "עודכן",
    entityName: updated.name,
    color: "orange",
  });
  res.json(updated);
});

// @route   DELETE /api/campaigns/:id
const deleteCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!campaign) throw new HttpError(404, "הקמפיין לא נמצא");
  await logActivity(req, {
    title: "הסרת קמפיין",
    action: "נמחק",
    entityName: campaign.name,
    color: "red",
  });
  res.json({ message: "הקמפיין נמחק" });
});

export {
  getAllCampaigns,
  addCampaign,
  getCampaignByName,
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
