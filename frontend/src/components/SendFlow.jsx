import { useState } from "react";
import { Check, FileSpreadsheet, Upload, X } from "lucide-react";
import { ACCEPT } from "../lib/excel";
import { number } from "../lib/format";

export function Stations({ steps, current, error }) {
  return (
    <ol className="stations" aria-label="שלבי השליחה">
      {steps.map((label, i) => {
        const state = error && i === current ? "error" : i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li key={label} className="station" data-state={state} aria-current={i === current ? "step" : undefined}>
            <span className="station__dot">{state === "done" ? <Check strokeWidth={3} /> : i + 1}</span>
            <span className="station__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function FileDrop({ file, info, onFile, onClear, disabled }) {
  const [over, setOver] = useState(false);

  if (file) {
    return (
      <div className="file-chip">
        <FileSpreadsheet aria-hidden="true" />
        <div>
          <b>{file.name}</b>
          <span>{info}</span>
        </div>
        {!disabled && (
          <button type="button" className="btn btn--quiet btn--sm" onClick={onClear}>
            <X />
            החלפת קובץ
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      className="drop"
      data-over={over}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
    >
      <span className="drop__icon" aria-hidden="true">
        <Upload />
      </span>
      <b>גררו לכאן את קובץ האקסל</b>
      <span>או לחצו לבחירת קובץ · xlsx, xls, csv</span>
      <input
        type="file"
        accept={ACCEPT}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export function SheetPreview({ rows, columns, limit = 20 }) {
  return (
    <div className="panel">
      <div className="panel__head">
        <h2 style={{ fontSize: "var(--fs-lg)" }}>תצוגה מקדימה</h2>
        <span className="cell-muted" style={{ fontSize: "var(--fs-sm)" }}>
          {rows.length > limit ? `${limit} שורות ראשונות מתוך ${number(rows.length)}` : `${number(rows.length)} שורות`}
        </span>
      </div>
      <div className="table-wrap table-wrap--auto" style={{ maxHeight: 360 }}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} scope="col" style={{ top: 0 }}>
                  <span className="th-plain">{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, limit).map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c} style={{ whiteSpace: "nowrap" }}>
                    {String(row[c] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STATUS_ORDER = ["sent", "failed", "noEmail", "skipped"];
export const STATUS_META = {
  sent: { label: "נשלחו" },
  failed: { label: "השליחה נכשלה" },
  noEmail: { label: "ללא מייל במאגר" },
  skipped: { label: "דולגו (סטטוס שבועי)" },
};

/** The thermometer window: one pane per agent, lit as each result arrives. */
export function Thermometer({ total, events, current, done }) {
  const cols = total > 160 ? 16 : total > 60 ? 12 : 8;
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
  for (const e of events) counts[e.status]++;
  const processed = events.length;

  return (
    <div className="thermo">
      <div className="thermo__core" data-done={done || undefined}>
        <div className="thermo__counter">
          <b>
            {number(processed)} / {number(total)}
          </b>
          <span>{done ? "השליחה הסתיימה" : "שולח… אין לסגור את העמוד"}</span>
        </div>
        <div
          className="thermo__panes"
          style={{ "--cols": cols }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={processed}
          aria-label="התקדמות השליחה"
        >
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className="pane" data-status={events[i]?.status} title={events[i]?.name} />
          ))}
        </div>
        <p className="thermo__now" aria-live="polite">
          {done ? " " : current ? `נשלח עכשיו: ${current}` : "מתחבר לשרת הדואר…"}
        </p>
      </div>
      <div className="thermo__legend">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="legend-row">
            <i className="pane" data-status={s} aria-hidden="true" />
            <span>{STATUS_META[s].label}</span>
            <b>{number(counts[s])}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
