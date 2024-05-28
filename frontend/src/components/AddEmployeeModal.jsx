import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AddEmployeeModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: ''
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
      await axios.post('http://localhost:4000/api/employees/add', formData);
      toast.success('העובד נוסף בהצלחה!');
      setTimeout(() => {
        window.location.reload();
    }, 1000);
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('הוספת העובד נכשלה אנא בדוק את השדות');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>הוספת עובד חדש</Modal.Title>
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
          <Form.Group controlId="formEmail">
            <Form.Label><strong>דואר אלקטרוני:</strong></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label><strong>תחום:</strong></Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
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

export default AddEmployeeModal;
