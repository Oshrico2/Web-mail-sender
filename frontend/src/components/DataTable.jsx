import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus, Search } from "lucide-react";
import { collator, normalize, number } from "../lib/format";
import Empty from "./Empty";

const SKELETON_ROWS = 8;

export const YesNo = ({ value, yes = "כן", no = "לא" }) =>
  value ? (
    <span className="yes" title={yes} aria-label={yes}>
      <Check strokeWidth={3} />
    </span>
  ) : (
    <span className="no" title={no} aria-label={no}>
      <Minus strokeWidth={3} />
    </span>
  );

const textOf = (col, row) => {
  const v = col.sortValue ? col.sortValue(row) : row[col.key];
  return Array.isArray(v) ? v.join(" ") : v;
};

/**
 * columns: [{ key, label, render?, sortValue?, className?, hideSm? }]
 * filters: [{ id, label, test(row) }]
 */
export default function DataTable({
  rows,
  columns,
  status = "ready",
  error,
  onRetry,
  searchKeys = ["name"],
  searchPlaceholder = "חיפוש",
  filters,
  filter,
  onFilterChange,
  chips = true,
  onRowClick,
  selectedId,
  guideKey = "name",
  entering,
  toolbarEnd,
  empty,
  initialSort,
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort || { key: columns[0].key, dir: 1 });
  const [range, setRange] = useState({ first: 0, last: 0 });
  const wrapRef = useRef(null);
  const sentinelRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Filtering happens in the browser: the list is already loaded, so there is
  // no request per keystroke and no out-of-order results.
  const filtered = useMemo(() => {
    const active = filters?.find((f) => f.id === filter);
    const q = normalize(query);
    let list = active ? rows.filter(active.test) : rows;
    if (q) {
      list = list.filter((row) =>
        searchKeys.some((key) => normalize(Array.isArray(row[key]) ? row[key].join(" ") : row[key]).includes(q))
      );
    }
    const col = columns.find((c) => c.key === sort.key);
    if (col) {
      list = [...list].sort((a, b) => {
        const va = textOf(col, a);
        const vb = textOf(col, b);
        if (typeof va === "boolean" || typeof vb === "boolean") return (Number(vb) - Number(va)) * sort.dir;
        return collator.compare(String(va ?? ""), String(vb ?? "")) * sort.dir;
      });
    }
    return list;
  }, [rows, filters, filter, query, searchKeys, columns, sort]);

  // Sticky header lifts once the list scrolls under it.
  useEffect(() => {
    const wrap = wrapRef.current;
    const sentinel = sentinelRef.current;
    if (!wrap || !sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      root: wrap,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [status]);

  // Guide words: the first and last record currently in view.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || status !== "ready") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = wrap.querySelector("tbody");
      if (!body) return;
      const top = wrap.getBoundingClientRect().top + 70;
      const bottom = wrap.getBoundingClientRect().bottom;
      const trs = body.children;
      let first = -1;
      let last = -1;
      for (let i = 0; i < trs.length; i++) {
        const r = trs[i].getBoundingClientRect();
        if (r.bottom > top && r.top < bottom) {
          if (first === -1) first = i;
          last = i;
        } else if (first !== -1) break;
      }
      setRange({ first: Math.max(first, 0), last: Math.max(last, 0) });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    wrap.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      wrap.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filtered, status]);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  const counts = useMemo(
    () => Object.fromEntries((filters || []).map((f) => [f.id, f.test ? rows.filter(f.test).length : rows.length])),
    [filters, rows]
  );

  const firstRow = filtered[range.first];
  const lastRow = filtered[range.last];

  return (
    <div className="panel">
      <div className="toolbar">
        <label className="search">
          <span className="visually-hidden">{searchPlaceholder}</span>
          <Search aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </label>
        {filters && chips && (
          <div className="chips" role="group" aria-label="סינון">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className="chip"
                aria-pressed={filter === f.id}
                onClick={() => onFilterChange(f.id)}
              >
                {f.label} <span className="num">{number(counts[f.id] ?? 0)}</span>
              </button>
            ))}
          </div>
        )}
        {toolbarEnd && <div className="toolbar__end">{toolbarEnd}</div>}
      </div>

      <div className="table-wrap" ref={wrapRef} data-scrolled={scrolled}>
        <div ref={sentinelRef} aria-hidden="true" style={{ height: 1, marginBottom: -1 }} />
        {status === "error" ? (
          <Empty
            tone="error"
            title="לא הצלחנו לטעון את הרשימה"
            text={error}
            action={
              onRetry && (
                <button type="button" className="btn btn--ghost" onClick={onRetry}>
                  נסה שוב
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="guide" aria-live="off">
              <span className="guide__word">
                {status === "ready" && firstRow ? textOf({ key: guideKey }, firstRow) : " "}
              </span>
              <span className="guide__range">
                {status === "loading"
                  ? "טוען…"
                  : filtered.length
                    ? `מוצגים ${number(range.first + 1)}–${number(range.last + 1)} מתוך ${number(filtered.length)}`
                    : "אין תוצאות"}
              </span>
              <span className="guide__word">
                {status === "ready" && lastRow && range.last !== range.first
                  ? textOf({ key: guideKey }, lastRow)
                  : " "}
              </span>
            </div>
            <table className="table" data-enter={entering || undefined}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={col.hideSm ? "hide-sm" : undefined}
                      aria-sort={sort.key === col.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                    >
                      {col.sortable === false ? (
                        <span className="th-plain">{col.label}</span>
                      ) : (
                        <button type="button" className="th-btn" onClick={() => toggleSort(col.key)}>
                          {col.label}
                          {sort.key === col.key ? sort.dir === 1 ? <ArrowDown /> : <ArrowUp /> : <ArrowUpDown />}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {status === "loading"
                  ? Array.from({ length: SKELETON_ROWS }, (_, i) => (
                      <tr key={i} className="skeleton-row" aria-hidden="true">
                        {columns.map((col, c) => (
                          <td key={col.key} className={col.hideSm ? "hide-sm" : undefined}>
                            <span className="skel" style={{ width: `${40 + ((i * 7 + c * 13) % 45)}%` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filtered.map((row, i) => (
                      <tr
                        key={row._id || i}
                        style={{ "--i": i }}
                        data-clickable={onRowClick ? "true" : undefined}
                        aria-selected={selectedId === row._id || undefined}
                        tabIndex={onRowClick ? 0 : undefined}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        onKeyDown={
                          onRowClick
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  onRowClick(row);
                                }
                              }
                            : undefined
                        }
                      >
                        {columns.map((col) => (
                          <td key={col.key} className={[col.className, col.hideSm && "hide-sm"].filter(Boolean).join(" ") || undefined}>
                            {col.render ? col.render(row) : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
            {status === "ready" && filtered.length === 0 && (
              query ? (
                <Empty title="לא נמצאו תוצאות" text={`אין רשומות שמתאימות ל"${query}". נסה מילה אחרת או נקה את החיפוש.`} action={<button type="button" className="btn btn--ghost" onClick={() => setQuery("")}>ניקוי חיפוש</button>} />
              ) : (
                empty
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
