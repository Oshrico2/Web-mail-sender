import React, { useState } from "react";
import * as XLSX from "xlsx"; // Import all named exports as XLSX
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios"; // Import Axios
import Loader from "./Loader";

const ExcelDataDisplay = () => {
  const [excelData, setExcelData] = useState(null);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleDailyStatus = () => {
    setIsLoading(true); // Activate loader

    axios
      .post("http://localhost:4000/api/programs/general", {
        weeklyStatus: false,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
    setShow(false);
  };

  const handleWeeklyStatus = () => {
    setIsLoading(true); // Activate loader

    axios
      .post("http://localhost:4000/api/programs/general", {
        weeklyStatus: true,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
    setShow(false);
  };

  const handleBriutStatus = () => {
    setIsLoading(true); // Activate loader

    axios
      .post("http://localhost:4000/api/programs/other-services", {
        weeklyStatus: "בריאות",
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
  };

  const handlePensiaStatus = () => {
    setIsLoading(true); // Activate loader

    axios
      .post("http://localhost:4000/api/programs/other-services", {
        weeklyStatus: "פנסיה",
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
  };

  const handleFileChange = (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();

const reader = new FileReader();
reader.onload = (e) => {
  const data = new Uint8Array(e.target.result);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Get the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const jsonData = [];
  
  // Iterate through all rows and columns in the range
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const row = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { r: R, c: C };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];
      let value = cell ? cell.v : ''; 
      row.push(value);
    }
    jsonData.push(row);
  }

  setExcelData(jsonData);

      formData.append("xlsx", file);
      axios
        .post("http://localhost:4000/api/upload", formData)
        .then((response) => {
          console.log(response.data);
          // Handle success response here
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error here
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} className="me-2 my-4" />
      {isLoading ? ( // Render Loader if isLoading is true
        <Loader />
      ) : (
        <div>
          {excelData && (
            <div
              className="table table-responsive mt-4"
              style={{ overflowY: "auto", height: "40vh" }}
            >
              <Table striped bordered hover>
                <thead>
                  <tr>
                    {excelData[0].map((cell, index) => (
                      <th key={index}>{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                          {cell !== undefined ? cell : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {excelData && (
            <div>
              <h3>בחר תוכנית להפעלה:</h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button className="mx-5 btn-options" onClick={handleShow}>
                  כללי
                </Button>
                <Button
                  onClick={handleBriutStatus}
                  className="mx-5 btn-options"
                >
                  בריאות
                </Button>
                <Button
                  onClick={handlePensiaStatus}
                  className="mx-5 btn-options"
                >
                  פנסיוני
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "row-reverse",
                    }}
                    closeButton
                  >
                    <Modal.Title style={{ flexGrow: 1, textAlign: "right" }}>
                      סטטוס לקוחות כללי
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body dir="rtl">איזה סטטוס לקוחות תעדיף?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDailyStatus}>
                      סטטוס יומי
                    </Button>
                    <Button variant="info" onClick={handleWeeklyStatus}>
                      סטטוס שבועי
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelDataDisplay;
