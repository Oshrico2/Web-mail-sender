import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BrandMark from "../components/BrandMark";
import { TextInput } from "../components/Field";
import { useAuth } from "../lib/auth";
import { errorMessage } from "../lib/api";

// Facade windows: a few stay dark, like a real building at dusk.
const WINDOWS = Array.from({ length: 16 }, (_, i) => ({ i, o: [3, 7, 12].includes(i) ? 0.18 : 1 }));

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "כניסה · תלפיות";
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("יש להזין שם משתמש וסיסמא");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(errorMessage(err, "הכניסה נכשלה"));
      setBusy(false);
    }
  };

  return (
    <div className="door">
      <section className="door__facade">
        <div className="door__brand">
          <BrandMark title="תלפיות" />
          <div>
            <b>תלפיות</b>
            <small>FAMILY OFFICE</small>
          </div>
        </div>
        <div className="door__copy">
          <h1>כל סוכן מקבל את הלקוחות שלו, כל בוקר.</h1>
          <p>סטטוס לקוחות, דוחות למנהלי פיתוח ודיוור לסוכנים, ממקום אחד.</p>
        </div>
        <div className="door__foot">ניהול כלכלי משפחתי · צוות סינרגיה</div>
        <div className="stairwell" aria-hidden="true">
          {WINDOWS.map((w) => (
            <i key={w.i} style={{ "--i": w.i, "--o": w.o }} />
          ))}
        </div>
      </section>

      <main className="door__form">
        <form className="door__card form" onSubmit={submit} noValidate>
          <div>
            <h2>כניסה למערכת</h2>
            <p style={{ margin: "8px 0 24px", color: "var(--muted)" }}>התחברו עם שם המשתמש שקיבלתם ממנהל המערכת.</p>
          </div>
          <TextInput
            label="שם משתמש"
            className="input ltr-input"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextInput
            label="סיסמא"
            type="password"
            className="input ltr-input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          <button type="submit" className="btn btn--dark btn--block" disabled={busy} style={{ marginTop: 8 }}>
            {busy && <Loader2 className="spin" />}
            {busy ? "מתחבר…" : "כניסה"}
          </button>
        </form>
      </main>
    </div>
  );
}
