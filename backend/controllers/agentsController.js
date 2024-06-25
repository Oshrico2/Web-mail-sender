import Agent from "../models/agentModel.js";
import { getUsername } from "../utils/scripts.js";

// @desc    Get all agents
// @route   GET /api/agents/all
// @access  Private
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).sort({ name: 1 }); // 1 for ascending order
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get weekly agents
// @route   GET /api/agents/per-week
// @access  Private
const getAllWeeklyAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ weeklyStatus: true }).sort({ name: 1 });
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get agents that doesnt get customer status
// @route   GET /api/agents/no-customer-status
// @access  Private
const getAllNoCustomerStatusAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ customerStatus: false }).sort({ name: 1 });
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get 10 recently added agents
// @route   GET /api/agents/recently-added
// @access  Private
const getTenRecentlyAddedAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).sort({ createdAt: -1 }).limit(10);
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get confirmed Mailing agents
// @route   GET /api/agents/confirmed-mailing
// @access  Private
const getAllConfirmedMailingAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ confirmedMailing: { $ne: false } }).sort({
      name: 1,
    });
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Search agents by name
// @route   GET /api/agents/search/:name
// @access  Private
const searchAgentsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const agents = await Agent.find({ name: { $regex: name, $options: "i" } });
    res.json(agents);
  } catch (error) {
    console.error("Error searching agents by name:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add an agent
// @route   POST /api/agents/add
// @access  Private
const addAgent = async (req, res) => {
  const { name, firstName, lastName, email, agentNumber, additionalMail } = req.body;
  const agent = new Agent({
    name: name,
    firstName: firstName,
    lastName: lastName,
    email: email,
    agentNumber: agentNumber,
    additionalMail: additionalMail,
    createdBy:getUsername(req.cookies.token),
  });

  await agent.save();
  res.status(200).json({ message: "Agent added successfully" });
};

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private
const getAgentById = async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (agent) {
    res.json(agent);
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
};

// @desc    Update agent by ID
// @route   PUT /api/agents/:id
// @access  Private
const updateAgentById = async (req, res) => {
  const {
    name,
    firstName,
    lastName,
    email,
    agentNumber,
    additionalMail,
    customerStatus,
    weeklyStatus,
    confirmedMailing,
  } = req.body;

  const agent = await Agent.findById(req.params.id);

  if (agent) {
    agent.name = name !== undefined ? name : agent.name;
    agent.firstName = firstName !== undefined ? firstName : agent.firstName;
    agent.lastName = lastName !== undefined ? lastName : agent.lastName;
    agent.email = email !== undefined ? email : agent.email;
    agent.agentNumber =
      agentNumber !== undefined ? agentNumber : agent.agentNumber;
    agent.additionalMail =
      additionalMail !== undefined ? additionalMail : agent.additionalMail;
    agent.customerStatus =
    customerStatus !== undefined ? customerStatus : agent.customerStatus;
      agent.weeklyStatus =
      weeklyStatus !== undefined ? weeklyStatus : agent.weeklyStatus;
    agent.confirmedMailing =
      confirmedMailing !== undefined
        ? confirmedMailing
        : agent.confirmedMailing;
    agent.updatedAt = Date.now();
    const updatedAgent = await agent.save();
    res.json(updatedAgent);
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
};

// @desc    Delete agent by ID
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgentById = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }
    res.json({ message: "Agent removed successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Change agent by ID to weekly status
// @route   PUT /api/agents/:id
// @access  Private

const changeToWeeklyStatus = async (req, res) => {
  const agent = await Agent.findById(req.params.id);
  if (agent) {
    agent.weeklyStatus = true;
    res.json({ message: "The agent will get 1 status in week" });
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
};

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
