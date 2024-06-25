import BusinessManager from "../models/businessManagerModel.js";
import { getUsername } from "../utils/scripts.js";

// @desc    Get all businessManagers
// @route   GET /api/businessManagers
// @access  Private
const getAllBusinessManagers = async (req, res) => {
  try {
    const businessManagers = await BusinessManager.find({}).sort({ name: 1 }); // 1 for ascending order
    res.json(businessManagers);
  } catch (error) {
    console.error("Error fetching businessManagers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a businessManager
// @route   POST /api/businessManagers/add
// @access  Private
const addBusinessManager = async (req, res) => {
  const { name, email, lettersOfLastNamesUnderCare } = req.body;
  const businessManager = new BusinessManager({
    name: name,
    email: email,
    lettersOfLastNamesUnderCare: lettersOfLastNamesUnderCare,
    createdBy: getUsername(req.cookies.token),
  });

  await businessManager.save();
  res.status(200).json({ message: "BusinessManager added successfully" });
};

// @desc    Get businessManager by ID
// @route   GET /api/businessManagers/:id
// @access  Private
const getBusinessManagerById = async (req, res) => {
  const businessManager = await BusinessManager.findById(req.params.id);

  if (businessManager) {
    res.json(businessManager);
  } else {
    res.status(404);
    throw new Error("BusinessManager not found");
  }
};

// @desc    Update businessManager by ID
// @route   PUT /api/businessManagers/:id
// @access  Private
const updateBusinessManagerById = async (req, res) => {
  const { name, email, lettersOfLastNamesUnderCare } = req.body;

  const businessManager = await BusinessManager.findById(req.params.id);

  if (businessManager) {
    businessManager.name = name !== undefined ? name : businessManager.name;
    businessManager.email = email !== undefined ? email : businessManager.email;
    businessManager.lettersOfLastNamesUnderCare =
      lettersOfLastNamesUnderCare !== undefined
        ? lettersOfLastNamesUnderCare
        : businessManager.lettersOfLastNamesUnderCare;
    businessManager.updatedAt = Date.now();

    const updatedBusinessManager = await businessManager.save();
    res.json(updatedBusinessManager);
  } else {
    res.status(404);
    throw new Error("BusinessManager not found");
  }
};

// @desc    Delete businessManager by ID
// @route   DELETE /api/businessManagers/:id
// @access  Private
const deleteBusinessManagerById = async (req, res) => {
  try {
    const businessManager = await BusinessManager.findByIdAndDelete(
      req.params.id
    );
    if (!businessManager) {
      res.status(404).json({ message: "BusinessManager not found" });
      return;
    }
    res.json({ message: "BusinessManager removed successfully" });
  } catch (error) {
    console.error("Error deleting businessManager:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getAllBusinessManagers,
  addBusinessManager,
  getBusinessManagerById,
  updateBusinessManagerById,
  deleteBusinessManagerById,
};
