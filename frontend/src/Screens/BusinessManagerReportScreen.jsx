import React, { useState } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import UserMenu from '../components/UserMenu';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import * as XLSX from 'xlsx';
import axios from 'axios';
import ExportToXlsx from '../components/ExportToXlsxBtn';
import { formatDates, getCurrentDateFormatted } from '../utils/scripts';
import PieChartManagers from '../components/PieChartManagers';
import {toast,ToastContainer} from 'react-toastify'

const BusinessManagerReportScreen = () => {
  const [jsonData, setJsonData] = useState([]);
  const [fixedJsonData, setFixedJsonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noFindAgents, setNoFindAgents] = useState([]);

  const handleFileChange = (e) => {
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: '-' });
          formatDates(json);
          setJsonData(json);
        } catch (error) {
          toast.error('Error processing file.');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
  
      reader.onerror = (error) => {
        toast.error('Error reading file.');
        console.error(error);
        setIsLoading(false);
      };
  
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error('Error handling file.');
      console.error(error);
      setIsLoading(false);
    }
  };
  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/business-managers/report/create', { jsonData });
      setFixedJsonData(response.data.filteredData);
      setNoFindAgents(response.data.noAgentInDataList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <ToastContainer rtl={true}/>
      <Header title="דוח למנהלי פיתוח עסקי" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <h4>בחר קובץ אקסל להעלאה</h4>
            <input type="file" onChange={handleFileChange} className="me-2 my-4" />
            {isLoading? <Loader text={'נא המתן לטעינת הקובץ...'}/> : jsonData.length > 0 && fixedJsonData.length === 0 && (
              <div className="table table-responsive mt-4" style={{ overflowY: 'auto', height: '40vh' }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {Object.keys(jsonData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jsonData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {isLoading ? <Loader /> : (fixedJsonData.length > 0 && (
              <div>
                {noFindAgents && noFindAgents.length > 0 && (
                  <div>
                <h5>סוכנים שלא נמצאו:</h5>
                <ul>
                  {noFindAgents.map((noFindAgent, index) => (
                    <li key={index}>{noFindAgent}</li>
                  ))}
                </ul>
                </div>
                )}
                <div className="table table-responsive mt-4" style={{ overflowY: 'auto', height: '40vh' }}>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        {Object.keys(fixedJsonData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fixedJsonData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <ExportToXlsx jsonData={fixedJsonData} fileName={`דוח מנהלי פיתוח עסקי - ${getCurrentDateFormatted()}`} />
                <PieChartManagers data={fixedJsonData} />
              </div>
            ))}
            {jsonData.length > 0 && !isLoading && fixedJsonData.length === 0 && (
              <Button onClick={handleClick}>ייצר דוח</Button>
            )}
          </Container>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default BusinessManagerReportScreen;
