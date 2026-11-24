import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "./api";

// Loads a list once and keeps it in sync locally after create/update/delete,
// instead of reloading the whole page after every change.
export function useResource(path) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const firstLoad = useRef(true);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data } = await api.get(path);
      setItems(data);
      setStatus("ready");
    } catch (err) {
      setError(errorMessage(err, "טעינת הנתונים נכשלה"));
      setStatus("error");
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback((item) => {
    setItems((prev) => {
      const index = prev.findIndex((p) => p._id === item._id);
      if (index === -1) return [item, ...prev];
      const next = prev.slice();
      next[index] = item;
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const entering = status === "ready" && firstLoad.current;
  useEffect(() => {
    if (status === "ready") {
      const t = setTimeout(() => {
        firstLoad.current = false;
      }, 800);
      return () => clearTimeout(t);
    }
  }, [status]);

  return { items, status, error, reload: load, upsert, remove, entering };
}
