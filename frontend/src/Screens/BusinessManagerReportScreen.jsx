import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import * as XLSX from "xlsx";
import axios from "axios";
import ExportToXlsx from "../components/ExportToXlsxBtn";
import { formatDates, getCurrentDateFormatted } from "../utils/scripts";
import PieChartManagers from "../components/PieChartManagers";
import { toast, ToastContainer } from "react-toastify";

const BusinessManagerReportScreen = () => {
  const [jsonData, setJsonData] = useState(null); // Initialize as null
  const [fixedJsonData, setFixedJsonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noFindAgents, setNoFindAgents] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFileChange = (e) => {
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "-" });
          formatDates(json);
          setJsonData(json);
        } catch (error) {
          toast.error("Error processing file.");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      reader.onerror = (error) => {
        toast.error("Error reading file.");
        console.error(error);
        setIsLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error("Error handling file.");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const handleConfirmReport = async (email) => {
    try {
      setShowConfirmationModal(false);
      setIsLoading(true);
      const response = await axios.post(
        "/api/business-managers/report/create",
        { jsonData, email } 
      );
      await axios.post('/api/users-activity/add', {
        title:'דוח למנהלי פיתוח עסקי',
        action: 'דוח למנהלי פיתוח עסקי נשלח',
        color:'blue',
        entityName: getCurrentDateFormatted(Date.Now)
      });
      setFixedJsonData(response.data.filteredData);
      setNoFindAgents(response.data.noAgentInDataList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if(isChecked){
        toast.success('מייל נשלח בהצלחה.')
      }
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false); // Properly close modal
  };

  return (
    <>
      <ToastContainer rtl={true} />
      <Header title="דוח למנהלי פיתוח עסקי" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <h4>בחר קובץ אקסל להעלאה</h4>
            <input
              type="file"
              onChange={handleFileChange}
              className="me-2 my-4"
            />
            {isLoading && !jsonData ? (
              <Loader text={"נא המתן לטעינת הקובץ..."} />
            ) : (
              jsonData &&
              jsonData.length > 0 &&
              fixedJsonData.length === 0 && (
                <div
                  className="table table-responsive mt-4"
                  style={{ overflowY: "auto", height: "40vh" }}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        {Object.keys(jsonData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jsonData.slice(0, 20).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )
            )}
            {isLoading && jsonData && jsonData.length > 0 ? (
              <Loader text={"מכין את הדוח..."} />
            ) : (
              fixedJsonData.length > 0 && (
                <div>
                  {noFindAgents && noFindAgents.length > 0 && (
                    <div>
                      <h5 className="mb-2">
                        סוכנים שלא נמצאו ({noFindAgents.length}):
                      </h5>
                      <ul style={{ maxHeight: "10vh", overflowY: "auto" }}>
                        {noFindAgents.map((noFindAgent, index) => (
                          <li key={index}>{noFindAgent}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div
                    className="table table-responsive mt-4"
                    style={{ overflowY: "auto", height: "40vh" }}
                  >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          {Object.keys(fixedJsonData[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fixedJsonData.slice(0, 20).map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <ExportToXlsx
                    jsonData={fixedJsonData}
                    fileName={`דוח מנהלי פיתוח עסקי - ${getCurrentDateFormatted()}`}
                  />
                  <PieChartManagers data={fixedJsonData} />
                </div>
              )
            )}
            {jsonData &&
              jsonData.length > 0 &&
              !isLoading &&
              fixedJsonData.length === 0 && (
                <Button onClick={handleClick}>ייצר דוח</Button>
              )}
          </Container>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal
        dir="rtl"
        show={showConfirmationModal}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: "right" }}>
            באפשרותך לקבל דוח בסיום
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Check
              id="mailCheckBox"
              type="switch"
              onChange={handleCheckBoxChange}
              checked={isChecked}
              label="לחץ לשליחת פרטי דוח במייל"
            />
            {isChecked && (
              <Form.Control
              className="mt-2"
                placeholder="הזן מייל"
                type="email"
                value={userEmail}
                id="emailToSend"
                name="emailToSendReport"
              />
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              const emailInput = document.getElementById("emailToSend");
              const emailValue = isChecked && emailInput ? emailInput.value : "";

              handleConfirmReport(emailValue);
            }}
          >
            אישור
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default BusinessManagerReportScreen;
