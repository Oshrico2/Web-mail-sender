import { Plus, ShieldCheck } from "lucide-react";
import { Page, Ribbon } from "../components/Page";
import DataTable from "../components/DataTable";
import RecordSheet, { emailError, required } from "../components/RecordSheet";
import { Switch, TextInput } from "../components/Field";
import Empty from "../components/Empty";
import { usePagedList, useJson } from "../lib/usePagedList";
import ExportButton from "../components/ExportButton";
import { useSheetState } from "../lib/useSheetState";
import { useAuth } from "../lib/auth";

const COLUMNS = [
  { key: "firstName", label: "שם", className: "cell-strong", render: (u) => `${u.firstName} ${u.lastName}` },
  { key: "username", label: "שם משתמש", render: (u) => <span className="ltr">{u.username}</span> },
  { key: "email", label: "דואר אלקטרוני", hideSm: true, render: (u) => <span className="ltr">{u.email}</span> },
  {
    key: "isAdmin",
    label: "הרשאה",
    render: (u) => (u.isAdmin ? <span className="tag tag--gold">מנהל מערכת</span> : <span className="tag">משתמש</span>),
  },
];

const ENTITY = { one: "משתמש", the: "המשתמש", base: "/users", create: "/users/add" };

const MIN_PASSWORD = 6;

export default function UsersScreen() {
  const { user: me } = useAuth();
  const list = usePagedList("/users", { initialSort: { key: "firstName", dir: 1 } });
  const [stats, reloadStats] = useJson("/users/stats");
  const refresh = () => {
    list.reload();
    reloadStats();
  };
  const sheet = useSheetState();
  const isSelf = sheet.record?._id === me?._id;

  return (
    <Page
      title="משתמשים"
      actions={
        <>
          <ExportButton
            path="/users"
            params={{ q: list.query || undefined }}
            columns={[
              { key: "firstName", label: "שם פרטי" },
              { key: "lastName", label: "שם משפחה" },
              { key: "username", label: "שם משתמש" },
              { key: "email", label: "דואר אלקטרוני" },
              { key: "isAdmin", label: "מנהל מערכת" },
            ]}
            fileName="רשימת משתמשים"
            disabled={!list.total}
          />
          <button type="button" className="btn btn--primary" onClick={sheet.openNew}>
            <Plus />
            משתמש חדש
          </button>
        </>
      }
    >
      <Ribbon
        loading={!stats}
        panes={[
          { label: "משתמשים", value: stats?.total ?? 0 },
          { label: "מנהלי מערכת", value: stats?.admins ?? 0 },
        ]}
      />
      <DataTable
        list={list}
        columns={COLUMNS}
        guideKey="firstName"
        searchPlaceholder="חיפוש לפי שם, שם משתמש או מייל"
        onRowClick={sheet.openRecord}
        selectedId={sheet.selectedId}
        empty={<Empty icon={ShieldCheck} title="אין משתמשים" />}
      />
      <RecordSheet
        open={sheet.open}
        onClose={sheet.close}
        record={sheet.record}
        entity={ENTITY}
        canDelete={!isSelf}
        initial={(u) => ({
          firstName: u?.firstName || "",
          lastName: u?.lastName || "",
          username: u?.username || "",
          email: u?.email || "",
          password: "",
          isAdmin: Boolean(u?.isAdmin),
        })}
        validate={(f, { isNew }) => ({
          firstName: required(f.firstName, "שם פרטי"),
          lastName: required(f.lastName, "שם משפחה"),
          username: required(f.username, "שם משתמש"),
          email: emailError(f.email),
          password:
            (isNew || f.password) && f.password.length < MIN_PASSWORD
              ? `הסיסמא חייבת להכיל לפחות ${MIN_PASSWORD} תווים`
              : undefined,
        })}
        toPayload={(f) => {
          const { password, ...rest } = f;
          return password ? { ...rest, password } : rest;
        }}
        onSaved={refresh}
        onDeleted={refresh}
        renderFields={({ form, set, errors, isNew }) => (
          <>
            <div className="form-row">
              <TextInput label="שם פרטי" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} autoFocus={isNew} />
              <TextInput label="שם משפחה" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} />
            </div>
            <TextInput
              label="שם משתמש"
              className="input ltr-input"
              autoComplete="off"
              value={form.username}
              onChange={(e) => set("username", e.target.value)}
              error={errors.username}
            />
            <TextInput label="דואר אלקטרוני" type="email" hint="ישמש כברירת מחדל לשליחת דוחות" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
            <TextInput
              label={isNew ? "סיסמא" : "סיסמא חדשה"}
              optional={!isNew}
              type="password"
              autoComplete="new-password"
              hint={isNew ? `לפחות ${MIN_PASSWORD} תווים` : "השאירו ריק כדי לא לשנות"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
            />
            <Switch
              label="מנהל מערכת"
              description={isSelf ? "לא ניתן להסיר הרשאות מהמשתמש שלך" : "ניהול משתמשים וצפייה בהיסטוריית הפעולות"}
              checked={form.isAdmin}
              disabled={isSelf}
              onChange={(v) => set("isAdmin", v)}
            />
          </>
        )}
      />
    </Page>
  );
}
