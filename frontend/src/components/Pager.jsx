import { useId } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PAGE_SIZES } from "../lib/usePagedList";
import { number } from "../lib/format";

// Page numbers around the current one, with gaps: 1 … 4 5 [6] 7 8 … 20
const windowed = (page, pages) => {
  const out = [];
  const from = Math.max(1, page - 2);
  const to = Math.min(pages, page + 2);
  if (from > 1) out.push(1);
  if (from > 2) out.push("…start");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < pages - 1) out.push("…end");
  if (to < pages) out.push(pages);
  return out;
};

export default function Pager({ page, pages, total, limit, onPage, onLimit, compact, busy }) {
  const id = useId();
  const from = total ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);

  return (
    <nav className={`pager${compact ? " pager--compact" : ""}`} aria-label="דפדוף" aria-busy={busy || undefined}>
      <span className="pager__range">
        {total ? `${number(from)}–${number(to)} מתוך ${number(total)}` : "אין תוצאות"}
      </span>

      {pages > 1 && (
        <div className="pager__pages">
          {!compact && (
            <button type="button" className="pager__btn" onClick={() => onPage(1)} disabled={page === 1} aria-label="עמוד ראשון">
              <ChevronsRight />
            </button>
          )}
          <button type="button" className="pager__btn" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="העמוד הקודם">
            <ChevronRight />
          </button>
          {!compact &&
            windowed(page, pages).map((p) =>
              typeof p === "number" ? (
                <button
                  key={p}
                  type="button"
                  className="pager__btn pager__num"
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => onPage(p)}
                >
                  {number(p)}
                </button>
              ) : (
                <span key={p} className="pager__gap" aria-hidden="true">
                  …
                </span>
              )
            )}
          {compact && (
            <span className="pager__range">
              {number(page)} / {number(pages)}
            </span>
          )}
          <button type="button" className="pager__btn" onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="העמוד הבא">
            <ChevronLeft />
          </button>
          {!compact && (
            <button type="button" className="pager__btn" onClick={() => onPage(pages)} disabled={page === pages} aria-label="עמוד אחרון">
              <ChevronsLeft />
            </button>
          )}
        </div>
      )}

      {onLimit && (
        <label className="pager__size" htmlFor={id}>
          שורות בעמוד
          <select id={id} className="input pager__select" value={limit} onChange={(e) => onLimit(Number(e.target.value))}>
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
    </nav>
  );
}
