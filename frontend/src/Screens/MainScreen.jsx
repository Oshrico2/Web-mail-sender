import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainScreen = () => {
  return (
    <>
      <Header title="מסך ראשי" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <h1>מערכת לשליחת מיילים לסוכנים</h1>
            <h4>
              ברוכים הבאים!
              <br />
              כאן תוכלו לשלוח מיילים לסוכנים
            </h4>
            <div className="d-flex justify-content-center">
              <img
                className="img-fluid mt-5"
                src="/images/logo.jpg"
                alt="tlp-logo"
                style={{ height: "400px", width: "400px" }}
              />
            </div>
          </Container>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default MainScreen;
