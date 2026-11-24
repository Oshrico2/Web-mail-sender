import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable, { YesNo } from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { Switch, TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { usePagedList, useJson } from "../lib/usePagedList";
import ExportButton from "../components/ExportButton";
import { useSheetState } from "../lib/useSheetState";

const getsStatus = (a) => a.customerStatus !== false;

// Groups are evaluated by the server (GET /api/agents?filter=…, /agents/stats).
const FILTERS = [
  { id: "all", label: "כל הסוכנים" },
  { id: "daily", label: "סטטוס יומי" },
  { id: "weekly", label: "סטטוס שבועי" },
  { id: "none", label: "לא מקבלים סטטוס", tone: "warn" },
  { id: "mailing", label: "ברשימת תפוצה" },
  { id: "noMailing", label: "הוסרו מתפוצה", tone: "muted" },
];

const statusTag = (a) =>
  !getsStatus(a) ? (
    <span className="tag tag--warn">ללא סטטוס</span>
  ) : a.weeklyStatus ? (
    <span className="tag tag--gold">שבועי</span>
  ) : (
    <span className="tag">יומי</span>
  );

const COLUMNS = [
  {
    key: "name",
    label: "שם (כפי שמופיע בבאפי)",
    className: "cell-strong",
    render: (a) => (
      <>
        {a.name}
        <span className="show-sm">{statusTag(a)}</span>
      </>
    ),
  },
  { key: "agentNumber", label: "מספר סוכן", className: "cell-muted num", hideSm: true },
  { key: "email", label: "דואר אלקטרוני", render: (a) => <span className="ltr cell-ellipsis" title={a.email}>{a.email}</span> },
  {
    key: "additionalMail",
    label: "מייל נוסף",
    hideSm: true,
    render: (a) => (a.additionalMail ? <span className="ltr">{a.additionalMail}</span> : <span className="cell-muted">—</span>),
  },
  {
    key: "status",
    label: "סטטוס לקוחות",
    hideSm: true,
    sortable: false,
    render: statusTag,
  },
  {
    key: "confirmedMailing",
    label: "תפוצה",
    hideSm: true,
    render: (a) => <YesNo value={a.confirmedMailing !== false} yes="מקבל דיוור" no="הוסר מדיוור" />,
  },
];

const EXPORT = [
  { key: "name", label: "שם" },
  { key: "firstName", label: "שם פרטי" },
  { key: "lastName", label: "שם משפחה" },
  { key: "agentNumber", label: "מספר סוכן" },
  { key: "email", label: "דואר אלקטרוני" },
  { key: "additionalMail", label: "מייל נוסף" },
  { key: "customerStatus", label: "מקבל סטטוס", exportValue: (a) => getsStatus(a) },
  { key: "weeklyStatus", label: "סטטוס שבועי", exportValue: (a) => Boolean(a.weeklyStatus) },
  { key: "confirmedMailing", label: "מקבל דיוור", exportValue: (a) => a.confirmedMailing !== false },
];

const ENTITY = { one: "סוכן", the: "הסוכן", base: "/agents", create: "/agents/add" };

const initial = (a) => ({
  name: a?.name || "",
  firstName: a?.firstName || "",
  lastName: a?.lastName || "",
  agentNumber: a?.agentNumber || "",
  email: a?.email || "",
  additionalMail: a?.additionalMail || "",
  customerStatus: a ? a.customerStatus !== false : true,
  weeklyStatus: Boolean(a?.weeklyStatus),
  confirmedMailing: a ? a.confirmedMailing !== false : true,
});

const validate = (f) => ({
  name: required(f.name, "שם"),
  lastName: required(f.lastName, "שם משפחה"),
  email: emailError(f.email),
  additionalMail: emailError(f.additionalMail, { optional: true }),
});

export default function AgentsScreen() {
  const [stats, reloadStats] = useJson("/agents/stats");
  const sheet = useSheetState();
  const [params, setParams] = useSearchParams();
  const [filter, setFilterState] = useState(params.get("filter") || "all");

  const setFilter = (id) => {
    const next = filter === id ? "all" : id;
    setFilterState(next);
    const p = new URLSearchParams(params);
    if (next === "all") p.delete("filter");
    else p.set("filter", next);
    setParams(p, { replace: true });
  };

  const list = usePagedList("/agents", { initialSort: { key: "name", dir: 1 }, params: { filter } });
  const panes = FILTERS.map((f) => ({ id: f.id, label: f.label, tone: f.tone, value: stats?.[f.id] ?? 0 }));
  const refresh = () => {
    list.reload();
    reloadStats();
  };

  return (
    <Page
      title="סוכנים"
      actions={
        <>
          <ExportButton
            path="/agents"
            params={{ filter, q: list.query || undefined, sort: "name" }}
            columns={EXPORT}
            fileName="רשימת סוכנים"
            disabled={!list.total}
          />
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            סוכן חדש
          </button>
        </>
      }
    >
      <Ribbon panes={panes} active={filter} onSelect={setFilter} loading={!stats} />

      <DataTable
        list={list}
        columns={COLUMNS}
        searchPlaceholder="חיפוש לפי שם, מספר סוכן או מייל"
        onRowClick={sheet.openRecord}
        selectedId={sheet.selectedId}
        empty={
          <Empty
            icon={Users}
            title={filter === "all" ? "עדיין אין סוכנים" : "אין סוכנים בקבוצה הזו"}
            text={filter === "all" ? "הוסיפו סוכן כדי שיקבל סטטוס לקוחות במייל." : "נסו קבוצה אחרת מהפס למעלה."}
            action={
              filter === "all" && (
                <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
                  <Plus /> סוכן חדש
                </button>
              )
            }
          />
        }
      />

      <RecordSheet
        open={sheet.open}
        onClose={sheet.close}
        record={sheet.record}
        entity={ENTITY}
        initial={initial}
        validate={validate}
        onSaved={refresh}
        onDeleted={refresh}
        deleteText="הסוכן יוסר מהמאגר ולא יקבל יותר סטטוסים או דיוור. הפעולה תירשם בהיסטוריה."
        renderFields={({ form, set, errors }) => (
          <>
            <TextInput
              label="שם בבאפי"
              hint="בדיוק כפי שמופיע בעמודה “סוכן בכרטיס לקוח” בקובץ האקסל"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={errors.name}
              autoFocus={!sheet.record}
            />
            <div className="form-row">
              <TextInput label="שם פרטי" optional value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
              <TextInput
                label="שם משפחה"
                hint="קובע לאיזה מנהל פיתוח עסקי הסוכן משויך"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                error={errors.lastName}
              />
            </div>
            <TextInput
              label="מספר סוכן"
              optional
              inputMode="numeric"
              value={form.agentNumber}
              onChange={(e) => set("agentNumber", e.target.value)}
            />
            <TextInput label="דואר אלקטרוני" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
            <TextInput
              label="מייל נוסף"
              optional
              type="email"
              hint="יקבל עותק (CC) של כל סטטוס"
              value={form.additionalMail}
              onChange={(e) => set("additionalMail", e.target.value)}
              error={errors.additionalMail}
            />
            <Switch
              label="מקבל סטטוס לקוחות"
              description="כבוי: הסוכן לא יקבל סטטוס יומי או שבועי"
              checked={form.customerStatus}
              onChange={(v) => set("customerStatus", v)}
            />
            <Switch
              label="סטטוס פעם בשבוע בלבד"
              description="הסוכן ידולג בשליחה היומית"
              checked={form.weeklyStatus}
              disabled={!form.customerStatus}
              onChange={(v) => set("weeklyStatus", v)}
            />
            <Switch
              label="מקבל דיוור"
              description="הודעות תפוצה כלליות לסוכנים"
              checked={form.confirmedMailing}
              onChange={(v) => set("confirmedMailing", v)}
            />
          </>
        )}
      />
    </Page>
  );
}
