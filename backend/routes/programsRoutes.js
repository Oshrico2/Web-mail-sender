import express from "express";
import xlsx from "xlsx";
import nodemailer from "nodemailer";
import {
  getCurrentDateFormatted,
  fetchAgents,
  fetchEmployees,
  replaceKeysInArray,
  normalizeName,
} from "../utils/scripts.js";
import { logActivity } from "../utils/activity.js";
import { asyncHandler, escapeHtml, HttpError, isEmail } from "../utils/http.js";

const mailFrom = "statusim@tlp-ins.co.il";
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: { user: mailFrom, pass: process.env.PASSWORD_TO_MAIL },
});

const router = express.Router();

// Columns that stay internal and never reach the agent.
const HIDDEN_COLUMNS = ["טלפון 1", "מייל נוסף", "מייל של סוכן", "סלולרי לקוח"];

const PROGRAMS = {
  daily: { label: "יומי", title: "שליחת סטטוס יומי", action: "סטטוס יומי לסוכן נשלח" },
  weekly: { label: "שבועי", title: "שליחת סטטוס שבועי", action: "סטטוס שבועי לסוכן נשלח" },
  "בריאות": { label: "בריאות", title: "שליחת סטטוס בריאות", action: "סטטוס בריאות לסוכן נשלח" },
  "פנסיה": { label: "פנסיה", title: "שליחת סטטוס פנסיוני", action: "סטטוס פנסיוני לסוכן נשלח" },
};

const buildSheetRows = (rows) => {
  const headers = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!HIDDEN_COLUMNS.includes(key) && !headers.includes(key)) headers.push(key);
    }
  }
  return [headers, ...rows.map((row) => headers.map((h) => row[h] ?? ""))];
};

const buildHtmlTable = (aoa) => `
    <html dir="rtl">
<head>
    <style>
        .center { display: flex; justify-content: center; }
        .styled-table { border-collapse: collapse; margin: 25px 0; font-size: 0.9em; font-family: sans-serif; min-width: 600px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
        .styled-table thead tr { background-color: #DC5F00; color: #ffffff; text-align: right; }
        .styled-table th { padding: 12px 15px; text-align: right; }
        .styled-table td { padding: 12px 15px; text-align: right; }
        .styled-table tbody tr { border-bottom: 1px solid #dddddd; }
        .styled-table tbody tr:nth-of-type(even) { background-color: #f3f3f3; }
        .styled-table tbody tr:last-of-type { border-bottom: 2px solid #DC5F00; }
    </style>
</head>
<body dir="rtl">
<p dir="rtl">לפניך מקרא המסביר את הסטטוסים:</p>
<div class="center">
    <table class="styled-table" dir="rtl">
        <tr><th>ספרה</th><td>1</td><td>2</td><td>3</td><td>4</td><td>0/5</td></tr>
        <tr><th>סטטוס</th><td>ללא מענה</td><td>הצעה</td><td>בתהליך</td><td>הופק</td><td>סירוב</td></tr>
    </table>
</div>
<div class="center">
    <table dir="rtl" class="styled-table">
        <thead>
            <tr>
                <th>#</th>
                ${aoa[0].map((header) => `<th>${escapeHtml(header)}</th>`).join("")}
            </tr>
        </thead>
        <tbody>
            ${aoa
              .slice(1)
              .map(
                (row, index) => `
                <tr>
                    <td>${index + 1}</td>
                    ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                </tr>`
              )
              .join("")}
        </tbody>
    </table>
</div>
<div dir="rtl">
    <p>בברכה,</p>
    <p>צוות סינרגיה</p>
    <br>
    <br>
    <p>טלפון: 3743*</p>
    <b><a href="https://wa.me/9720779912113" style="text-decoration:none">וואטסאפ </a></b>
    <p>אתר: TLP-INS.CO.IL</p>
    <p>סניפי תלפיות: בני ברק | פתח תקוה | רחובות | רמת גן | רעננה | חולון | תל אביב | ירושלים | נתניה | מודיעין | ראשון לציון | אשדוד | הרצליה</p>
</div>
<br>
<br>
<div dir="ltr" style="text-align:center;">
    <p style="display:inline-block;font-size:11px;color:gray;font-family:Arial;">&copy; Osher Cohen - oshrico2@gmail.com</p>
</div>
</body>
</html>
`;

const buildMail = (agentInfo, program) => {
  const aoa = buildSheetRows(agentInfo.data);
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(aoa);
  ws["!margins"] = { rtl: true };
  wb.Workbook = { Views: [{ RTL: true }] };
  xlsx.utils.book_append_sheet(wb, ws, "Agent Data");

  const name = escapeHtml(agentInfo.name);
  const date = getCurrentDateFormatted();
  const table = buildHtmlTable(aoa);
  const isGeneral = program === "daily" || program === "weekly";
  const typeOfFile = PROGRAMS[program].label;

  const mail = {
    from: mailFrom,
    to: agentInfo.email,
    attachments: [
      {
        filename: `סטטוס לקוחות ${typeOfFile}.xlsx`,
        content: Buffer.from(xlsx.write(wb, { type: "buffer", bookType: "xlsx" })),
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    ],
  };
  // Only add CC when there is a real second address (previously the literal
  // string "undefined" was sent as CC for most agents).
  if (isEmail(agentInfo.addMail)) mail.cc = agentInfo.addMail.trim();

  if (isGeneral) {
    mail.subject = `סטטוס לקוחות ${typeOfFile} - ${agentInfo.name} ${date}`;
    mail.html = `<div dir="rtl"><p>היי ${name},</p>
      <p>מצ"ב סטטוס לקוחות <b>שהועברו/עודכנו מתחילת שנה</b> ללא תחומי פנסיה ובריאות.</p>
      <p>פנסיה ובריאות נשלחים אחת לשבוע.</p>
      <p>מצורף קובץ אקסל לנוחיותך.</p></div><br>${table}`;
  } else {
    mail.subject = `סטטוס לקוחות - ${program} ${agentInfo.name} ${date}`;
    mail.html = `<div dir="rtl"><p>היי ${name},</p>
      <p>מצ"ב סטטוס לקוחות שלך מתחילת שנה בתחום ה${escapeHtml(program)}</p>
      <p>מצורף קובץ אקסל לנוחיותך.</p></div><br>${table}`;
  }
  return mail;
};

// Groups rows by agent, sends one mail per agent, and reports each outcome
// through `onEvent` as it happens.
const sendStatuses = async (rows, program, skipReasons, onEvent) => {
  const agentMap = new Map();
  for (const row of rows) {
    const name = normalizeName(row["שם סוכן"]);
    if (!name) continue;
    if (!agentMap.has(name)) {
      agentMap.set(name, {
        name,
        email: String(row["מייל של סוכן"] || "").trim(),
        addMail: String(row["מייל נוסף"] || "").trim(),
        data: [],
      });
    }
    agentMap.get(name).data.push(row);
  }

  const results = { sent: [], failed: [], noEmail: [], skipped: [] };
  onEvent({ type: "start", total: agentMap.size });

  for (const agentInfo of agentMap.values()) {
    const base = { name: agentInfo.name, rows: agentInfo.data.length };
    let status;
    if (skipReasons.get(agentInfo.name) === "weekly") {
      status = "skipped";
    } else if (!isEmail(agentInfo.email)) {
      status = "noEmail";
    } else {
      try {
        await transporter.sendMail(buildMail(agentInfo, program));
        status = "sent";
      } catch (error) {
        console.error(`Status mail to ${agentInfo.name} failed: ${error.message}`);
        status = "failed";
      }
    }
    results[status].push(base);
    onEvent({ type: "agent", status, ...base });
  }
  return results;
};

// Streams NDJSON progress when the client asks for it; otherwise answers
// once at the end.
const respond = async (req, res, run) => {
  const streaming = (req.get("accept") || "").includes("application/x-ndjson");
  if (streaming) {
    res.status(200);
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
  }
  const write = (event) => {
    if (streaming && !res.writableEnded) res.write(JSON.stringify(event) + "\n");
  };
  try {
    const results = await run(write);
    if (streaming) {
      write({ type: "done", results });
      res.end();
    } else {
      res.json(results);
    }
  } catch (error) {
    if (!streaming) throw error;
    console.error(error);
    write({ type: "error", message: "השליחה נעצרה בגלל שגיאת שרת" });
    res.end();
  }
};

const summarize = async (req, program, results) => {
  const { title, action } = PROGRAMS[program];
  const extras = [
    results.failed.length && `${results.failed.length} נכשלו`,
    results.noEmail.length && `${results.noEmail.length} ללא מייל`,
  ].filter(Boolean);
  await logActivity(req, {
    title,
    action: `${action} ל-${results.sent.length} סוכנים${extras.length ? ` (${extras.join(", ")})` : ""}`,
    entityName: `סטטוס לקוחות ${PROGRAMS[program].label}`,
    color: "blue",
  });
};

const requireRows = (data, column) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new HttpError(400, "הקובץ ריק");
  }
  if (!data.some((row) => row && Object.hasOwn(row, column))) {
    throw new HttpError(400, `בקובץ חסרה העמודה "${column}"`);
  }
};

// @desc    Daily / weekly general status
// @route   POST /api/programs/general  { weeklyStatus: boolean, data: [] }
router.post(
  "/general",
  asyncHandler(async (req, res) => {
    const weeklyStatus = req.body.weeklyStatus === true;
    const program = weeklyStatus ? "weekly" : "daily";
    const data = req.body.data;
    requireRows(data, "סוכן בכרטיס לקוח");

    const [agents, employees] = await Promise.all([fetchAgents(), fetchEmployees()]);
    const agentByName = new Map(agents.map((a) => [normalizeName(a.name), a]));
    const employeeByName = new Map(employees.map((e) => [normalizeName(e.name), e]));
    const skipReasons = new Map();

    const rows = data.filter((item) => {
      const agentName = normalizeName(item["סוכן בכרטיס לקוח"]);
      const agent = agentByName.get(agentName);
      if (agent && agent.customerStatus === false) return false;

      if (agent) {
        // A daily run skips agents who asked for weekly statuses only.
        if (!weeklyStatus && agent.weeklyStatus) {
          skipReasons.set(agentName, "weekly");
        } else {
          if (agent.additionalMail) item["מייל נוסף"] = agent.additionalMail;
          if (agent.email) item["מייל של סוכן"] = agent.email;
        }
      }
      const employee = employeeByName.get(normalizeName(item["שם מטפל"]));
      if (employee?.subject) item["תחום"] = employee.subject;
      return true;
    });

    const renamed = replaceKeysInArray(rows, {
      "סוכן בכרטיס לקוח": "שם סוכן",
      "שדה כללי 1": "סטטוס",
    });

    await respond(req, res, async (onEvent) => {
      const results = await sendStatuses(renamed, program, skipReasons, onEvent);
      await summarize(req, program, results);
      return results;
    });
  })
);

// @desc    Health / pension status
// @route   POST /api/programs/other-services  { weeklyStatus: "בריאות"|"פנסיה", data: [] }
router.post(
  "/other-services",
  asyncHandler(async (req, res) => {
    const program = req.body.weeklyStatus;
    if (program !== "בריאות" && program !== "פנסיה") {
      throw new HttpError(400, "סוג סטטוס לא מוכר");
    }
    const data = req.body.data;
    requireRows(data, "מקור לקוח");

    const agents = await fetchAgents();
    const agentByName = new Map(agents.map((a) => [normalizeName(a.name), a]));

    for (const item of data) {
      const agent = agentByName.get(normalizeName(item["מקור לקוח"]));
      if (agent?.additionalMail) item["מייל נוסף"] = agent.additionalMail;
      if (agent?.email) item["מייל של סוכן"] = agent.email;
    }

    // Unchanged behaviour: health/pension statuses do not consult the
    // agent's customerStatus opt-out (only the general status does).
    const rows = replaceKeysInArray(data, {
      "מקור לקוח": "שם סוכן",
      'מת"ל': "שם מטפל",
    });

    await respond(req, res, async (onEvent) => {
      const results = await sendStatuses(rows, program, new Map(), onEvent);
      await summarize(req, program, results);
      return results;
    });
  })
);

export default router;
