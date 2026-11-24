import { useEffect, useState } from "react";
import { MailX, Loader2 } from "lucide-react";
import { TextInput } from "../components/Field";
import { api, errorMessage } from "../lib/api";

// Public page, linked from every mailing email. Works without login.
export default function RemoveMailingScreen() {
  const [email, setEmail] = useState(() => new URLSearchParams(window.location.search).get("email") || "");
  const [state, setState] = useState("idle"); // idle | busy | done
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "הסרה מדיוור · תלפיות";
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("נא להזין כתובת מייל תקינה");
      return;
    }
    setState("busy");
    setError("");
    try {
      await api.put("/remove-mailing", { email: email.trim() });
      setState("done");
    } catch (err) {
      setError(errorMessage(err));
      setState("idle");
    }
  };

  return (
    <main className="public">
      <div className="public__card">
        <img src="/images/logo.jpg" alt="תלפיות Family Office" width="96" height="96" />
        {state === "done" ? (
          <div className="done-mark" role="status">
            <span className="empty__mark" aria-hidden="true">
              <MailX />
            </span>
            <h1>הוסרת מרשימת הדיוור</h1>
            <p style={{ color: "var(--muted)" }}>
              לא תקבל/י יותר הודעות תפוצה מתלפיות. סטטוס הלקוחות האישי שלך ימשיך להגיע כרגיל.
            </p>
          </div>
        ) : (
          <>
            <h1>הסרה מדיוור</h1>
            <p>הזינו את כתובת המייל שאליה מגיעות הודעות התפוצה.</p>
            <form className="form" onSubmit={submit} noValidate>
              <TextInput
                label="דואר אלקטרוני"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <button type="submit" className="btn btn--dark btn--block" disabled={state === "busy"}>
                {state === "busy" && <Loader2 className="spin" />}
                הסירו אותי מהדיוור
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
