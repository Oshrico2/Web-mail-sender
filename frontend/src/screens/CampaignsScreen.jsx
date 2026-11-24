import { Building2, Download, Plus } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { useResource } from "../lib/useResource";
import { useSheetState } from "../lib/useSheetState";
import { exportSheet } from "../lib/excel";
import { formatDate } from "../lib/format";

const COLUMNS = [
  { key: "name", label: "שם הקמפיין / הוועד", className: "cell-strong" },
  { key: "createdBy", label: "נוסף על ידי", className: "cell-muted", hideSm: true },
  { key: "createdAt", label: "תאריך הוספה", className: "cell-muted", hideSm: true, render: (c) => formatDate(c.createdAt) },
];

const ENTITY = { one: "קמפיין", the: "הקמפיין", base: "/campaigns", create: "/campaigns/add" };

export default function CampaignsScreen() {
  const { items, status, error, reload, upsert, remove, entering } = useResource("/campaigns");
  const sheet = useSheetState();

  return (
    <Page
      title="קמפיינים וועדים"
      description="לידים שמגיעים מקמפיין או מוועד לא משויכים לסוכן, ומסוננים מדוח מנהלי הפיתוח."
      actions={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={!items.length}
            onClick={() => exportSheet(items, [{ key: "name", label: "שם" }, { key: "createdBy", label: "נוסף על ידי" }], "רשימת קמפיינים וועדים")}
          >
            <Download />
            ייצוא לאקסל
          </button>
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            קמפיין או ועד
          </button>
        </>
      }
    >
      <Ribbon panes={[{ label: "קמפיינים וועדים במאגר", value: items.length }]} loading={status === "loading"} />
      <DataTable
        rows={items}
        columns={COLUMNS}
        status={status}
        error={error}
        onRetry={reload}
        entering={entering}
        searchPlaceholder="חיפוש קמפיין או ועד"
        onRowClick={sheet.openRecord}
        selectedId={sheet.selectedId}
        empty={<Empty icon={Building2} title="אין עדיין קמפיינים" text="הוסיפו קמפיין או ועד כדי שהלידים שלו לא ייספרו לסוכנים." />}
      />
      <RecordSheet
        open={sheet.open}
        onClose={sheet.close}
        record={sheet.record}
        entity={ENTITY}
        initial={(c) => ({ name: c?.name || "" })}
        validate={(f) => ({ name: required(f.name, "שם") })}
        onSaved={upsert}
        onDeleted={remove}
        renderFields={({ form, set, errors }) => (
          <TextInput
            label="שם"
            hint="בדיוק כפי שמופיע בעמודה “סוכן בכרטיס לקוח” בקובץ"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
            autoFocus
          />
        )}
      />
    </Page>
  );
}
