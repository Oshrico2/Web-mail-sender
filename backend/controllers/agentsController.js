import Agent from "../models/agentModel.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeRegex, HttpError } from "../utils/http.js";

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

const list = (filter) => Agent.find(filter).sort({ name: 1 });

// @route   GET /api/agents
const getAllAgents = asyncHandler(async (req, res) => {
  res.json(await list({}));
});

// @route   GET /api/agents/per-week
const getAllWeeklyAgents = asyncHandler(async (req, res) => {
  res.json(await list({ weeklyStatus: true }));
});

// @route   GET /api/agents/no-customer-status
const getAllNoCustomerStatusAgents = asyncHandler(async (req, res) => {
  res.json(await list({ customerStatus: false }));
});

// @route   GET /api/agents/recently-added
const getTenRecentlyAddedAgents = asyncHandler(async (req, res) => {
  res.json(await Agent.find({}).sort({ createdAt: -1 }).limit(10));
});

// @route   GET /api/agents/confirmed-mailing
const getAllConfirmedMailingAgents = asyncHandler(async (req, res) => {
  res.json(await list({ confirmedMailing: { $ne: false } }));
});

// @route   GET /api/agents/search/:name
const searchAgentsByName = asyncHandler(async (req, res) => {
  const pattern = { $regex: escapeRegex(req.params.name), $options: "i" };
  res.json(
    await list({ $or: [{ name: pattern }, { email: pattern }, { agentNumber: pattern }] })
  );
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
};
