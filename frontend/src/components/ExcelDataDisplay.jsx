import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Loader from "./Loader";
import { formatDates } from "../utils/scripts";
import {toast,ToastContainer} from 'react-toastify';
import AgentsWithoutMailModal from "./AgentsWithoutMailModal";

const ExcelDataDisplay = () => {
  const [jsonData, setJsonData] = useState([]);
  const [noMailAgents,setNoMailAgents] = useState([]);

  const [show, setShow] = useState(false);
  const [showModalNoAgents, setShowModalNoAgents] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleDailyStatus = async () => {
    setIsLoading(true); // Activate loader

    await axios
      .post("/api/programs/general", {
        weeklyStatus: false,
        data:jsonData,
      })
      .then((response) => {
        setNoMailAgents(response.data);
      })
      .catch((err) => {
        toast.error('שגיאה בשליחת הקובץ - אנא בדוק שהפורמט מתאים');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
    setShow(false);
  };

  const handleWeeklyStatus = async () => {
    setIsLoading(true); // Activate loader

    await axios
      .post("/api/programs/general", {
        weeklyStatus: true,
        data:jsonData,
      })
      .then((response) => {
        console.log(response);
        setNoMailAgents(response.data);
      })
      .catch((err) => {
        toast.error('שגיאה בשליחת הקובץ - אנא בדוק שהפורמט מתאים');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
    setShow(false);
  };

  const handleBriutStatus = async () => {
    setIsLoading(true); // Activate loader

    await axios
      .post("/api/programs/other-services", {
        weeklyStatus: "בריאות",
        data:jsonData
      })
      .then((response) => {
        console.log(response);
        setNoMailAgents(response.data);
      })
      .catch((err) => {
        toast.error('שגיאה בשליחת הקובץ - אנא בדוק שהפורמט מתאים');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
  };

  const handlePensiaStatus = async () => {
    setIsLoading(true); // Activate loader

    await axios
      .post("/api/programs/other-services", {
        weeklyStatus: "פנסיה",
        data:jsonData
      })
      .then((response) => {
        console.log(response);
        setNoMailAgents(response.data);
      })
      .catch((err) => {
        toast.error('שגיאה בשליחת הקובץ - אנא בדוק שהפורמט מתאים');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "-" });
      formatDates(json);
      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
    console.log(jsonData);
  };

  return (
    <div>
      <ToastContainer rtl={true}/>
      <input type="file" onChange={handleFileChange} className="me-2 my-4" />
      {isLoading ? (
        <div>
        <h4 dir="rtl">המערכת שולחת את הדוח, אין לצאת עד לסיום</h4>
        <Loader />
        </div>
      ) : (
        <div>
          {noMailAgents.length > 0 ? (
            <div>
              <AgentsWithoutMailModal
                show={showModalNoAgents}
                onHide={() => setShowModalNoAgents(false)}
                agents={noMailAgents}
              />
            </div>
          ) : (
            <div>
              {jsonData && (
                <div
                  className="table table-responsive mt-4"
                  style={{ overflowY: "auto", height: "40vh" }}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        {jsonData.length > 0 &&
                          Object.keys(jsonData[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jsonData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, index) => (
                            <td key={index}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              {jsonData && jsonData.length > 0 && (
                <div>
                  <h3>בחר תוכנית להפעלה:</h3>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button className="mx-5 btn-options" onClick={handleShow}>
                      כללי
                    </Button>
                    <Button onClick={handleBriutStatus} className="mx-5 btn-options">
                      בריאות
                    </Button>
                    <Button onClick={handlePensiaStatus} className="mx-5 btn-options">
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
      )}
    </div>
  );
  
};

export default ExcelDataDisplay;
