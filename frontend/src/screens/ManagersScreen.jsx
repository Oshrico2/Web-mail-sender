import { Compass, Plus, Search } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { usePagedList, useJson } from "../lib/usePagedList";
import ExportButton from "../components/ExportButton";
import Pager from "../components/Pager";
import { useSheetState } from "../lib/useSheetState";
import { number } from "../lib/format";

export const HEBREW_LETTERS = "אבגדהוזחטיכלמנסעפצקרשת".split("");

const sortedLetters = (letters = []) =>
  [...letters].sort((a, b) => HEBREW_LETTERS.indexOf(a) - HEBREW_LETTERS.indexOf(b));

const COLUMNS = [
  { key: "name", label: "שם", className: "cell-strong" },
  { key: "email", label: "דואר אלקטרוני", render: (m) => <span className="ltr">{m.email}</span> },
  {
    key: "lettersOfLastNamesUnderCare",
    label: "שמות משפחה באחריות",
    sortable: false,
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
  const list = usePagedList("/agents", {
    initialSort: { key: "name", dir: 1 },
    params: { letters: letters.join("") },
    pageSize: 25,
  });

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 style={{ fontSize: "var(--fs-lg)" }}>
          סוכנים משויכים {list.status !== "loading" && `(${number(list.total)})`}
        </h2>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <label className="search" style={{ maxWidth: "none" }}>
          <span className="visually-hidden">חיפוש סוכן</span>
          <Search aria-hidden="true" />
          <input type="search" value={list.query} onChange={(e) => list.setQuery(e.target.value)} placeholder="חיפוש סוכן" />
        </label>
      </div>
      <ul className="feed" aria-busy={list.status === "refreshing" || undefined}>
        {list.status === "loading" && <li className="cell-muted">טוען…</li>}
        {list.status !== "loading" && list.items.length === 0 && (
          <li className="cell-muted">אין סוכנים ששם המשפחה שלהם מתחיל באותיות האלו.</li>
        )}
        {list.items.map((a) => (
          <li key={a._id} style={{ gridTemplateColumns: "1fr auto" }}>
            <b>{a.name}</b>
            <span className="cell-muted">{a.lastName}</span>
          </li>
        ))}
      </ul>
      {list.pages > 1 && (
        <Pager compact page={list.page} pages={list.pages} total={list.total} limit={list.limit} onPage={list.setPage} />
      )}
    </section>
  );
}

export default function ManagersScreen() {
  const list = usePagedList("/business-managers", { initialSort: { key: "name", dir: 1 } });
  const sheet = useSheetState();
  // Letter → manager map from a small dedicated endpoint (≤22 entries).
  const [letterData, reloadLetters] = useJson("/business-managers/letters");
  const owners = new Map(Object.entries(letterData?.owners || {}));
  const refresh = () => {
    list.reload();
    reloadLetters();
  };
  const unassigned = HEBREW_LETTERS.filter((l) => !owners.has(l));

  return (
    <Page
      title="מנהלי פיתוח עסקי"
      description="כל מנהל אחראי על הסוכנים ששם המשפחה שלהם מתחיל באותיות שלו."
      actions={
        <>
          <ExportButton
            path="/business-managers"
            params={{ q: list.query || undefined }}
            columns={[
              { key: "name", label: "שם" },
              { key: "email", label: "דואר אלקטרוני" },
              { key: "lettersOfLastNamesUnderCare", label: "אותיות", exportValue: (m) => sortedLetters(m.lettersOfLastNamesUnderCare) },
            ]}
            fileName="רשימת מנהלי פיתוח עסקי"
            disabled={!list.total}
          />
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            מנהל חדש
          </button>
        </>
      }
    >
      <Ribbon
        loading={!letterData}
        panes={[
          { label: "מנהלים", value: letterData?.managers ?? 0 },
          { label: "אותיות משויכות", value: HEBREW_LETTERS.length - unassigned.length },
          { label: "אותיות ללא מנהל", value: unassigned.length, tone: unassigned.length ? "warn" : undefined },
        ]}
      />
      {letterData && unassigned.length > 0 && (
        <p className="notice notice--warn" style={{ marginBottom: 24 }}>
          סוכנים ששם המשפחה שלהם מתחיל באותיות {unassigned.join(", ")} לא ישויכו לאף מנהל בדוח.
        </p>
      )}
      <DataTable
        list={list}
        columns={COLUMNS}
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
        onSaved={refresh}
        onDeleted={refresh}
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
