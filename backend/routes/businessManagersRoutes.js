import express from "express";
import nodemailer from "nodemailer";
import {
  getCurrentDateFormatted,
  fetchAgents,
  fetchBusinessManagers,
  fetchEmployees,
  fetchCampaigns,
  removeFields,
  normalizeName,
} from "../utils/scripts.js";
import {
  getAllBusinessManagers,
  addBusinessManager,
  getBusinessManagerById,
  updateBusinessManagerById,
  deleteBusinessManagerById,
  getLetterOwners,
} from "../controllers/businessManagersController.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeHtml, HttpError, isEmail } from "../utils/http.js";

const MANAGER_COLUMN = "מנהל פיתוח עסקי";
const MAIL_FROM = "sinergia@tlp-ins.co.il";

const countManagers = (data) => {
  const counts = new Map();
  for (const item of data) {
    const manager = item[MANAGER_COLUMN];
    if (manager) counts.set(manager, (counts.get(manager) || 0) + 1);
  }
  return [...counts].map(([name, amount]) => ({ name, amount }));
};

const sendReportMail = async (mailTo, data, agentsNotFound) => {
  const rows = data
    .map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${item.amount}</td></tr>`)
    .join("");
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const html = `
  <html>
  <head>
    <style>
      table { width: 100%; border-collapse: collapse; }
      table, th, td { border: 1px solid black; }
      th, td { padding: 8px; max-width: 20px; text-align: right; }
      th { background-color: #f2f2f2; }
    </style>
  </head>
  <body dir="rtl">
    <p>סה״כ סוכנים שלא נמצאו: ${agentsNotFound}</p>
    <table dir="rtl">
      <tr><th>שם</th><th>כמות</th></tr>
      ${rows}
    </table>
    <p>סה״כ לידים שהועברו: ${totalAmount}</p>
  </body>
  </html>`;

  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: { user: MAIL_FROM, pass: process.env.PASSWORD_TO_MAIL2 },
  });
  await transporter.sendMail({
    from: MAIL_FROM,
    to: mailTo,
    subject: `דוח למנהלי פאמיליס אופיס ${getCurrentDateFormatted()}`,
    html,
  });
};

const router = express.Router();

router.route("/").get(getAllBusinessManagers);
router.route("/letters").get(getLetterOwners);
router.route("/add").post(addBusinessManager);

// @desc    Assign each lead to a business-development manager by the first
//          letter of the agent's last name.
// @route   POST /api/business-managers/report/create  { jsonData: [], email?: string }
router.post(
  "/report/create",
  asyncHandler(async (req, res) => {
    const { jsonData } = req.body;
    const email = String(req.body.email || "").trim();
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new HttpError(400, "הקובץ ריק");
    }
    if (!jsonData.some((row) => row && Object.hasOwn(row, "סוכן בכרטיס לקוח"))) {
      throw new HttpError(400, 'בקובץ חסרה העמודה "סוכן בכרטיס לקוח"');
    }
    if (email && !isEmail(email)) {
      throw new HttpError(400, "כתובת המייל לדוח אינה תקינה");
    }

    const [campaigns, agents, businessManagers, employees] = await Promise.all([
      fetchCampaigns(),
      fetchAgents(),
      fetchBusinessManagers(),
      fetchEmployees(),
    ]);
    const campaignNames = new Set(campaigns.map((c) => normalizeName(c.name)));
    const agentByName = new Map(agents.map((a) => [normalizeName(a.name), a]));
    const employeeByName = new Map(employees.map((e) => [normalizeName(e.name), e]));
    const notFound = new Set();

    const filteredData = jsonData.filter(
      (obj) => !campaignNames.has(normalizeName(obj["סוכן בכרטיס לקוח"]))
    );

    for (const obj of filteredData) {
      const agentName = normalizeName(obj["סוכן בכרטיס לקוח"]);
      const agent = agentByName.get(agentName);
      const lastName = String(agent?.lastName || "").trim();

      if (agent && lastName) {
        const manager = businessManagers.find((m) =>
          m.lettersOfLastNamesUnderCare.includes(lastName.charAt(0))
        );
        const employee = obj["שם מטפל"]
          ? employeeByName.get(normalizeName(obj["שם מטפל"]))
          : null;
        obj["תחום"] = employee ? employee.subject : "";
        obj[MANAGER_COLUMN] = manager ? manager.name : "";
      } else {
        if (agentName) notFound.add(agentName);
        obj[MANAGER_COLUMN] = "";
      }
    }

    removeFields(filteredData, ["הערות", "תאריך יצירה", "תאריך שינוי", "טלפון 1"]);
    const noAgentInDataList = [...notFound];
    const managerCounts = countManagers(filteredData);

    // The mail used to be fired without await: a failure crashed the server
    // and the screen said "sent" either way.
    let emailSent = false;
    let emailError = null;
    if (email) {
      try {
        await sendReportMail(email, managerCounts, noAgentInDataList.length);
        emailSent = true;
      } catch (error) {
        console.error("Report mail failed:", error.message);
        emailError = "הדוח הופק אך שליחת המייל נכשלה";
      }
    }

    await logActivity(req, {
      title: "דוח למנהלי פיתוח עסקי",
      action: emailSent ? `דוח הופק ונשלח אל ${email}` : "דוח הופק",
      entityName: getCurrentDateFormatted(),
      color: "blue",
    });

    res.json({ filteredData, noAgentInDataList, managerCounts, emailSent, emailError });
  })
);

router
  .route("/:id")
  .get(getBusinessManagerById)
  .put(updateBusinessManagerById)
  .delete(deleteBusinessManagerById);

export default router;
