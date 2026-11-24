import { useCallback, useEffect, useRef, useState } from "react";
import { api, errorMessage } from "./api";

export const PAGE_SIZES = [25, 50, 100, 200];
const DEFAULT_LIMIT = 50;

export function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

const readLimit = (key) => {
  const saved = Number(localStorage.getItem(`pageSize:${key}`));
  return PAGE_SIZES.includes(saved) ? saved : DEFAULT_LIMIT;
};

/**
 * One page of a server list. Search, filters and sort run in the database;
 * the browser only ever holds the current page.
 * The page size the user picks is remembered per list.
 */
export function usePagedList(path, { initialSort, params = {}, storageKey = path, pageSize } = {}) {
  const [limit, setLimitState] = useState(() => pageSize || readLimit(storageKey));
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState(initialSort);
  const [query, setQueryState] = useState("");
  const q = useDebounced(query.trim());
  const [data, setData] = useState({ items: [], total: 0, pages: 1 });
  const [status, setStatus] = useState("loading"); // loading | refreshing | ready | error
  const [error, setError] = useState("");
  const [entering, setEntering] = useState(false);
  const firstLoad = useRef(true);
  const requestId = useRef(0);
  const paramsKey = JSON.stringify(params);

  // Any change to what is being asked for starts again from page 1, decided
  // during render so only one request goes out.
  const criteria = JSON.stringify([q, paramsKey, limit, sort]);
  const [lastCriteria, setLastCriteria] = useState(criteria);
  if (criteria !== lastCriteria) {
    setLastCriteria(criteria);
    setPage(1);
  }

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setStatus((s) => (s === "loading" || firstLoad.current ? "loading" : "refreshing"));
    try {
      const { data: result } = await api.get(path, {
        params: {
          page,
          limit,
          q: q || undefined,
          sort: sort ? `${sort.dir < 0 ? "-" : ""}${sort.key}` : undefined,
          ...JSON.parse(paramsKey),
        },
      });
      if (id !== requestId.current) return; // a newer request already answered
      // Deleting the last row of the last page: step back a page.
      if (result.items.length === 0 && result.total > 0 && page > result.pages) {
        setPage(result.pages);
        return;
      }
      setData(result);
      setStatus("ready");
      if (firstLoad.current) {
        firstLoad.current = false;
        setEntering(true);
        setTimeout(() => setEntering(false), 800);
      }
    } catch (err) {
      if (id !== requestId.current) return;
      setError(errorMessage(err, "טעינת הנתונים נכשלה"));
      setStatus("error");
    }
  }, [path, page, limit, q, sort, paramsKey]);

  useEffect(() => {
    load();
  }, [load]);

  const setLimit = useCallback(
    (value) => {
      localStorage.setItem(`pageSize:${storageKey}`, String(value));
      setLimitState(value);
    },
    [storageKey]
  );

  const setSort = useCallback((key) => {
    setSortState((s) => (s?.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));
  }, []);

  return {
    items: data.items,
    total: data.total,
    pages: data.pages,
    page,
    limit,
    sort,
    query,
    status,
    error,
    entering,
    setPage,
    setLimit,
    setSort,
    setQuery: setQueryState,
    reload: load,
  };
}

/** Small JSON endpoint (counts, owners, subjects) with a reload handle. */
export function useJson(path) {
  const [data, setData] = useState(null);
  const load = useCallback(() => {
    api
      .get(path)
      .then(({ data: d }) => setData(d))
      .catch(() => setData((prev) => prev));
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return [data, load];
}
