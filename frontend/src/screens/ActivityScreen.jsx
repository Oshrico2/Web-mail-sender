import { useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { Page } from "../components/Page";
import Empty from "../components/Empty";
import { usePagedList } from "../lib/usePagedList";
import Pager from "../components/Pager";
import { dayKey, dayLabel, formatTime } from "../lib/format";

const KINDS = [
  { id: "all", label: "הכל" },
  { id: "green", label: "הוספות" },
  { id: "orange", label: "עדכונים" },
  { id: "red", label: "מחיקות" },
  { id: "blue", label: "שליחות ודוחות" },
];

export default function ActivityScreen() {
  const [kind, setKind] = useState("all");
  // Search and type filter run in the database; only one page is loaded.
  const list = usePagedList("/users-activity", {
    initialSort: { key: "createdAt", dir: -1 },
    params: { color: kind === "all" ? undefined : kind },
  });

  const groups = useMemo(() => {
    const map = new Map();
    for (const item of list.items) {
      const key = dayKey(item.createdAt);
      if (!map.has(key)) map.set(key, { label: dayLabel(item.createdAt), items: [] });
      map.get(key).items.push(item);
    }
    return [...map.values()];
  }, [list.items]);

  return (
    <Page title="היסטוריית פעולות" description="כל שינוי במאגרים וכל שליחה נרשמים כאן אוטומטית.">
      <div className="panel">
        <div className="toolbar">
          <label className="search">
            <span className="visually-hidden">חיפוש בהיסטוריה</span>
            <Search aria-hidden="true" />
            <input type="search" value={list.query} onChange={(e) => list.setQuery(e.target.value)} placeholder="חיפוש לפי שם, פעולה או משתמש" />
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

        {list.status === "loading" && (
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
        {list.status === "error" && <Empty tone="error" title="לא הצלחנו לטעון את ההיסטוריה" text={list.error} />}
        {(list.status === "ready" || list.status === "refreshing") && groups.length === 0 && (
          <Empty icon={History} title="אין פעולות להצגה" text={list.query || kind !== "all" ? "נסו סינון אחר." : "פעולות יופיעו כאן ברגע שמישהו ישנה משהו במערכת."} />
        )}
        <div aria-busy={list.status === "refreshing" || undefined} className="activity-page">
        {(list.status === "ready" || list.status === "refreshing") &&
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

        </div>
        {list.status !== "loading" && list.status !== "error" && (
          <Pager
            page={list.page}
            pages={list.pages}
            total={list.total}
            limit={list.limit}
            onPage={list.setPage}
            onLimit={list.setLimit}
            busy={list.status === "refreshing"}
          />
        )}
      </div>
    </Page>
  );
}
