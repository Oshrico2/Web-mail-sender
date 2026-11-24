import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportFromApi } from "../lib/excel";
import { errorMessage } from "../lib/api";
import { number } from "../lib/format";
import { useToast } from "./Toast";

/** Exports every row matching the current search/filter (not just this page). */
export default function ExportButton({ path, params, columns, fileName, disabled }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const count = await exportFromApi(path, params, columns, fileName);
      toast.success(`יוצאו ${number(count)} שורות לאקסל`);
    } catch (err) {
      toast.error(errorMessage(err, "הייצוא נכשל"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className="btn btn--ghost" disabled={disabled || busy} onClick={run}>
      {busy ? <Loader2 className="spin" /> : <Download />}
      {busy ? "מייצא…" : "ייצוא לאקסל"}
    </button>
  );
}
