import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CircleCheck, CircleAlert, Info, X } from "lucide-react";

const ToastContext = createContext(null);
const ICONS = { success: CircleCheck, error: CircleAlert, info: Info };
const LEAVE_MS = 200;

// One toast region for the whole app (the old screens mounted a
// ToastContainer per modal, so messages appeared twice).
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), LEAVE_MS);
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    (type, message, ms = type === "error" ? 6000 : 3500) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list.slice(-3), { id, type, message }]);
      timers.current.set(id, setTimeout(() => dismiss(id), ms));
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="region" aria-label="הודעות">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`toast toast--${t.type}`}
              role={t.type === "error" ? "alert" : "status"}
              data-leaving={t.leaving || undefined}
            >
              <Icon aria-hidden="true" />
              <p>{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="סגירה">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
