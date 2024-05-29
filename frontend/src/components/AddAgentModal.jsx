import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AddAgentModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    name: '',
    agentNumber: '',
    email: '',
    additionalMail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/agents/add', formData);
      toast.success('הסוכן נוסף בהצלחה!');
      setTimeout(() => {
        window.location.reload();
    }, 1000);
    } catch (error) {
      console.error('Error adding agent:', error);
      toast.error('Failed to add agent');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>הוספת סוכן חדש</Modal.Title>
      </Modal.Header>
      <Modal.Body dir="rtl">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label><strong>שם:</strong></Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAgentNumber">
            <Form.Label><strong>מספר סוכן:</strong></Form.Label>
            <Form.Control
              type="text"
              name="agentNumber"
              value={formData.agentNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label><strong>דואר אלקטרוני:</strong></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAdditionalMail">
            <Form.Label><strong>מייל נוסף:</strong></Form.Label>
            <Form.Control
              type="email"
              name="additionalMail"
              value={formData.additionalMail}
              onChange={handleChange}
            />
          </Form.Group>
          <Modal.Footer dir="rtl">
            <Button variant="secondary" onClick={onHide}>סגירה</Button>
            <Button variant="success" type="submit">הוספה</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  );
};

export default AddAgentModal;
