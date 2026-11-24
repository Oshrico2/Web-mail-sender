import { useMemo, useState } from "react";
import { AlertTriangle, BarChart3, Download, Loader2, RotateCcw } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import { Modal } from "../components/Dialog";
import { Switch, TextInput } from "../components/Field";
import { useToast } from "../components/Toast";
import { FileDrop, SheetPreview, Stations } from "../components/SendFlow";
import Proportion from "../components/Proportion";
import { readSheet, exportSheet } from "../lib/excel";
import { api, errorMessage } from "../lib/api";
import { useAuth } from "../lib/auth";
import { number } from "../lib/format";

const STEPS = ["קובץ", "בדיקה", "הפקת דוח", "תוצאות"];
const REQUIRED = "סוכן בכרטיס לקוח";

export default function ManagerReportScreen() {
  const toast = useToast();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [asking, setAsking] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);

  const onFile = async (f) => {
    try {
      const parsed = await readSheet(f);
      if (!parsed.rows.length) throw new Error("הקובץ ריק");
      setFile(f);
      setSheet(parsed);
      setReport(null);
    } catch (err) {
      toast.error(err.message || "לא הצלחנו לקרוא את הקובץ");
    }
  };

  const reset = () => {
    setFile(null);
    setSheet(null);
    setReport(null);
  };

  const create = async () => {
    const target = sendMail ? email.trim() : "";
    if (sendMail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      setEmailError("כתובת המייל אינה תקינה");
      return;
    }
    setAsking(false);
    setBusy(true);
    try {
      const { data } = await api.post("/business-managers/report/create", { jsonData: sheet.rows, email: target });
      setReport(data);
      if (data.emailSent) toast.success(`הדוח נשלח אל ${target}`);
      if (data.emailError) toast.error(data.emailError);
    } catch (err) {
      toast.error(errorMessage(err, "הפקת הדוח נכשלה"));
    } finally {
      setBusy(false);
    }
  };

  const columns = useMemo(() => (report?.filteredData?.[0] ? Object.keys(report.filteredData[0]) : []), [report]);
  const managerCounts = useMemo(
    () => [...(report?.managerCounts || [])].sort((a, b) => b.amount - a.amount),
    [report]
  );
  const unassigned = report ? report.filteredData.filter((r) => !r["מנהל פיתוח עסקי"]).length : 0;
  const hasColumn = sheet?.columns.includes(REQUIRED);
  const step = report ? 3 : busy ? 2 : sheet ? 1 : 0;

  return (
    <Page
      title="דוח מנהלי פיתוח עסקי"
      description="כל ליד משויך למנהל לפי האות הראשונה בשם המשפחה של הסוכן. לידים של קמפיינים וועדים מסוננים."
    >
      <Stations steps={STEPS} current={step} />

      {!report && (
        <div className="stack">
          <FileDrop
            file={file}
            info={sheet && `${number(sheet.rows.length)} שורות`}
            onFile={onFile}
            onClear={reset}
            disabled={busy}
          />
          {sheet && !hasColumn && (
            <p className="notice notice--warn">
              <AlertTriangle />
              בקובץ אין עמודה “{REQUIRED}”, ולכן אי אפשר להפיק ממנו דוח.
            </p>
          )}
          {sheet && <SheetPreview rows={sheet.rows} columns={sheet.columns} />}
          {sheet && (
            <div className="cluster">
              <button type="button" className="btn btn--primary" disabled={!hasColumn || busy} onClick={() => setAsking(true)}>
                {busy ? <Loader2 className="spin" /> : <BarChart3 />}
                {busy ? "מפיק את הדוח…" : "הפקת דוח"}
              </button>
            </div>
          )}
        </div>
      )}

      {report && (
        <div className="stack">
          <Ribbon
            panes={[
              { label: "לידים בדוח", value: report.filteredData.length },
              { label: "משויכים למנהל", value: report.filteredData.length - unassigned },
              { label: "ללא מנהל", value: unassigned, tone: unassigned ? "warn" : undefined },
              { label: "סוכנים שלא נמצאו", value: report.noAgentInDataList.length, tone: report.noAgentInDataList.length ? "warn" : undefined },
            ]}
          />

          <div className="split">
            <section className="panel">
              <div className="panel__head">
                <h2>חלוקה לפי מנהל</h2>
              </div>
              <div className="panel__body">
                {managerCounts.length ? <Proportion data={managerCounts} /> : <p className="cell-muted">אף ליד לא שויך למנהל.</p>}
              </div>
            </section>

            <section className="panel">
              <div className="panel__head">
                <h2>סוכנים שלא נמצאו ({number(report.noAgentInDataList.length)})</h2>
              </div>
              {report.noAgentInDataList.length ? (
                <>
                  <p className="notice" style={{ margin: "12px 16px 0" }}>
                    השמות לא קיימים במאגר הסוכנים, ולכן הלידים שלהם לא שויכו. הוסיפו אותם ותפיקו שוב.
                  </p>
                  <ul className="feed" style={{ maxHeight: 280, overflowY: "auto" }}>
                    {report.noAgentInDataList.map((name) => (
                      <li key={name} style={{ gridTemplateColumns: "1fr" }}>
                        {name}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="panel__body cell-muted">כל הסוכנים בקובץ נמצאו במאגר.</p>
              )}
            </section>
          </div>

          <SheetPreview rows={report.filteredData} columns={columns} />

          <div className="cluster">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() =>
                exportSheet(
                  report.filteredData,
                  columns.map((c) => ({ key: c, label: c })),
                  "דוח מנהלי פיתוח עסקי"
                )
              }
            >
              <Download />
              הורדת הדוח המלא
            </button>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              <RotateCcw />
              דוח חדש
            </button>
          </div>
        </div>
      )}

      <Modal
        open={asking}
        onClose={() => setAsking(false)}
        title="להפיק את הדוח?"
        footer={
          <>
            <button type="button" className="btn btn--primary" onClick={create}>
              הפקת דוח
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setAsking(false)}>
              ביטול
            </button>
          </>
        }
      >
        <div className="form">
          <p>
            {number(sheet?.rows.length || 0)} לידים מהקובץ <b>{file?.name}</b> ישויכו למנהלי הפיתוח.
          </p>
          <Switch label="שליחת סיכום במייל" description="כמות לידים לכל מנהל" checked={sendMail} onChange={setSendMail} />
          {sendMail && (
            <TextInput
              label="שליחה אל"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              error={emailError}
            />
          )}
        </div>
      </Modal>
    </Page>
  );
}
