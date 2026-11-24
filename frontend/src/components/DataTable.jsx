import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Minus, Search } from "lucide-react";
import { number } from "../lib/format";
import Empty from "./Empty";
import Pager from "./Pager";

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

/**
 * Renders one server page. `list` comes from usePagedList.
 * columns: [{ key, label, render?, sortKey? (server field), sortable?, className?, hideSm? }]
 * filters: [{ id, label }] with counts: { [id]: number }
 */
export default function DataTable({
  list,
  columns,
  searchPlaceholder = "חיפוש",
  filters,
  filter,
  onFilterChange,
  counts,
  onRowClick,
  selectedId,
  guideKey = "name",
  toolbarEnd,
  empty,
}) {
  const { items: rows, status, error, reload, entering, query, setQuery, sort, setSort, page, pages, total, limit, setPage, setLimit } = list;
  const [range, setRange] = useState({ first: 0, last: 0 });
  const wrapRef = useRef(null);
  const sentinelRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const offset = (page - 1) * limit;

  // Sticky header lifts once the list scrolls under it.
  useEffect(() => {
    const wrap = wrapRef.current;
    const sentinel = sentinelRef.current;
    if (!wrap || !sentinel) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { root: wrap });
    io.observe(sentinel);
    return () => io.disconnect();
  }, [status]);

  // New page: back to the top of the scroller.
  useEffect(() => {
    if (wrapRef.current) wrapRef.current.scrollTop = 0;
  }, [page, limit]);

  // Guide words: the first and last record currently in view.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || status === "loading") return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const body = wrap.querySelector("tbody");
      if (!body) return;
      const box = wrap.getBoundingClientRect();
      const top = box.top + 70;
      const trs = body.children;
      let first = -1;
      let last = -1;
      for (let i = 0; i < trs.length; i++) {
        const r = trs[i].getBoundingClientRect();
        if (r.bottom > top && r.top < box.bottom) {
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
  }, [rows, status]);

  const guide = (row) => (row ? String(row[guideKey] ?? "") : " ");
  const firstRow = rows[range.first];
  const lastRow = rows[range.last];

  return (
    <div className="panel">
      <div className="toolbar">
        <label className="search">
          <span className="visually-hidden">{searchPlaceholder}</span>
          <Search aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} />
        </label>
        {filters && (
          <div className="chips" role="group" aria-label="סינון">
            {filters.map((f) => (
              <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => onFilterChange(f.id)}>
                {f.label} {counts?.[f.id] != null && <span className="num">{number(counts[f.id])}</span>}
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
              <button type="button" className="btn btn--ghost" onClick={reload}>
                נסה שוב
              </button>
            }
          />
        ) : (
          <>
            <div className="guide" aria-hidden="true">
              <span className="guide__word">{status !== "loading" && guide(firstRow)}</span>
              <span className="guide__range">
                {status === "loading"
                  ? "טוען…"
                  : rows.length
                    ? `שורות ${number(offset + range.first + 1)}–${number(offset + range.last + 1)} מתוך ${number(total)}`
                    : "אין תוצאות"}
              </span>
              <span className="guide__word">{status !== "loading" && range.last !== range.first && guide(lastRow)}</span>
            </div>
            <table className="table" data-enter={entering || undefined} aria-busy={status === "refreshing" || undefined}>
              <thead>
                <tr>
                  {columns.map((col) => {
                    const key = col.sortKey || col.key;
                    const active = col.sortable !== false && sort?.key === key;
                    return (
                      <th
                        key={col.key}
                        scope="col"
                        className={col.hideSm ? "hide-sm" : undefined}
                        aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
                      >
                        {col.sortable === false ? (
                          <span className="th-plain">{col.label}</span>
                        ) : (
                          <button type="button" className="th-btn" onClick={() => setSort(key)}>
                            {col.label}
                            {active ? sort.dir === 1 ? <ArrowDown /> : <ArrowUp /> : <ArrowUpDown />}
                          </button>
                        )}
                      </th>
                    );
                  })}
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
                  : rows.map((row, i) => (
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
            {status !== "loading" && rows.length === 0 &&
              (query ? (
                <Empty
                  title="לא נמצאו תוצאות"
                  text={`אין רשומות שמתאימות ל"${query}". נסו מילה אחרת או נקו את החיפוש.`}
                  action={
                    <button type="button" className="btn btn--ghost" onClick={() => setQuery("")}>
                      ניקוי חיפוש
                    </button>
                  }
                />
              ) : (
                empty
              ))}
          </>
        )}
      </div>

      {status !== "error" && (
        <Pager page={page} pages={pages} total={total} limit={limit} onPage={setPage} onLimit={setLimit} busy={status === "refreshing"} />
      )}
    </div>
  );
}
