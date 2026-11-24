import { useEffect, useMemo, useState } from "react";
import { Compass, Download, Plus, Search } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { useResource } from "../lib/useResource";
import { useSheetState } from "../lib/useSheetState";
import { exportSheet } from "../lib/excel";
import { api } from "../lib/api";
import { collator, normalize } from "../lib/format";

export const HEBREW_LETTERS = "אבגדהוזחטיכלמנסעפצקרשת".split("");

const sortedLetters = (letters = []) =>
  [...letters].sort((a, b) => HEBREW_LETTERS.indexOf(a) - HEBREW_LETTERS.indexOf(b));

const COLUMNS = [
  { key: "name", label: "שם", className: "cell-strong" },
  { key: "email", label: "דואר אלקטרוני", render: (m) => <span className="ltr">{m.email}</span> },
  {
    key: "lettersOfLastNamesUnderCare",
    label: "שמות משפחה באחריות",
    sortValue: (m) => sortedLetters(m.lettersOfLastNamesUnderCare)[0] || "ת",
    render: (m) => (
      <span className="letters">
        {sortedLetters(m.lettersOfLastNamesUnderCare).map((l) => (
          <span key={l} className="letter">
            {l}
          </span>
        ))}
      </span>
    ),
  },
];

const ENTITY = { one: "מנהל", the: "המנהל", base: "/business-managers", create: "/business-managers/add" };

function AssociatedAgents({ letters }) {
  const [agents, setAgents] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    api.get("/agents").then(({ data }) => alive && setAgents(data)).catch(() => alive && setAgents([]));
    return () => {
      alive = false;
    };
  }, []);

  const list = useMemo(() => {
    if (!agents) return [];
    return agents
      .filter((a) => a.lastName && letters.includes(a.lastName.trim().charAt(0)))
      .filter((a) => !q || normalize(a.name).includes(normalize(q)))
      .sort((a, b) => collator.compare(a.name, b.name));
  }, [agents, letters, q]);

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 style={{ fontSize: "var(--fs-lg)" }}>סוכנים משויכים {agents && `(${list.length})`}</h2>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <label className="search" style={{ maxWidth: "none" }}>
          <span className="visually-hidden">חיפוש סוכן</span>
          <Search aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש סוכן" />
        </label>
      </div>
      <ul className="feed" style={{ maxHeight: 280, overflowY: "auto" }}>
        {!agents && <li className="cell-muted">טוען…</li>}
        {agents && list.length === 0 && <li className="cell-muted">אין סוכנים ששם המשפחה שלהם מתחיל באותיות האלו.</li>}
        {list.map((a) => (
          <li key={a._id} style={{ gridTemplateColumns: "1fr auto" }}>
            <b>{a.name}</b>
            <span className="cell-muted">{a.lastName}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ManagersScreen() {
  const { items, status, error, reload, upsert, remove, entering } = useResource("/business-managers");
  const sheet = useSheetState();

  const owners = useMemo(() => {
    const map = new Map();
    for (const m of items) for (const l of m.lettersOfLastNamesUnderCare) map.set(l, m);
    return map;
  }, [items]);
  const unassigned = HEBREW_LETTERS.filter((l) => !owners.has(l));

  return (
    <Page
      title="מנהלי פיתוח עסקי"
      description="כל מנהל אחראי על הסוכנים ששם המשפחה שלהם מתחיל באותיות שלו."
      actions={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={!items.length}
            onClick={() =>
              exportSheet(
                items,
                [
                  { key: "name", label: "שם" },
                  { key: "email", label: "דואר אלקטרוני" },
                  { key: "lettersOfLastNamesUnderCare", label: "אותיות", exportValue: (m) => sortedLetters(m.lettersOfLastNamesUnderCare) },
                ],
                "רשימת מנהלי פיתוח עסקי"
              )
            }
          >
            <Download />
            ייצוא לאקסל
          </button>
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            מנהל חדש
          </button>
        </>
      }
    >
      <Ribbon
        loading={status === "loading"}
        panes={[
          { label: "מנהלים", value: items.length },
          { label: "אותיות משויכות", value: HEBREW_LETTERS.length - unassigned.length },
          { label: "אותיות ללא מנהל", value: unassigned.length, tone: unassigned.length ? "warn" : undefined },
        ]}
      />
      {status === "ready" && unassigned.length > 0 && (
        <p className="notice notice--warn" style={{ marginBottom: 24 }}>
          סוכנים ששם המשפחה שלהם מתחיל באותיות {unassigned.join(", ")} לא ישויכו לאף מנהל בדוח.
        </p>
      )}
      <DataTable
        rows={items}
        columns={COLUMNS}
        status={status}
        error={error}
        onRetry={reload}
        entering={entering}
        searchKeys={["name", "email", "lettersOfLastNamesUnderCare"]}
        searchPlaceholder="חיפוש מנהל או אות"
        onRowClick={sheet.openRecord}
        selectedId={sheet.selectedId}
        empty={<Empty icon={Compass} title="אין עדיין מנהלים" text="הוסיפו מנהל ובחרו את האותיות שבאחריותו." />}
      />
      <RecordSheet
        open={sheet.open}
        onClose={sheet.close}
        record={sheet.record}
        entity={ENTITY}
        initial={(m) => ({
          name: m?.name || "",
          email: m?.email || "",
          lettersOfLastNamesUnderCare: m?.lettersOfLastNamesUnderCare || [],
        })}
        validate={(f) => ({
          name: required(f.name, "שם"),
          email: emailError(f.email),
          lettersOfLastNamesUnderCare: f.lettersOfLastNamesUnderCare.length ? undefined : "יש לבחור לפחות אות אחת",
        })}
        onSaved={upsert}
        onDeleted={remove}
        extraActions={sheet.record && <AssociatedAgents letters={sheet.record.lettersOfLastNamesUnderCare} />}
        renderFields={({ form, set, errors }) => (
          <>
            <TextInput label="שם" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} autoFocus={!sheet.record} />
            <TextInput label="דואר אלקטרוני" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
            <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="field__label" style={{ marginBottom: 6 }}>
                אותיות של שמות משפחה באחריות המנהל
              </legend>
              <div className="letter-grid">
                {HEBREW_LETTERS.map((letter) => {
                  const owner = owners.get(letter);
                  const takenByOther = owner && owner._id !== sheet.record?._id;
                  const checked = form.lettersOfLastNamesUnderCare.includes(letter);
                  return (
                    <label key={letter} className="letter-pick" title={takenByOther ? `משויכת ל${owner.name}` : undefined}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={takenByOther}
                        onChange={(e) =>
                          set(
                            "lettersOfLastNamesUnderCare",
                            e.target.checked
                              ? sortedLetters([...form.lettersOfLastNamesUnderCare, letter])
                              : form.lettersOfLastNamesUnderCare.filter((l) => l !== letter)
                          )
                        }
                      />
                      <span>{letter}</span>
                    </label>
                  );
                })}
              </div>
              {errors.lettersOfLastNamesUnderCare ? (
                <span className="field__error">{errors.lettersOfLastNamesUnderCare}</span>
              ) : (
                <span className="field__hint">אותיות מחוקות כבר משויכות למנהל אחר.</span>
              )}
            </fieldset>
          </>
        )}
      />
    </Page>
  );
}
