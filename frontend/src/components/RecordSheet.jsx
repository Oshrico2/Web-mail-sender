import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Sheet, ConfirmDialog } from "./Dialog";
import { useToast } from "./Toast";
import { api, errorMessage } from "../lib/api";
import { formatDate } from "../lib/format";

/**
 * Create / edit / delete one record in a side panel.
 * The panel keeps its record while it slides out, so nothing blanks mid-exit.
 */
export default function RecordSheet({
  open,
  onClose,
  record,
  entity, // { one: "סוכן", the: "הסוכן", base: "/agents", create: "/agents/add" }
  initial,
  validate,
  toPayload = (form) => form,
  renderFields,
  onSaved,
  onDeleted,
  canDelete = true,
  deleteText,
  extraActions,
}) {
  const toast = useToast();
  const isNew = !record?._id;
  const [form, setForm] = useState(() => initial(record));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial(record));
      setErrors({});
      setConfirmDelete(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, record]);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validate ? validate(form, { isNew }) : {};
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      return;
    }
    setBusy(true);
    try {
      const payload = toPayload(form, { isNew });
      const { data } = isNew
        ? await api.post(entity.create, payload)
        : await api.put(`${entity.base}/${record._id}`, payload);
      toast.success(isNew ? `${entity.the} נוסף בהצלחה` : `הפרטים של ${entity.the} נשמרו`);
      onSaved(data);
      onClose();
    } catch (error) {
      const field = error.response?.data?.field;
      const message = errorMessage(error, "השמירה נכשלה");
      if (field && field in form) setErrors({ [field]: message });
      else toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api.delete(`${entity.base}/${record._id}`);
      toast.success(`${entity.the} נמחק`);
      setConfirmDelete(false);
      onDeleted(record._id);
      onClose();
    } catch (error) {
      toast.error(errorMessage(error, "המחיקה נכשלה"));
    } finally {
      setBusy(false);
    }
  };

  const name = record?.name || [record?.firstName, record?.lastName].filter(Boolean).join(" ");

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        busy={busy}
        title={isNew ? `${entity.one} חדש` : name || `עריכת ${entity.one}`}
        subtitle={isNew ? `הפרטים יישמרו במאגר ויירשמו בהיסטוריית הפעולות` : `עריכת ${entity.one}`}
        footer={
          <>
            <button type="submit" form="record-form" className="btn btn--primary" disabled={busy}>
              {busy && <Loader2 className="spin" />}
              {isNew ? "הוספה" : "שמירה"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
              ביטול
            </button>
            <span className="spacer" />
            {!isNew && canDelete && (
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
              >
                <Trash2 />
                מחיקה
              </button>
            )}
          </>
        }
      >
        <form id="record-form" className="form" onSubmit={submit} noValidate>
          {renderFields({ form, set, errors, isNew })}
        </form>
        {extraActions && !isNew && <div style={{ marginTop: 20 }}>{extraActions}</div>}
        {!isNew && record?.createdAt && (
          <div className="meta">
            <span>
              נוצר על ידי {record.createdBy || "—"} · {formatDate(record.createdAt)}
            </span>
            {record.updatedAt && (
              <span>
                עודכן לאחרונה על ידי {record.updatedBy || "—"} · {formatDate(record.updatedAt)}
              </span>
            )}
          </div>
        )}
      </Sheet>

      <ConfirmDialog
        open={confirmDelete}
        title={`למחוק את ${name || entity.the}?`}
        confirmLabel="מחיקה"
        tone="danger"
        busy={busy}
        onConfirm={remove}
        onClose={() => setConfirmDelete(false)}
      >
        {deleteText || "הפעולה תירשם בהיסטוריה ואי אפשר לבטל אותה."}
      </ConfirmDialog>
    </>
  );
}

export const required = (value, label) => (String(value ?? "").trim() ? undefined : `יש למלא ${label}`);
export const emailError = (value, { optional } = {}) => {
  const v = String(value ?? "").trim();
  if (!v) return optional ? undefined : "יש למלא כתובת מייל";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "כתובת המייל אינה תקינה";
};
