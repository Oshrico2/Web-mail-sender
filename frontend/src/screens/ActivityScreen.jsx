import { useCallback, useEffect, useMemo, useState } from "react";
import { History, Loader2, Search } from "lucide-react";
import { Page } from "../components/Page";
import Empty from "../components/Empty";
import { api, errorMessage } from "../lib/api";
import { dayKey, dayLabel, formatTime, normalize } from "../lib/format";

const PAGE = 50;
const KINDS = [
  { id: "all", label: "הכל" },
  { id: "green", label: "הוספות" },
  { id: "orange", label: "עדכונים" },
  { id: "red", label: "מחיקות" },
  { id: "blue", label: "שליחות ודוחות" },
];

export default function ActivityScreen() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [kind, setKind] = useState("all");
  const [q, setQ] = useState("");

  const load = useCallback(async (skip = 0) => {
    const { data, headers } = await api.get("/users-activity", { params: { limit: PAGE, skip } });
    setTotal(Number(headers["x-total-count"]) || 0);
    setItems((prev) => (skip ? [...prev, ...data] : data));
  }, []);

  useEffect(() => {
    load()
      .then(() => setStatus("ready"))
      .catch((err) => {
        setError(errorMessage(err));
        setStatus("error");
      });
  }, [load]);

  const more = async () => {
    setLoadingMore(true);
    try {
      await load(items.length);
    } finally {
      setLoadingMore(false);
    }
  };

  const groups = useMemo(() => {
    const query = normalize(q);
    const list = items.filter(
      (i) =>
        (kind === "all" || i.color === kind) &&
        (!query || normalize(`${i.title} ${i.description} ${i.createdBy}`).includes(query))
    );
    const map = new Map();
    for (const item of list) {
      const key = dayKey(item.createdAt);
      if (!map.has(key)) map.set(key, { label: dayLabel(item.createdAt), items: [] });
      map.get(key).items.push(item);
    }
    return [...map.values()];
  }, [items, kind, q]);

  return (
    <Page title="היסטוריית פעולות" description="כל שינוי במאגרים וכל שליחה נרשמים כאן אוטומטית.">
      <div className="panel">
        <div className="toolbar">
          <label className="search">
            <span className="visually-hidden">חיפוש בהיסטוריה</span>
            <Search aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש לפי שם, פעולה או משתמש" />
          </label>
          <div className="chips" role="group" aria-label="סוג פעולה">
            {KINDS.map((k) => (
              <button key={k.id} type="button" className="chip" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
                {k.id !== "all" && <span className={`feed__dot dot-${k.id}`} style={{ margin: 0, width: 8, height: 8 }} />}
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" && (
          <ul className="feed" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <span className="feed__dot" style={{ background: "var(--plaster-2)" }} />
                <div>
                  <span className="skel" style={{ width: "30%", marginBottom: 8 }} />
                  <span className="skel" style={{ width: `${50 + (i % 4) * 10}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
        {status === "error" && <Empty tone="error" title="לא הצלחנו לטעון את ההיסטוריה" text={error} />}
        {status === "ready" && groups.length === 0 && (
          <Empty icon={History} title="אין פעולות להצגה" text={q || kind !== "all" ? "נסו סינון אחר." : "פעולות יופיעו כאן ברגע שמישהו ישנה משהו במערכת."} />
        )}
        {status === "ready" &&
          groups.map((g) => (
            <section key={g.label}>
              <h2 className="day-band">{g.label}</h2>
              <ul className="feed">
                {g.items.map((item) => (
                  <li key={item._id}>
                    <span className={`feed__dot dot-${item.color}`} aria-hidden="true" />
                    <div>
                      <b>{item.title}</b>
                      <p>
                        {item.entityName && <>{item.entityName} · </>}
                        {item.action} · {item.createdBy}
                      </p>
                    </div>
                    <time dateTime={item.createdAt}>{formatTime(item.createdAt)}</time>
                  </li>
                ))}
              </ul>
            </section>
          ))}

        {status === "ready" && items.length < total && (
          <div className="table-foot">
            <span>
              מוצגות {items.length} מתוך {total} פעולות
            </span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={more} disabled={loadingMore}>
              {loadingMore && <Loader2 className="spin" />}
              טעינת פעולות קודמות
            </button>
          </div>
        )}
      </div>
    </Page>
  );
}
