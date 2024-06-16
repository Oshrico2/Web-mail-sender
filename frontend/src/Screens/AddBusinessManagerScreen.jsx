import React, { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import AddBusinessManagerModal from '../components/AddBusinessManagerModal';
import UserMenu from '../components/UserMenu';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AddBusinessManagerScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Header title='הוספת מנהל פיתוח עסקי חדש' />
    <Row>
        <Col md={2}>
            <UserMenu />
        </Col>
      <Col md={10}>
        <Container className="mt-5" dir="rtl">
          <Button variant="primary" onClick={handleModalShow}>הוסף מנהל פיתוח עסקי חדש</Button>
          <AddBusinessManagerModal show={showModal} onHide={handleModalClose} />
        </Container>
      </Col>
    </Row>
    <Footer />
    </div>
  );
};

export default AddBusinessManagerScreen;