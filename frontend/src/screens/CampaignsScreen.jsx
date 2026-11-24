import { Building2, Plus } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { required } from "../components/RecordSheet";
import { TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { usePagedList, useJson } from "../lib/usePagedList";
import ExportButton from "../components/ExportButton";
import { useSheetState } from "../lib/useSheetState";
import { formatDate } from "../lib/format";

const COLUMNS = [
  { key: "name", label: "שם הקמפיין / הוועד", className: "cell-strong" },
  { key: "createdBy", label: "נוסף על ידי", className: "cell-muted", hideSm: true },
  { key: "createdAt", label: "תאריך הוספה", className: "cell-muted", hideSm: true, render: (c) => formatDate(c.createdAt) },
];

const ENTITY = { one: "קמפיין", the: "הקמפיין", base: "/campaigns", create: "/campaigns/add" };

export default function CampaignsScreen() {
  const list = usePagedList("/campaigns", { initialSort: { key: "name", dir: 1 } });
  // total of the whole collection (not of the current search)
  const [all, reloadAll] = useJson("/campaigns?limit=1");
  const refresh = () => {
    list.reload();
    reloadAll();
  };
  const sheet = useSheetState();

  return (
    <Page
      title="קמפיינים וועדים"
      description="לידים שמגיעים מקמפיין או מוועד לא משויכים לסוכן, ומסוננים מדוח מנהלי הפיתוח."
      actions={
        <>
          <ExportButton
            path="/campaigns"
            params={{ q: list.query || undefined }}
            columns={[{ key: "name", label: "שם" }, { key: "createdBy", label: "נוסף על ידי" }]}
            fileName="רשימת קמפיינים וועדים"
            disabled={!list.total}
          />
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            קמפיין או ועד
          </button>
        </>
      }
    >
      <Ribbon panes={[{ label: "קמפיינים וועדים במאגר", value: all?.total ?? 0 }]} loading={!all} />
      <DataTable
        list={list}
        columns={COLUMNS}
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
        onSaved={refresh}
        onDeleted={refresh}
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
