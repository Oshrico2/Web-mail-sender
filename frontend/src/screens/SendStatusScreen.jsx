import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, Info, RotateCcw, Send } from "lucide-react";
import { Page } from "../components/Page";
import { ConfirmDialog } from "../components/Dialog";
import { useToast } from "../components/Toast";
import { FileDrop, SheetPreview, Stations, Thermometer, STATUS_META } from "../components/SendFlow";
import { readSheet, exportSheet } from "../lib/excel";
import { streamJson } from "../lib/api";
import { customers, number } from "../lib/format";

const STEPS = ["קובץ", "בדיקה ובחירת תוכנית", "שליחה", "סיכום"];

const PROGRAMS = [
  {
    id: "daily",
    title: "סטטוס יומי",
    text: "כללי, ללא פנסיה ובריאות. סוכנים בסטטוס שבועי ידולגו.",
    url: "/programs/general",
    body: (data) => ({ weeklyStatus: false, data }),
    column: "סוכן בכרטיס לקוח",
  },
  {
    id: "weekly",
    title: "סטטוס שבועי",
    text: "כללי, ללא פנסיה ובריאות. נשלח לכל הסוכנים.",
    url: "/programs/general",
    body: (data) => ({ weeklyStatus: true, data }),
    column: "סוכן בכרטיס לקוח",
  },
  {
    id: "health",
    title: "בריאות",
    text: "סטטוס לקוחות בתחום הבריאות מתחילת השנה.",
    url: "/programs/other-services",
    body: (data) => ({ weeklyStatus: "בריאות", data }),
    column: "מקור לקוח",
  },
  {
    id: "pension",
    title: "פנסיוני",
    text: "סטטוס לקוחות בתחום הפנסיה מתחילת השנה.",
    url: "/programs/other-services",
    body: (data) => ({ weeklyStatus: "פנסיה", data }),
    column: "מקור לקוח",
  },
];

export default function SendStatusScreen() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [sheet, setSheet] = useState(null); // { rows, columns }
  const [reading, setReading] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [phase, setPhase] = useState("setup"); // setup | sending | done
  const [total, setTotal] = useState(0);
  const [events, setEvents] = useState([]);
  const [current, setCurrent] = useState("");
  const [fatal, setFatal] = useState("");

  const program = PROGRAMS.find((p) => p.id === programId);
  const agentCount = useMemo(() => {
    if (!sheet || !program) return 0;
    return new Set(sheet.rows.map((r) => String(r[program.column] ?? "").trim()).filter(Boolean)).size;
  }, [sheet, program]);

  // Leaving mid-send would cut the request and leave agents half-sent.
  useEffect(() => {
    if (phase !== "sending") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  const onFile = async (f) => {
    setReading(true);
    setProgramId(null);
    try {
      const parsed = await readSheet(f);
      if (!parsed.rows.length) throw new Error("הקובץ ריק");
      setFile(f);
      setSheet(parsed);
    } catch (err) {
      toast.error(err.message || "לא הצלחנו לקרוא את הקובץ. ודאו שזה קובץ אקסל תקין");
    } finally {
      setReading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setSheet(null);
    setProgramId(null);
    setPhase("setup");
    setEvents([]);
    setTotal(0);
    setCurrent("");
    setFatal("");
  };

  const send = async () => {
    setConfirming(false);
    setPhase("sending");
    setEvents([]);
    setFatal("");
    try {
      await streamJson(program.url, program.body(sheet.rows), (event) => {
        if (event.type === "start") setTotal(event.total);
        if (event.type === "agent") {
          setEvents((list) => [...list, event]);
          setCurrent(event.name);
        }
        if (event.type === "error") setFatal(event.message);
      });
      setPhase("done");
    } catch (err) {
      setFatal(err.message);
      setPhase("done");
    }
  };

  const groups = useMemo(() => {
    const g = { failed: [], noEmail: [], skipped: [] };
    for (const e of events) if (g[e.status]) g[e.status].push(e);
    return g;
  }, [events]);

  const step = phase === "done" ? 3 : phase === "sending" ? 2 : sheet ? 1 : 0;
  const sentCount = events.filter((e) => e.status === "sent").length;

  return (
    <Page
      title="שליחת סטטוס לקוחות"
      description="כל סוכן מקבל מייל עם טבלת הלקוחות שלו וקובץ אקסל מצורף."
    >
      <Stations steps={STEPS} current={step} error={phase === "done" && fatal} />

      {phase === "setup" && (
        <div className="stack">
          <FileDrop
            file={file}
            info={sheet && `${number(sheet.rows.length)} שורות · ${sheet.columns.length} עמודות`}
            onFile={onFile}
            onClear={reset}
          />
          {reading && <p className="notice">קורא את הקובץ…</p>}

          {sheet && (
            <>
              <SheetPreview rows={sheet.rows} columns={sheet.columns} />

              <section>
                <h2 className="section-title">איזה סטטוס שולחים?</h2>
                <div className="programs" role="group" aria-label="סוג סטטוס">
                  {PROGRAMS.map((p) => {
                    const fits = sheet.columns.includes(p.column);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className="program"
                        aria-pressed={programId === p.id}
                        disabled={!fits}
                        title={fits ? undefined : `בקובץ אין עמודה “${p.column}”`}
                        onClick={() => setProgramId(p.id)}
                      >
                        <b>{p.title}</b>
                        <span>{fits ? p.text : `לא מתאים לקובץ: חסרה העמודה “${p.column}”`}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {!PROGRAMS.some((p) => sheet.columns.includes(p.column)) && (
                <p className="notice notice--warn">
                  <AlertTriangle />
                  הקובץ לא מתאים לאף תוכנית. בדקו שזה הייצוא הנכון מהמערכת (עמודה “סוכן בכרטיס לקוח” או “מקור לקוח”).
                </p>
              )}

              <div className="cluster">
                <button type="button" className="btn btn--primary" disabled={!program} onClick={() => setConfirming(true)}>
                  <Send />
                  {program ? `שליחת ${program.title} · ${number(agentCount)} סוכנים בקובץ` : "בחרו סוג סטטוס"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {phase !== "setup" && (
        <div className="stack">
          <Thermometer total={total} events={events} current={current} done={phase === "done"} />

          {fatal && (
            <p className="notice notice--warn" role="alert">
              <AlertTriangle />
              {fatal}. {sentCount > 0 && `${number(sentCount)} סוכנים כבר קיבלו מייל, אל תשלחו שוב את כל הקובץ.`}
            </p>
          )}

          {phase === "done" && (
            <>
              {["failed", "noEmail", "skipped"].map(
                (s) =>
                  groups[s].length > 0 && (
                    <section key={s} className="panel">
                      <div className="panel__head">
                        <h2 style={{ fontSize: "var(--fs-lg)" }}>
                          {STATUS_META[s].label} ({number(groups[s].length)})
                        </h2>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() =>
                            exportSheet(groups[s], [{ key: "name", label: "שם סוכן" }, { key: "rows", label: "שורות" }], STATUS_META[s].label)
                          }
                        >
                          <Download />
                          ייצוא
                        </button>
                      </div>
                      {s === "noEmail" && (
                        <p className="notice" style={{ margin: "12px 16px 0" }}>
                          <Info />
                          הסוכנים האלה לא נמצאו במאגר או שאין להם מייל. הוסיפו אותם במסך הסוכנים ושלחו להם בנפרד.
                        </p>
                      )}
                      <ul className="feed" style={{ maxHeight: 260, overflowY: "auto" }}>
                        {groups[s].map((e) => (
                          <li key={e.name} style={{ gridTemplateColumns: "1fr auto" }}>
                            <b>{e.name}</b>
                            <span className="cell-muted">{customers(e.rows)}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
              )}
              <div className="cluster">
                <button type="button" className="btn btn--dark" onClick={reset}>
                  <RotateCcw />
                  שליחה חדשה
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        title={`לשלוח ${program?.title || ""}?`}
        confirmLabel="התחלת השליחה"
        onConfirm={send}
        onClose={() => setConfirming(false)}
      >
        <p>
          {number(sheet?.rows.length || 0)} שורות מהקובץ <b>{file?.name}</b> שייכות ל־{number(agentCount)} סוכנים. כל סוכן שנמצא במאגר עם מייל יקבל את הלקוחות שלו.
        </p>
        {programId === "daily" && <p style={{ marginTop: 8 }}>סוכנים שביקשו סטטוס שבועי בלבד ידולגו.</p>}
        <p style={{ marginTop: 8 }}>לא ניתן לעצור את השליחה אחרי שהתחילה.</p>
      </ConfirmDialog>
    </Page>
  );
}
