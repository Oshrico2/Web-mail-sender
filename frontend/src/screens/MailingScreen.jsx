import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FlaskConical, Loader2, Paperclip, Send, X } from "lucide-react";
import { Page } from "../components/Page";
import { ConfirmDialog } from "../components/Dialog";
import { TextInput } from "../components/Field";
import { useToast } from "../components/Toast";
import { api, errorMessage } from "../lib/api";
import { useAuth } from "../lib/auth";
import { number } from "../lib/format";

const MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }, { direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};
const FORMATS = ["header", "bold", "italic", "underline", "list", "align", "direction", "color", "background", "link", "image"];
const MAX_FILE = 20 * 1024 * 1024;

const isEmpty = (html) => !html.replace(/<[^>]*>/g, "").trim() && !html.includes("<img");

export default function MailingScreen() {
  const toast = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [testTo, setTestTo] = useState(user?.email || "");
  const [recipients, setRecipients] = useState(null);
  const [busy, setBusy] = useState(null); // "test" | "send" | null
  const [confirming, setConfirming] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/mailing/recipients").then(({ data }) => setRecipients(data.count)).catch(() => setRecipients(null));
  }, []);

  useEffect(() => {
    if (busy !== "send") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const check = () => {
    const found = {
      title: title.trim() ? undefined : "יש להזין נושא",
      content: isEmpty(content) ? "יש לכתוב את תוכן ההודעה" : undefined,
    };
    setErrors(found);
    return !found.title && !found.content;
  };

  const send = async (isTest) => {
    if (!check()) return;
    if (isTest && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testTo.trim())) {
      setErrors((e) => ({ ...e, testTo: "כתובת הבדיקה אינה תקינה" }));
      return;
    }
    setConfirming(false);
    setBusy(isTest ? "test" : "send");
    const form = new FormData();
    form.append("title", title.trim());
    form.append("content", content);
    form.append("isTest", String(isTest));
    form.append("sendMailTo", isTest ? testTo.trim() : "");
    if (file) form.append("attachment", file, encodeURIComponent(file.name));
    try {
      const { data } = await api.post("/mailing", form);
      if (isTest) toast.success(`הבדיקה נשלחה אל ${testTo.trim()}`);
      else if (data.failed) toast.error(`נשלח ל־${number(data.sent)} סוכנים, ${number(data.failed)} נכשלו`);
      else toast.success(`ההודעה נשלחה ל־${number(data.sent)} סוכנים`);
    } catch (err) {
      toast.error(errorMessage(err, "השליחה נכשלה"));
    } finally {
      setBusy(null);
    }
  };

  const pickFile = (f) => {
    if (!f) return;
    if (f.size > MAX_FILE) {
      toast.error("הקובץ גדול מ־20MB");
      return;
    }
    setFile(f);
  };

  return (
    <Page
      title="הודעת תפוצה"
      description="נשלחת לכל הסוכנים שברשימת התפוצה, עם קישור להסרה בסוף ההודעה."
    >
      <div className="split">
        <div className="panel">
          <div className="panel__body form">
            <TextInput
              label="נושא"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((x) => ({ ...x, title: undefined }));
              }}
              error={errors.title}
            />
            <div className="field">
              <span className="field__label" id="content-label">
                תוכן ההודעה
              </span>
              <div className="editor" aria-labelledby="content-label">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(v) => {
                    setContent(v);
                    if (errors.content) setErrors((e) => ({ ...e, content: undefined }));
                  }}
                  modules={MODULES}
                  formats={FORMATS}
                  placeholder="כתבו כאן את ההודעה. אפשר להדביק תמונות."
                />
              </div>
              {errors.content && <span className="field__error">{errors.content}</span>}
            </div>
            <div className="field">
              <span className="field__label">
                קובץ מצורף <em>(רשות)</em>
              </span>
              {file ? (
                <div className="file-chip">
                  <Paperclip aria-hidden="true" />
                  <div>
                    <b>{file.name}</b>
                    <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <button type="button" className="btn btn--quiet btn--sm" onClick={() => setFile(null)}>
                    <X />
                    הסרה
                  </button>
                </div>
              ) : (
                <div>
                  <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
                    <Paperclip />
                    צירוף קובץ
                  </button>
                  <input ref={fileRef} type="file" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="stack">
          <section className="panel">
            <div className="panel__head">
              <h2 style={{ fontSize: "var(--fs-lg)" }}>בדיקה לפני שליחה</h2>
            </div>
            <div className="panel__body form">
              <TextInput
                label="לשלוח בדיקה אל"
                type="email"
                value={testTo}
                onChange={(e) => {
                  setTestTo(e.target.value);
                  setErrors((x) => ({ ...x, testTo: undefined }));
                }}
                error={errors.testTo}
              />
              <button type="button" className="btn btn--ghost" disabled={!!busy} onClick={() => send(true)}>
                {busy === "test" ? <Loader2 className="spin" /> : <FlaskConical />}
                שליחת בדיקה
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2 style={{ fontSize: "var(--fs-lg)" }}>שליחה לסוכנים</h2>
            </div>
            <div className="panel__body form">
              <p className="stat">
                <span className="ribbon__value">{recipients == null ? "—" : number(recipients)}</span>
                <span className="ribbon__label">סוכנים ברשימת התפוצה יקבלו את ההודעה</span>
              </p>
              <button
                type="button"
                className="btn btn--primary"
                disabled={!!busy || !recipients}
                onClick={() => check() && setConfirming(true)}
              >
                {busy === "send" ? <Loader2 className="spin" /> : <Send />}
                {busy === "send" ? "שולח… אין לסגור את העמוד" : "שליחה לכל הסוכנים"}
              </button>
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={confirming}
        title="לשלוח את ההודעה לכל הסוכנים?"
        confirmLabel={`שליחה ל־${number(recipients || 0)} סוכנים`}
        onConfirm={() => send(false)}
        onClose={() => setConfirming(false)}
      >
        <p>
          “{title}” תישלח ל־{number(recipients || 0)} סוכנים{file ? " עם הקובץ המצורף" : ""}.
        </p>
        <p style={{ marginTop: 8 }}>מומלץ לשלוח קודם בדיקה לעצמכם. אי אפשר לבטל שליחה.</p>
      </ConfirmDialog>
    </Page>
  );
}
