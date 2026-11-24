import { useMemo, useState } from "react";
import { Briefcase, Download, Plus } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { useResource } from "../lib/useResource";
import { useSheetState } from "../lib/useSheetState";
import { exportSheet } from "../lib/excel";
import { collator } from "../lib/format";

const COLUMNS = [
  { key: "name", label: "שם", className: "cell-strong" },
  { key: "subject", label: "תחום", render: (e) => <span className="tag tag--shade">{e.subject}</span> },
  {
    key: "email",
    label: "דואר אלקטרוני",
    render: (e) => (e.email ? <span className="ltr">{e.email}</span> : <span className="cell-muted">—</span>),
  },
];

const EXPORT = [
  { key: "name", label: "שם" },
  { key: "subject", label: "תחום" },
  { key: "email", label: "דואר אלקטרוני" },
];

const ENTITY = { one: "עובד", the: "העובד", base: "/employees", create: "/employees/add" };

export default function EmployeesScreen() {
  const { items, status, error, reload, upsert, remove, entering } = useResource("/employees");
  const sheet = useSheetState();
  const [filter, setFilter] = useState("all");

  // Subjects become filters, so “who handles pension?” is one click.
  const subjects = useMemo(
    () => [...new Set(items.map((e) => e.subject).filter(Boolean))].sort(collator.compare),
    [items]
  );
  const filters = useMemo(
    () => [{ id: "all", label: "הכל", test: () => true }, ...subjects.map((s) => ({ id: s, label: s, test: (e) => e.subject === s }))],
    [subjects]
  );

  return (
    <Page
      title="עובדים ותחומים"
      description="התחום של כל מטפל נכנס לעמודת “תחום” בסטטוס שהסוכנים מקבלים."
      actions={
        <>
          <button type="button" className="btn btn--ghost" disabled={!items.length} onClick={() => exportSheet(items, EXPORT, "רשימת עובדים")}>
            <Download />
            ייצוא לאקסל
          </button>
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            עובד חדש
          </button>
        </>
      }
    >
      <Ribbon
        panes={[
          { label: "עובדים", value: items.length },
          { label: "תחומים", value: subjects.length },
        ]}
        loading={status === "loading"}
      />
      <DataTable
        rows={items}
        columns={COLUMNS}
        status={status}
        error={error}
        onRetry={reload}
        entering={entering}
        filters={filters}
        filter={filter}
        onFilterChange={setFilter}
        searchKeys={["name", "subject", "email"]}
        searchPlaceholder="חיפוש לפי שם או תחום"
        onRowClick={sheet.openRecord}
        selectedId={sheet.selectedId}
        empty={<Empty icon={Briefcase} title="אין עדיין עובדים" text="הוסיפו עובד ואת התחום שלו." />}
      />
      <RecordSheet
        open={sheet.open}
        onClose={sheet.close}
        record={sheet.record}
        entity={ENTITY}
        initial={(e) => ({ name: e?.name || "", email: e?.email || "", subject: e?.subject || "" })}
        validate={(f) => ({
          name: required(f.name, "שם"),
          subject: required(f.subject, "תחום"),
          email: emailError(f.email, { optional: true }),
        })}
        onSaved={upsert}
        onDeleted={remove}
        renderFields={({ form, set, errors }) => (
          <>
            <TextInput
              label="שם"
              hint="כפי שמופיע בעמודה “שם מטפל” בקובץ"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
              autoFocus={!sheet.record}
            />
            <TextInput
              label="תחום"
              list="subjects"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              error={errors.subject}
            />
            <datalist id="subjects">
              {subjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <TextInput
              label="דואר אלקטרוני"
              optional
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
            />
          </>
        )}
      />
    </Page>
  );
}
