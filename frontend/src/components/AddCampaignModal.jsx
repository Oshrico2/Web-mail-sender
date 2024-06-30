import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const AddCampaignModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    name: '',
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
      await axios.post('/api/campaigns/add', formData);
      await axios.post('/api/users-activity/add', {
        title: 'הוספת קמפיין',
        action:'נוסף',
        entityName: formData.name,
        color:'green'
      });
      toast.success('הקמפיין נוסף בהצלחה!');
      setTimeout(() => {
        window.location.reload();
    }, 1000);
    } catch (error) {
      console.error('Error adding campaign:', error);
      toast.error('הוספת הקמפיין נכשלה אנא בדוק את השדות');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>הוספת קמפיין חדש</Modal.Title>
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
          <Modal.Footer dir="rtl">
            <Button variant="secondary" onClick={onHide}>סגירה</Button>
            <Button variant="success" type="submit">הוספה</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
      <ToastContainer rtl={true}/>
    </Modal>
  );
};

export default AddCampaignModal;
