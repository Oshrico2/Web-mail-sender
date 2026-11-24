import Agent from "../models/agentModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { and, paginate, readListParams } from "../utils/paginate.js";

const EDITABLE = [
  "name",
  "firstName",
  "lastName",
  "email",
  "agentNumber",
  "additionalMail",
  "customerStatus",
  "weeklyStatus",
  "confirmedMailing",
];

// Named groups used by the list filters and the count strip.
export const AGENT_GROUPS = {
  all: {},
  daily: { customerStatus: { $ne: false }, weeklyStatus: { $ne: true } },
  weekly: { customerStatus: { $ne: false }, weeklyStatus: true },
  none: { customerStatus: false },
  mailing: { confirmedMailing: { $ne: false } },
  noMailing: { confirmedMailing: false },
};

const LIST_OPTIONS = {
  sortable: ["name", "agentNumber", "email", "additionalMail", "lastName", "confirmedMailing", "createdAt"],
  defaultSort: "name",
  searchFields: ["name", "email", "agentNumber", "additionalMail", "firstName", "lastName"],
};

// Agents whose last name starts with one of the given Hebrew letters
// (used by "associated agents" of a business manager).
const lettersFilter = (letters) => {
  const clean = String(letters || "").replace(/[^\u05D0-\u05EA]/g, "");
  return clean ? { lastName: { $regex: `^\\s*[${clean}]` } } : null;
};

const listAgents = (preset) =>
  asyncHandler(async (req, res) => {
    const params = readListParams(req, LIST_OPTIONS);
    const group = AGENT_GROUPS[preset || req.query.filter] || {};
    const filter = and(group, params.search, lettersFilter(req.query.letters));
    res.json(await paginate(Agent, filter, params));
  });

// @route   GET /api/agents?page=&limit=&sort=&q=&filter=&letters=
const getAllAgents = listAgents();
// Older paths kept for compatibility; all paginated now.
const getAllWeeklyAgents = listAgents("weekly");
const getAllNoCustomerStatusAgents = listAgents("none");
const getAllConfirmedMailingAgents = listAgents("mailing");

// @route   GET /api/agents/recently-added
const getTenRecentlyAddedAgents = asyncHandler(async (req, res) => {
  res.json(await Agent.find({}).sort({ createdAt: -1 }).limit(10));
});

// @route   GET /api/agents/search/:name  (kept; same as ?q=)
const searchAgentsByName = asyncHandler(async (req, res) => {
  req.query.q = req.params.name;
  const params = readListParams(req, LIST_OPTIONS);
  res.json(await paginate(Agent, params.search || {}, params));
});

// @desc    Counts per group for the count strip (no documents fetched)
// @route   GET /api/agents/stats
const getAgentStats = asyncHandler(async (req, res) => {
  const entries = await Promise.all(
    Object.entries(AGENT_GROUPS).map(async ([key, filter]) => [key, await Agent.countDocuments(filter)])
  );
  res.json(Object.fromEntries(entries));
});

// @route   POST /api/agents/add
const addAgent = asyncHandler(async (req, res) => {
  const { name, firstName, lastName, email, agentNumber, additionalMail } = req.body;
  const agent = await Agent.create({
    name,
    firstName,
    lastName,
    email,
    agentNumber,
    additionalMail,
    createdBy: req.user.username,
  });
  await logActivity(req, {
    title: "הוספת סוכן",
    action: "נוסף",
    entityName: agent.name,
    color: "green",
  });
  res.status(201).json(agent);
});

// @route   GET /api/agents/:id
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new HttpError(404, "הסוכן לא נמצא");
  res.json(agent);
});

// @route   PUT /api/agents/:id
const updateAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new HttpError(404, "הסוכן לא נמצא");

  for (const key of EDITABLE) {
    if (req.body[key] !== undefined) agent[key] = req.body[key];
  }
  agent.updatedAt = Date.now();
  agent.updatedBy = req.user.username;

  const updatedAgent = await agent.save();
  await logActivity(req, {
    title: "עדכון סוכן",
    action: "עודכן",
    entityName: updatedAgent.name,
    color: "orange",
  });
  res.json(updatedAgent);
});

// @route   DELETE /api/agents/:id
const deleteAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findByIdAndDelete(req.params.id);
  if (!agent) throw new HttpError(404, "הסוכן לא נמצא");
  await logActivity(req, {
    title: "הסרת סוכן",
    action: "נמחק",
    entityName: agent.name,
    color: "red",
  });
  res.json({ message: "הסוכן נמחק" });
});

// @route   PUT /api/agents/:id/weekly-status
// (previously set the flag but never saved it)
const changeToWeeklyStatus = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) throw new HttpError(404, "הסוכן לא נמצא");
  agent.weeklyStatus = true;
  agent.updatedAt = Date.now();
  agent.updatedBy = req.user.username;
  await agent.save();
  res.json({ message: "הסוכן יקבל סטטוס פעם בשבוע" });
});

export {
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
  getTenRecentlyAddedAgents,
  getAgentStats,
};
