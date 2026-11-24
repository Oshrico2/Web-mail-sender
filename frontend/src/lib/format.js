const TZ = "Asia/Jerusalem";

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("he-IL", {
    timeZone: TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (value) =>
  new Date(value).toLocaleTimeString("he-IL", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatShortDate = (value = Date.now()) =>
  new Date(value).toLocaleDateString("en-GB", { timeZone: TZ }).replace(/\//g, "-");

export const dayKey = (value) =>
  new Date(value).toLocaleDateString("en-CA", { timeZone: TZ });

export const dayLabel = (value) => {
  const key = dayKey(value);
  const today = dayKey(Date.now());
  const yesterday = dayKey(Date.now() - 864e5);
  if (key === today) return "היום";
  if (key === yesterday) return "אתמול";
  return new Date(value).toLocaleDateString("he-IL", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const number = (n) => new Intl.NumberFormat("he-IL").format(n);

export const plural = (n, one, many) => (n === 1 ? one : `${number(n)} ${many}`);
export const customers = (n) => plural(n, "לקוח אחד", "לקוחות");

export const initials = (user) =>
  `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` || "?";

// Hebrew collation so "א" sorts before "ב" and numbers sort numerically.
export const collator = new Intl.Collator("he", { numeric: true, sensitivity: "base" });

export const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/["'׳״]/g, "")
    .trim();
