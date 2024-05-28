import React, { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import AddEmployeeModal from '../components/AddEmployeeModal';
import UserMenu from '../components/UserMenu';
import Header from '../components/Header';

const AddEmployeeScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Header title='הוספת עובד חדש' />
    <Row>
        <Col md={2}>
            <UserMenu />
        </Col>
      <Col md={10}>
        <Container className="mt-5" dir="rtl">
          <Button variant="primary" onClick={handleModalShow}>הוסף עובד חדש</Button>
          <AddEmployeeModal show={showModal} onHide={handleModalClose} />
        </Container>
      </Col>
    </Row>
    </div>
  );
};

export default AddEmployeeScreen;