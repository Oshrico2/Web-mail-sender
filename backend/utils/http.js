// Small HTTP helpers shared by every route.

// Express 4 does not catch rejected promises from async handlers; an uncaught
// rejection crashes the whole Node process. Wrap every async handler with this.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (value) => EMAIL_RE.test(String(value || "").trim());

// Minimal in-memory rate limiter (single instance deployment).
export const rateLimit = ({ windowMs, max, message }) => {
  const hits = new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.reset < now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, reset: now + windowMs };
    if (entry.reset < now) {
      entry.count = 0;
      entry.reset = now + windowMs;
    }
    entry.count += 1;
    hits.set(key, entry);
    if (entry.count > max) {
      return res.status(429).json({ message });
    }
    next();
  };
};

export const notFound = (req, res) => {
  res.status(404).json({ message: "הנתיב לא נמצא" });
};

// Central error handler: maps Mongoose errors to clear HTTP responses.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const labels = { name: "שם", email: "דואר אלקטרוני", username: "שם משתמש" };
    return res
      .status(409)
      .json({ message: `${labels[field] || field} כבר קיים במערכת`, field });
  }
  if (err?.name === "CastError") {
    return res.status(404).json({ message: "הרשומה לא נמצאה" });
  }
  if (err?.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "הקובץ גדול מדי" });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: status >= 500 ? "שגיאת שרת" : err.message });
};
