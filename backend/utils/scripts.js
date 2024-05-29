import xlsx from "xlsx";
import axios from "axios";
import dotenv from 'dotenv'
dotenv.config();

const readExcelFile = () => {
  const workbook = xlsx.readFile(process.env.FILE_URL);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Get the range of the worksheet
  const range = xlsx.utils.decode_range(worksheet['!ref']);
  const headers = {};

  // Identify headers and initialize them with 'none'
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: C });
    const header = worksheet[cellAddress] ? worksheet[cellAddress].v : '-';
    headers[header] = 'none';
  }

  const data = [];

  // Loop through each row
  for (let R = range.s.r + 1; R <= range.e.r; R++) {
    const rowData = { ...headers }; // Initialize each row with 'none' values

    // Loop through each cell in the row
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = xlsx.utils.encode_cell({ r: R, c: C });
      const cellValue = worksheet[cellAddress] ? worksheet[cellAddress].v : '-';
      const columnHeader = worksheet[xlsx.utils.encode_cell({ r: range.s.r, c: C })].v;
      rowData[columnHeader] = cellValue;
    }

    data.push(rowData);
  }

  return data;
};

const getCurrentDateFormatted = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDates = (data) => {
  for (const item of data) {
    if(item['תאריך שינוי']){
      const milliseconds1 = (item["תאריך שינוי"] - 25569) * 86400 * 1000;
      const date1 = new Date(milliseconds1);
      
      item["תאריך שינוי"] = date1.toLocaleDateString("he-IL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    const milliseconds2 = (item["תאריך יצירה"] - 25569) * 86400 * 1000;
    const date2 = new Date(milliseconds2);
    item["תאריך יצירה"] = date2.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
};

const removeUnwantedColumns = (data) => {
  const columnsToRemove = ["טלפון 1", "מייל נוסף", "מייל של סוכן","סלולרי לקוח"];
  const wsData = xlsx.utils.sheet_to_json(data, { header: 1 });
  const headers = wsData[0];
  const indicesToRemove = headers
    .map((header, index) => (columnsToRemove.includes(header) ? index : -1))
    .filter((index) => index !== -1);

  const filteredWsData = wsData.map((row) =>
    row.filter((_, colIndex) => !indicesToRemove.includes(colIndex))
  );
  return xlsx.utils.aoa_to_sheet(filteredWsData);
};

const getAgentsFromDB = async () => {
  const response = await axios.get("/api/agents");
  return response.data;
};

const getEmployeesFromDB = async () => {
  const response = await axios.get("/api/employees");
  return response.data;
};

const replaceKeysInArray = (array, keyMap) => {
  return array.map((obj) => {
    const replaced = {};
    for (let key in obj) {
      if (keyMap.hasOwnProperty(key)) {
        replaced[keyMap[key]] = obj[key];
      } else {
        replaced[key] = obj[key];
      }
    }
    return replaced;
  });
};

export {
  readExcelFile,
  getCurrentDateFormatted,
  formatDates,
  removeUnwantedColumns,
  getAgentsFromDB,
  getEmployeesFromDB,
  replaceKeysInArray,
};
