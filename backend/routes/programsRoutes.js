import express from "express";
import xlsx from "xlsx";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import {
  readExcelFile,
  getCurrentDateFormatted,
  formatDates,
  removeUnwantedColumns,
  getAgentsFromDB,
  getEmployeesFromDB,
  replaceKeysInArray,
} from "../utils/scripts.js";

const mailFrom = "statusim@tlp-ins.co.il";
const transporter = nodemailer.createTransport({
  service: "outlook", // e.g., 'gmail'
  auth: {
    user: mailFrom,
    pass: process.env.PASSWORD_TO_MAIL,
  },
});

const router = express.Router();

const sendMailsWithFile = (agentMap, weeklyStatus) => {
  agentMap.forEach((agentInfo) => {
    const wb = xlsx.utils.book_new();
    let ws = xlsx.utils.json_to_sheet(agentInfo.data);
    ws = removeUnwantedColumns(ws);
    xlsx.utils.book_append_sheet(wb, ws, "Agent Data");
    const excelFileName = `../uploads/status-by-agent/${agentInfo.name}.xlsx`;
    xlsx.writeFile(wb, excelFileName);
    console.log(`Excel file saved for ${agentInfo.name}`);

    // Generate HTML table from the worksheet after removing unwanted columns
    const wsData = xlsx.utils.sheet_to_json(ws, { header: 1 });
    const htmlTable = `
    <html>
    <head>
        <style>

            .center {
                display: flex;
                justify-content: center;
            }
            .styled-table {
                border-collapse: collapse;
                margin: 25px 0;
                font-size: 0.9em;
                font-family: sans-serif;
                min-width: 600px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .styled-table thead tr {
                background-color: #DC5F00;
                color: #ffffff;
                text-align: right;
            }
            .styled-table th {
                padding: 12px 15px;
                text-align: right; /* Aligned text to the right */
            }
            .styled-table td {
                padding: 12px 15px;
                text-align: right;
            }
            .styled-table tbody tr {
                border-bottom: 1px solid #dddddd;
            }
            .styled-table tbody tr:nth-of-type(even) {
                background-color: #f3f3f3;
            }
            .styled-table tbody tr:last-of-type {
                border-bottom: 2px solid #DC5F00;
            }
            .styled-table tbody tr.active-row {
                font-weight: bold;
                color: #DC5F00;
            }
        </style>
    </head>
    <body>
    <p>לפניך מקרא המסביר את הסטטוסים:</p>
        <div class="center">
            <table class="styled-table" dir="rtl">
                <tr>    
                    <th>ספרה</th>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>0/5</td>
                </tr>
                <tr>
                    <th>סטטוס</th>
                    <td>ללא מענה</td>
                    <td>הצעה</td>
                    <td>בתהליך</td>
                    <td>הופק</td>
                    <td>סירוב</td>
                </tr>
            </table>
        </div>
        <div class="center">
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>#</th>
                        ${wsData[0]
                          .map((header) => `<th>${header}</th>`)
                          .join("")}
                    </tr>
                </thead>
                <tbody>
                    ${wsData
                      .slice(1)
                      .map(
                        (row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            ${row
                              .map(
                                (cell) =>
                                  `<td>${cell !== undefined ? cell : ""}</td>`
                              )
                              .join("")}
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
    </body>
    </html>
`;

    const mailOptions = {
      from: mailFrom,
      to: `${agentInfo.email}`,
      cc: `${agentInfo.addMail}`,
      subject:
        (weeklyStatus ? `סטטוס לקוחות שבועי - ` : "סטטוס לקוחות יומי - ") +
        ` ${agentInfo.name} ${getCurrentDateFormatted()}`,
      html: `Dear ${agentInfo.name},<br><br>Please find attached the latest status report.<br><br>Best regards,<br>Your Company<br><br>${htmlTable}`,
      attachments: [
        {
          filename: weeklyStatus
            ? `סטטוס לקוחות שבועי ${agentInfo.name}.xlsx`
            : `סטטוס לקוחות יומי ${agentInfo.name}.xlsx`,
          path: excelFileName,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(
          `Error sending email to ${agentInfo.name}: ${error}`
        );
      }
      console.log(`Email sent to ${agentInfo.name}: ${info.response}`);
    });
  });
};

const groupDataByAgent = (agentsArray, weeklyStatus) => {
  // Create a map to group agents by their name
  const agentMap = new Map();

  agentsArray.forEach((agent) => {
    const agentName = agent["שם סוכן"]; // Assuming 'שם סוכן' is the property containing the agent's name
    const agentEmail = agent["מייל של סוכן"]; // Assuming 'מייל של סוכן' is the property containing the agent's email
    const agentAddEmail = agent["מייל נוסף"]; // Assuming 'מייל נוסף' is the property containing the agent's additional email
    if (!agentMap.has(agentName)) {
      agentMap.set(agentName, {
        name: agentName,
        email: agentEmail,
        addMail: agentAddEmail,
        data: [],
      });
    }
    agentMap.get(agentName).data.push(agent);
  });

  sendMailsWithFile(agentMap, weeklyStatus);
};

router.post("/general", async (req, res) => {
  try {
    const weeklyStatus = req.body.weeklyStatus;
    let data = readExcelFile();
    const agents = await getAgentsFromDB();
    const employees = await getEmployeesFromDB();

    for (const item of data) {
      const agent = agents.find(
        (agent) => agent.name === item["סוכן בכרטיס לקוח"]
      );
      const employee = employees.find(
        (employee) => employee.name === item["שם מטפל"]
      );
      if (
        agent && agent.additionalMail && !weeklyStatus
          ? !agent.weeklyStatus
          : true
      ) {
        item["מייל נוסף"] = agent.additionalMail;
      }
      if (agent && agent.email && !weeklyStatus ? !agent.weeklyStatus : true) {
        item["מייל של סוכן"] = agent.email;
      }
      if (employee && employee.subject) {
        item["תחום"] = employee.subject;
      }
    }

    const keyReplacements = {
      "סוכן בכרטיס לקוח": "שם סוכן",
      "שדה כללי 1": "סטטוס",
    };

    data = replaceKeysInArray(data, keyReplacements);
    formatDates(data);
    groupDataByAgent(data, weeklyStatus);
    res.json(data);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
