import Agent from "../models/agentModel.js";
import Employee from "../models/employeeModel.js";
import Campaign from "../models/campaignModel.js";
import BusinessManager from "../models/businessManagerModel.js";

// The server runs in UTC on Render; every date the staff or the agents read
// must be Israel time.
const TIME_ZONE = "Asia/Jerusalem";

const getCurrentDateFormatted = (date = Date.now()) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));

const getCurrentTimeFormatted = (date = Date.now()) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));

const fetchAgents = () => Agent.find({}).sort({ name: 1 });
const fetchCampaigns = () => Campaign.find({}).sort({ name: 1 });
const fetchEmployees = () => Employee.find({}).sort({ name: 1 });
const fetchBusinessManagers = () => BusinessManager.find({}).sort({ name: 1 });

const replaceKeysInArray = (array, keyMap) =>
  array.map((obj) => {
    const replaced = {};
    for (const key of Object.keys(obj)) {
      replaced[Object.hasOwn(keyMap, key) ? keyMap[key] : key] = obj[key];
    }
    return replaced;
  });

const removeFields = (data, fieldsToRemove) =>
  data.map((obj) => {
    fieldsToRemove.forEach((field) => delete obj[field]);
    return obj;
  });

// Names in the CRM export and in the DB are compared after trimming and
// collapsing inner whitespace, so "כהן  משה " still matches "כהן משה".
const normalizeName = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

export {
  getCurrentDateFormatted,
  getCurrentTimeFormatted,
  fetchAgents,
  fetchEmployees,
  fetchCampaigns,
  fetchBusinessManagers,
  replaceKeysInArray,
  removeFields,
  normalizeName,
};
