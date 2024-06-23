import express from "express";
import nodemailer from "nodemailer";
import { getCurrentDateFormatted } from "../utils/scripts.js";

import {
  getAllBusinessManagers,
  addBusinessManager,
  getBusinessManagerById,
  updateBusinessManagerById,
  deleteBusinessManagerById,
} from "../controllers/businessManagersController.js";

import {
  fetchAgents,
  fetchBusinessManagers,
  fetchEmployees,
  fetchCampaigns,
  removeFields,
} from "../utils/scripts.js";

const countManagers = (data) => {
  const managerCounts = {};

  // Iterate over the data to count occurrences of each מנהל פיתוח עסקי
  data.forEach((item) => {
    if (item["מנהל פיתוח עסקי"] !== "") {
      const manager = item["מנהל פיתוח עסקי"];
      if (manager) {
        if (!managerCounts[manager]) {
          managerCounts[manager] = 0;
        }
        managerCounts[manager]++;
      }
    }
  });

  // Convert the managerCounts object into an array of objects
  const result = Object.keys(managerCounts).map((manager) => ({
    name: manager,
    amount: managerCounts[manager],
  }));
  return result;
};

const sendReportMail = async (mailTo, data, agentsNoFind) => {
  // Constructing the HTML table dynamically
  let rows = data
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.amount}</td>
    </tr>
  `
    )
    .join("");

  let totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  let htmlContent = `
  <html>
  <head>
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table, th, td {
        border: 1px solid black;
      }
      th, td {
        padding: 8px;
        max-width:20px;
        text-align: right;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body dir="rtl">
    <p>סה״כ סוכנים שלא נמצאו: ${agentsNoFind}</p>
    <table dir="rtl">
      <tr>
        <th>שם</th>
        <th>כמות</th>
      </tr>
      ${rows}
    </table>
    <p>סה״כ לידים שהועברו: ${totalAmount}</p>
  </body>
  </html>
  `;

  // Setting up Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "sinergia@tlp-ins.co.il", // Your email address
      pass: process.env.PASSWORD_TO_MAIL2, // Your email password or app-specific password
    },
  });

  // Email options
  let mailOptions = {
    from: "sinergia@tlp-ins.co.il",
    to: mailTo,
    subject: `דוח למנהלי פאמיליס אופיס ${getCurrentDateFormatted()}`,
    html: htmlContent,
  };

  try {
    // Sending email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Propagate the error back to handle in the calling function
  }
};

const router = express.Router();

router.route("/").get(getAllBusinessManagers);
router.route("/add").post(addBusinessManager);
router
  .route("/:id")
  .get(getBusinessManagerById)
  .put(updateBusinessManagerById)
  .delete(deleteBusinessManagerById);

router.post("/report/create", async (req, res) => {
  let noAgentInDataSet = new Set();
  try {
    const { jsonData, email } = req.body; // Make sure `email` is correctly received

    const campaigns = await fetchCampaigns();
    const agents = await fetchAgents();
    const businessManagers = await fetchBusinessManagers();
    const employees = await fetchEmployees();
    const filteredData = jsonData.filter(
      (obj) =>
        !campaigns.some((campaign) => campaign.name === obj["סוכן בכרטיס לקוח"])
    );

    for (let obj of filteredData) {
      const agentName = obj["סוכן בכרטיס לקוח"];
      const matchingAgent = agents.find((agent) => agent.name === agentName);

      if (matchingAgent && matchingAgent.lastName) {
        const lastName = matchingAgent.lastName;
        const manager = businessManagers.find((manager) =>
          manager.lettersOfLastNamesUnderCare.includes(lastName.charAt(0))
        );

        if (obj["שם מטפל"]) {
          const employee = employees.find(
            (employee) => employee.name === obj["שם מטפל"]
          );
          obj["תחום"] = employee ? employee.subject : "";
        } else {
          obj["תחום"] = "";
        }

        obj["מנהל פיתוח עסקי"] = manager ? manager.name : "";
      } else {
        noAgentInDataSet.add(agentName);
        obj["מנהל פיתוח עסקי"] = "";
      }
    }
    removeFields(filteredData, [
      "הערות",
      "תאריך יצירה",
      "תאריך שינוי",
      "טלפון 1",
    ]);
    const noAgentInDataList = Array.from(noAgentInDataSet);

    if (email !== "") {
      const managerCounts = countManagers(filteredData);
      sendReportMail(email, managerCounts, noAgentInDataList.length);
    }

    res.json({ filteredData, noAgentInDataList });
  } catch (error) {
    console.error("Error processing report:", error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;
