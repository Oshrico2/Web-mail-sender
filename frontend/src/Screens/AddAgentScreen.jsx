import React, { useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import AddAgentModal from '../components/AddAgentModal';
import UserMenu from '../components/UserMenu';
import Header from '../components/Header';

const AddAgentScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Header title='הוספת סוכן חדש' />
    <Row>
        <Col md={2}>
            <UserMenu />
        </Col>
      <Col md={10}>
        <Container className="mt-5" dir="rtl">
          <Button variant="primary" onClick={handleModalShow}>הוסף סוכן חדש</Button>
          <AddAgentModal show={showModal} onHide={handleModalClose} />
        </Container>
      </Col>
    </Row>
    </div>
  );
};

export default AddAgentScreen;
