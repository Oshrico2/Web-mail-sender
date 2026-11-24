import { escapeRegex } from "./http.js";

export const PAGE_SIZES = [25, 50, 100, 200];
export const MAX_LIMIT = 500; // the Excel export walks pages of this size
const DEFAULT_LIMIT = 50;

// Hebrew-aware ordering (א before ב, numbers numerically).
const COLLATION = { locale: "he", numericOrdering: true, strength: 2 };

const clampInt = (value, fallback, min, max) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

/**
 * Reads ?page=&limit=&sort=&q= from the request.
 * sort is "field" (asc) or "-field" (desc) and must be whitelisted.
 */
export function readListParams(req, { sortable, defaultSort, searchFields = [] }) {
  const limit = clampInt(req.query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const page = clampInt(req.query.page, 1, 1, 1e6);

  const rawSort = String(req.query.sort || defaultSort);
  const desc = rawSort.startsWith("-");
  const field = desc ? rawSort.slice(1) : rawSort;
  const sortField = sortable.includes(field) ? field : defaultSort.replace(/^-/, "");
  const sortDir = sortable.includes(field) ? (desc ? -1 : 1) : defaultSort.startsWith("-") ? -1 : 1;
  // _id as a tie-breaker keeps page boundaries stable.
  const sort = { [sortField]: sortDir, _id: sortDir };

  const q = String(req.query.q || "").trim().slice(0, 100);
  const search =
    q && searchFields.length
      ? { $or: searchFields.map((f) => ({ [f]: { $regex: escapeRegex(q), $options: "i" } })) }
      : null;

  return { page, limit, sort, search, q };
}

export const and = (...parts) => {
  const filters = parts.filter((p) => p && Object.keys(p).length);
  if (!filters.length) return {};
  return filters.length === 1 ? filters[0] : { $and: filters };
};

/** Runs one page query and its count in parallel. */
export async function paginate(Model, filter, { page, limit, sort, select }) {
  const query = Model.find(filter)
    .collation(COLLATION)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
  if (select) query.select(select);
  const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);
  const pages = Math.max(Math.ceil(total / limit), 1);
  return { items, total, page, limit, pages };
}
