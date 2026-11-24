import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// Native <dialog>: focus trap, Escape, inert background and top-layer for free.
function useNativeDialog(open, onClose) {
  const ref = useRef(null);
  // Keep the content rendered while the exit transition plays.
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleCancel = (event) => {
      event.preventDefault();
      onClose?.();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  const onBackdrop = (event) => {
    if (event.target === ref.current) onClose?.();
  };

  return { ref, onBackdrop, mounted: open || mounted };
}

// Record panel that slides in from the far edge while the workspace recedes.
export function Sheet({ open, onClose, title, subtitle, children, footer, busy }) {
  const { ref, onBackdrop, mounted } = useNativeDialog(open, busy ? undefined : onClose);
  return (
    <dialog ref={ref} className="sheet" onMouseDown={onBackdrop} aria-label={title}>
      {mounted && (
        <>
          <header className="sheet__head">
            <div>
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="סגירה" disabled={busy}>
              <X />
            </button>
          </header>
          <div className="sheet__body">{children}</div>
          {footer && <footer className="sheet__foot">{footer}</footer>}
        </>
      )}
    </dialog>
  );
}

export function Modal({ open, onClose, title, children, footer, busy, role = "dialog" }) {
  const { ref, onBackdrop, mounted } = useNativeDialog(open, busy ? undefined : onClose);
  return (
    <dialog ref={ref} className="modal" onMouseDown={onBackdrop} role={role} aria-label={title}>
      {mounted && (
        <>
          <header className="modal__head">
            <h2>{title}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="סגירה" disabled={busy}>
              <X />
            </button>
          </header>
          <div className="modal__body">{children}</div>
          {footer && <footer className="modal__foot">{footer}</footer>}
        </>
      )}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "אישור",
  tone = "primary",
  busy,
  onConfirm,
  onClose,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      busy={busy}
      role="alertdialog"
      footer={
        <>
          <button
            type="button"
            className={`btn ${tone === "danger" ? "btn--danger-solid" : "btn--primary"}`}
            onClick={onConfirm}
            disabled={busy}
            autoFocus
          >
            {confirmLabel}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
            ביטול
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
