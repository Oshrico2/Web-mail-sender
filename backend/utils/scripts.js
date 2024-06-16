import xlsx from "xlsx";
import dotenv from 'dotenv'
import Agent from "../models/agentModel.js";
import Employee from "../models/employeeModel.js";
import Campaigns from "../models/campaignModel.js"
import BusinessManager from "../models/businessManagerModel.js";
dotenv.config();

const readExcelFile = () => {
  try {
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
  } catch (error) {
    // Handle the error
    console.error("Error reading Excel file:", error);
    // Optionally, you can throw the error again to propagate it
    throw error;
  }
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

// const getAgentsFromDB = async () => {
//   const response = await axios.get("/api/agents");
//   return response.data;
// };

const fetchAgents= async () => {
  try {
    const agents = await Agent.find({}).sort({ name: 1 }); // 1 for ascending order
    return agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const fetchCampaigns = async () => {
  try {
    const campaigns = await Campaigns.find({}).sort({ name: 1 }); // 1 for ascending order
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// const getEmployeesFromDB = async () => {
//   const response = await axios.get("/api/employees");
//   return response.data;
// };

const fetchEmployees = async () => {
  try {
    const employees = await Employee.find({}).sort({ name: 1 }); // 1 for ascending order
    return employees
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const fetchBusinessManagers = async () => {
  try {
    const businessManagers = await BusinessManager.find({}).sort({ name: 1 }); // 1 for ascending order
    return businessManagers
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server Error" });
  }
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


// Function to remove fields from each object
const removeFields = (data, fieldsToRemove) => {
  return data.map(obj => {
    fieldsToRemove.forEach(field => delete obj[field]);
    return obj;
  });
};

export {
  readExcelFile,
  getCurrentDateFormatted,
  formatDates,
  removeUnwantedColumns,
  // getAgentsFromDB,
  // getEmployeesFromDB,
  fetchAgents,
  fetchEmployees,
  replaceKeysInArray,
  fetchCampaigns,
  fetchBusinessManagers,
  removeFields
};
