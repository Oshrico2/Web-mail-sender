import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Which record the side panel shows. `?new=1` (old "/x/add" links) opens it
// empty. The record survives closing so the panel can slide out intact.
export function useSheetState() {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (params.get("new")) {
      setRecord(null);
      setOpen(true);
      const next = new URLSearchParams(params);
      next.delete("new");
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  const openNew = useCallback(() => {
    setRecord(null);
    setOpen(true);
  }, []);
  const openRecord = useCallback((r) => {
    setRecord(r);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return { open, record, openNew, openRecord, close, selectedId: open ? record?._id : undefined };
}
