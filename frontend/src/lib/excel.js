import { formatShortDate } from "./format";

// xlsx is ~400KB; load it only on the screens that read or export a sheet.
const loadXlsx = () => import("xlsx");

const EXCEL_EPOCH = 25569; // days between 1900-01-01 (Excel) and 1970-01-01
const DATE_COLUMNS = ["תאריך שינוי", "תאריך יצירה"];

const excelDate = (serial) => {
  const date = new Date((serial - EXCEL_EPOCH) * 864e5);
  return date.toLocaleDateString("he-IL", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const ACCEPT = ".xlsx,.xls,.csv";

// Reads the first sheet of an Excel/CSV file into row objects. Date serials in
// the known date columns become dd.mm.yyyy strings (as before).
export async function readSheet(file) {
  const XLSX = await loadXlsx();
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("לא נמצא גיליון בקובץ");
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "-" });
  for (const row of rows) {
    for (const column of DATE_COLUMNS) {
      if (typeof row[column] === "number") row[column] = excelDate(row[column]);
    }
  }
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return { rows, columns };
}

// Exports rows to an .xlsx file; `columns` maps a field to its Hebrew header
// so internal fields (_id, __v, passwords…) never leak into the file.
export async function exportSheet(rows, columns, fileName) {
  const XLSX = await loadXlsx();
  const data = rows.map((row) => {
    const out = {};
    for (const col of columns) {
      const raw = col.exportValue ? col.exportValue(row) : row[col.key];
      out[col.label] = Array.isArray(raw)
        ? raw.join(", ")
        : typeof raw === "boolean"
          ? raw
            ? "כן"
            : "לא"
          : (raw ?? "");
    }
    return out;
  });
  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  workbook.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(workbook, sheet, "גיליון1");
  XLSX.writeFile(workbook, `${fileName} ${formatShortDate()}.xlsx`);
}
