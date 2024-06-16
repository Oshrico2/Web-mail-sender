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

const BusinessManagerReportScreen = () => {
  const [jsonData, setJsonData] = useState([]);
  const [fixedJsonData, setFixedJsonData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '-' });
      formatDates(json)
      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClick = async () => {
    try {
    setIsLoading(true);
      const response = await axios.post('/api/business-managers/report/create', { jsonData });
      setFixedJsonData(response.data);
    } catch (error) {
      console.error(error);
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="דוח למנהלי פיתוח עסקי" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <h4>בחר קובץ אקסל להעלאה</h4>
            <input type="file" onChange={handleFileChange} className="me-2 my-4" />
            {!isLoading && jsonData.length > 0 && fixedJsonData.length === 0 && (
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
                        {Object.values(row).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            {isLoading?<Loader /> : (fixedJsonData && Array.isArray(fixedJsonData) && fixedJsonData.length > 0 && (
                <div>
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
                        {Object.values(row).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <ExportToXlsx jsonData={fixedJsonData} fileName={`דוח מנהלי פיתוח עסקי - ${getCurrentDateFormatted()}`}/>
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
