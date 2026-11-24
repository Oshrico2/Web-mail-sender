import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { dayLabel, formatTime, number } from "../lib/format";

const ACTIONS = [
  {
    to: "/send-mail",
    title: "שליחת סטטוס לקוחות",
    text: "מעלים את קובץ האקסל, בודקים ושולחים לכל סוכן את הלקוחות שלו.",
  },
  {
    to: "/business-managers/report",
    title: "דוח מנהלי פיתוח",
    text: "שיוך כל ליד למנהל הפיתוח העסקי לפי שם המשפחה של הסוכן.",
  },
  {
    to: "/mailing",
    title: "הודעת תפוצה",
    text: "מייל מעוצב לכל הסוכנים שברשימת התפוצה, עם בדיקה לפני שליחה.",
  },
];

const greeting = () => {
  const h = Number(new Date().toLocaleString("en-US", { timeZone: "Asia/Jerusalem", hour: "numeric", hour12: false }));
  if (h < 12) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  return "ערב טוב";
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [agents, setAgents] = useState(null);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    document.title = "דף הבית · תלפיות";
    api.get("/agents").then(({ data }) => setAgents(data)).catch(() => setAgents([]));
    if (user?.isAdmin) {
      api.get("/users-activity", { params: { limit: 6 } }).then(({ data }) => setActivity(data)).catch(() => setActivity([]));
    }
  }, [user?.isAdmin]);

  const list = agents || [];
  const panes = [
    { label: "סוכנים במאגר", to: "/agents", value: list.length },
    { label: "סטטוס יומי", to: "/agents?filter=daily", value: list.filter((a) => a.customerStatus !== false && !a.weeklyStatus).length },
    { label: "סטטוס שבועי", to: "/agents?filter=weekly", value: list.filter((a) => a.customerStatus !== false && a.weeklyStatus).length },
    { label: "לא מקבלים סטטוס", to: "/agents?filter=none", value: list.filter((a) => a.customerStatus === false).length },
    { label: "ברשימת תפוצה", to: "/agents?filter=mailing", value: list.filter((a) => a.confirmedMailing !== false).length },
  ];

  return (
    <div className="page stack">
      <header className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="home-hello">
            {greeting()}, {user?.firstName}
          </h1>
          <p>מה שולחים היום?</p>
        </div>
      </header>

      <section className="today" aria-label="עבודה יומית">
        <Link to="/send-mail" className="today__main">
          <span className="today__windows" aria-hidden="true">
            {Array.from({ length: 15 }, (_, i) => (
              <i key={i} style={{ "--i": i }} data-dark={[4, 9, 13].includes(i) || undefined} />
            ))}
          </span>
          <span className="today__text">
            <b>שליחת סטטוס לקוחות</b>
            <span>מעלים את קובץ האקסל מהמערכת, בודקים, ושולחים לכל סוכן את הלקוחות שלו.</span>
          </span>
          <span className="btn btn--primary today__cta">
            <Send />
            להתחלת שליחה
          </span>
        </Link>
        <nav className="today__more" aria-label="עוד פעולות">
          {ACTIONS.slice(1).map(({ to, title, text }) => (
            <Link key={to} to={to} className="today__row">
              <span>
                <b>{title}</b>
                <span>{text}</span>
              </span>
              <ArrowLeft className="today__go" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>

      <section>
        <h2 className="section-title">המאגר במבט אחד</h2>
        <nav className="ribbon" aria-label="סוכנים לפי קבוצה">
          {panes.map((pane) => (
            <Link key={pane.label} to={pane.to} className="ribbon__pane">
              <span className="ribbon__label">{pane.label}</span>
              <span className="ribbon__value">{agents ? number(pane.value) : "—"}</span>
            </Link>
          ))}
        </nav>
      </section>

      {user?.isAdmin && (
        <section>
          <h2 className="section-title">פעולות אחרונות</h2>
          <div className="panel">
            <ul className="feed feed--two">
              {!activity &&
                Array.from({ length: 4 }, (_, i) => (
                  <li key={i} aria-hidden="true">
                    <span className="feed__dot" style={{ background: "var(--plaster-2)" }} />
                    <span className="skel" style={{ width: "80%", marginTop: 6 }} />
                  </li>
                ))}
              {activity?.length === 0 && <li className="cell-muted">עדיין אין פעולות.</li>}
              {activity?.map((item) => (
                <li key={item._id}>
                  <span className={`feed__dot dot-${item.color}`} aria-hidden="true" />
                  <div>
                    <b>{item.title}</b>
                    <p>
                      {item.entityName} · {item.createdBy}
                    </p>
                  </div>
                  <time dateTime={item.createdAt}>
                    {dayLabel(item.createdAt) === "היום" ? formatTime(item.createdAt) : dayLabel(item.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
            <div className="table-foot">
              <span>6 הפעולות האחרונות במערכת</span>
              <Link to="/users/history">לכל ההיסטוריה</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
