import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import UserMenu from '../components/UserMenu'
import ExcelDataDisplay from '../components/ExcelDataDisplay'
import Header from '../components/Header'

const SendMailScreen = () => {
  return (
    <>
    <Header title='שליחת סטטוסים'/>
    <Row>
        <Col md={2}>
            <UserMenu />
        </Col>
      <Col md={10}>
        <Container className="mt-5" dir="rtl">
            <h4>בחר קובץ אקסל להעלאה ולאחר מכן בחר אופציה לשליחה</h4>
           <ExcelDataDisplay />
        </Container>
      </Col>
    </Row>
    </>
  )
}

export default SendMailScreen