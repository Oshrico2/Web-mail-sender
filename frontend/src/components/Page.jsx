import { useEffect } from "react";
import { number } from "../lib/format";

export function Page({ title, description, actions, children }) {
  useEffect(() => {
    document.title = `${title} · תלפיות`;
  }, [title]);
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="page-head__actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

/**
 * The ribbon window: one strip of counts. Panes with an `id` act as filters.
 * panes: [{ id?, label, value, tone? }]
 */
export function Ribbon({ panes, active, onSelect, loading }) {
  return (
    <div className="ribbon" role={onSelect ? "group" : undefined} aria-label="סיכום">
      {panes.map((pane) => {
        const content = (
          <>
            <span className="ribbon__label">{pane.label}</span>
            <span className="ribbon__value">{loading ? "—" : number(pane.value)}</span>
          </>
        );
        const cls = `ribbon__pane${pane.tone ? ` ribbon__pane--${pane.tone}` : ""}`;
        return onSelect && pane.id ? (
          <button
            key={pane.label}
            type="button"
            className={cls}
            aria-pressed={active === pane.id}
            onClick={() => onSelect(pane.id)}
          >
            {content}
          </button>
        ) : (
          <div key={pane.label} className={cls}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
