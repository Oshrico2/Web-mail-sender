import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { usePagedList, useJson } from "../lib/usePagedList";
import ExportButton from "../components/ExportButton";
import { useSheetState } from "../lib/useSheetState";

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
  const [filter, setFilter] = useState("all");
  const list = usePagedList("/employees", {
    initialSort: { key: "name", dir: 1 },
    params: { subject: filter === "all" ? undefined : filter },
  });
  const sheet = useSheetState();
  // Subjects and their counts come from the server, not from a full download.
  const [subjectData, reloadSubjects] = useJson("/employees/subjects");
  const subjects = (subjectData?.subjects || []).map((s) => s.subject);
  const filters = [{ id: "all", label: "הכל" }, ...subjects.map((s) => ({ id: s, label: s }))];
  const counts = {
    all: subjectData?.total,
    ...Object.fromEntries((subjectData?.subjects || []).map((s) => [s.subject, s.count])),
  };
  const refresh = () => {
    list.reload();
    reloadSubjects();
  };

  return (
    <Page
      title="עובדים ותחומים"
      description="התחום של כל מטפל נכנס לעמודת “תחום” בסטטוס שהסוכנים מקבלים."
      actions={
        <>
          <ExportButton
            path="/employees"
            params={{ q: list.query || undefined, subject: filter === "all" ? undefined : filter }}
            columns={EXPORT}
            fileName="רשימת עובדים"
            disabled={!list.total}
          />
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            עובד חדש
          </button>
        </>
      }
    >
      <Ribbon
        panes={[
          { label: "עובדים", value: subjectData?.total ?? 0 },
          { label: "תחומים", value: subjects.length },
        ]}
        loading={!subjectData}
      />
      <DataTable
        list={list}
        columns={COLUMNS}
        filters={filters}
        counts={counts}
        filter={filter}
        onFilterChange={setFilter}
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
        onSaved={refresh}
        onDeleted={refresh}
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
