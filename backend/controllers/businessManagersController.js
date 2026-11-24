import BusinessManager from "../models/businessManagerModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { paginate, readListParams } from "../utils/paginate.js";

const LIST_OPTIONS = {
  sortable: ["name", "email"],
  defaultSort: "name",
  searchFields: ["name", "email", "lettersOfLastNamesUnderCare"],
};

// Each surname letter belongs to at most one manager. This used to be checked
// only in the browser, so two tabs (or a direct API call) could break it.
const assertLettersFree = async (letters = [], exceptId) => {
  const others = await BusinessManager.find(
    exceptId ? { _id: { $ne: exceptId } } : {}
  );
  const taken = [];
  for (const manager of others) {
    for (const letter of manager.lettersOfLastNamesUnderCare) {
      if (letters.includes(letter)) taken.push(`${letter} (${manager.name})`);
    }
  }
  if (taken.length) {
    throw new HttpError(409, `אותיות שכבר משויכות למנהל אחר: ${taken.join(", ")}`);
  }
};

const uniqueLetters = (letters) =>
  Array.isArray(letters) ? [...new Set(letters.map((l) => String(l).trim()))] : letters;

// @route   GET /api/business-managers?page=&limit=&sort=&q=
const getAllBusinessManagers = asyncHandler(async (req, res) => {
  const params = readListParams(req, LIST_OPTIONS);
  res.json(await paginate(BusinessManager, params.search || {}, params));
});

// @desc    Which manager owns each surname letter (small, fixed size: ≤22)
// @route   GET /api/business-managers/letters
const getLetterOwners = asyncHandler(async (req, res) => {
  const managers = await BusinessManager.find({}).select("name lettersOfLastNamesUnderCare").lean();
  const owners = {};
  for (const m of managers) {
    for (const letter of m.lettersOfLastNamesUnderCare) owners[letter] = { _id: m._id, name: m.name };
  }
  res.json({ managers: managers.length, owners });
});

// @route   POST /api/business-managers/add
const addBusinessManager = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const letters = uniqueLetters(req.body.lettersOfLastNamesUnderCare) || [];
  await assertLettersFree(letters);
  const manager = await BusinessManager.create({
    name,
    email,
    lettersOfLastNamesUnderCare: letters,
    createdBy: req.user.username,
  });
  await logActivity(req, {
    title: "הוספת מנהל פיתוח עסקי",
    action: "נוסף",
    entityName: manager.name,
    color: "green",
  });
  res.status(201).json(manager);
});

// @route   GET /api/business-managers/:id
const getBusinessManagerById = asyncHandler(async (req, res) => {
  const manager = await BusinessManager.findById(req.params.id);
  if (!manager) throw new HttpError(404, "המנהל לא נמצא");
  res.json(manager);
});

// @route   PUT /api/business-managers/:id
const updateBusinessManagerById = asyncHandler(async (req, res) => {
  const manager = await BusinessManager.findById(req.params.id);
  if (!manager) throw new HttpError(404, "המנהל לא נמצא");

  const { name, email } = req.body;
  const letters = uniqueLetters(req.body.lettersOfLastNamesUnderCare);
  if (letters !== undefined) {
    await assertLettersFree(letters, manager._id);
    manager.lettersOfLastNamesUnderCare = letters;
  }
  if (name !== undefined) manager.name = name;
  if (email !== undefined) manager.email = email;
  manager.updatedAt = Date.now();
  manager.updatedBy = req.user.username;

  const updated = await manager.save();
  await logActivity(req, {
    title: "עדכון מנהל פיתוח עסקי",
    action: "עודכן",
    entityName: updated.name,
    color: "orange",
  });
  res.json(updated);
});

// @route   DELETE /api/business-managers/:id
const deleteBusinessManagerById = asyncHandler(async (req, res) => {
  const manager = await BusinessManager.findByIdAndDelete(req.params.id);
  if (!manager) throw new HttpError(404, "המנהל לא נמצא");
  await logActivity(req, {
    title: "הסרת מנהל פיתוח עסקי",
    action: "נמחק",
    entityName: manager.name,
    color: "red",
  });
  res.json({ message: "המנהל נמחק" });
});

export {
  getAllBusinessManagers,
  addBusinessManager,
  getBusinessManagerById,
  updateBusinessManagerById,
  deleteBusinessManagerById,
  getLetterOwners,
};
