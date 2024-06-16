import Campaign from "../models/campaignModel.js";

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort({ name: 1 }); // 1 for ascending order
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get campaign by name
// @route   GET /api/campaigns/search/:name
// @access  Private
const getCampaignByName = async (req, res) => {
  try {
    const { name } = req.params;
    const campaign = await Campaign.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(campaign);
  } catch (error) {
    console.error("Error searching campaign by name:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add an campaign
// @route   POST /api/campaigns/add
// @access  Private
const addCampaign = async (req, res) => {
  const { name } = req.body;
  const campaign = new Campaign({
    name: name,
  });

  await campaign.save();
  res.status(200).json({ message: "Campaign added successfully" });
};

// @desc    Get campaign by ID
// @route   GET /api/campaigns/:id
// @access  Private
const getCampaignById = async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    res.json(campaign);
  } else {
    res.status(404);
    throw new Error("Campaign not found");
  }
};

// @desc    Update campaign by ID
// @route   PUT /api/campaigns/:id
// @access  Private
const updateCampaignById = async (req, res) => {
  const { name } = req.body;

  const campaign = await Campaign.findById(req.params.id);

  if (campaign) {
    campaign.name = name !== undefined ? name : campaign.name;
    const updatedCampaign = await campaign.save();
    res.json(updatedCampaign);
  } else {
    res.status(404);
    throw new Error("Campaign not found");
  }
};

// @desc    Delete campaign by ID
// @route   DELETE /api/campaigns/:id
// @access  Private
const deleteCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" });
      return;
    }
    res.json({ message: "Campaign removed successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllCampaigns,
  addCampaign,
  getCampaignByName,
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
