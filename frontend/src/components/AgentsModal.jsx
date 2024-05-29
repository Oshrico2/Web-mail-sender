import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TrashIcon from '@rsuite/icons/legacy/Trash'; 
import axios from 'axios';

const AgentsModal = ({ show, onHide, agent, onDelete }) => {
  const [formData, setFormData] = useState({
    name: '',
    agentNumber: '',
    email: '',
    additionalMail: '',
    weeklyStatus: false
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        agentNumber: agent.agentNumber || '',
        email: agent.email || '',
        additionalMail: agent.additionalMail || '',
        weeklyStatus: agent.weeklyStatus || false
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/agents/${agent._id}`);
      onDelete(agent._id);
      toast.success('הסוכן נמחק בהצלחה');
      setTimeout(() => {
        window.location.reload();
    }, 1000);
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('יש בעיה במחיקת הסוכן');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/agents/${agent._id}`, formData);
      toast.success('פרטי הסוכן עודכנו בהצלחה');
      setTimeout(() => {
        window.location.reload();
    }, 1000);
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('יש בעיה בעדכון פרטי הסוכן');
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>עריכה/מחיקה של סוכן </Modal.Title>
        </Modal.Header>
        <Modal.Body dir="rtl">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="my-2">
              <Form.Label><strong>שם:</strong></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAgentNumber" className="my-2">
              <Form.Label><strong>מספר סוכן:</strong></Form.Label>
              <Form.Control
                type="text"
                name="agentNumber"
                value={formData.agentNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="my-2">
              <Form.Label><strong>דואר אלקטרוני:</strong></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAdditionalMail" className="my-2">
              <Form.Label><strong>מייל נוסף:</strong></Form.Label>
              <Form.Control
                type="email"
                name="additionalMail"
                value={formData.additionalMail}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formWeeklyStatus" className="my-2">
              <Form.Check
                type="switch"
                label={<strong>הסוכן רוצה לקבל סטטוס פעם בשבוע:</strong>}
                name="weeklyStatus"
                checked={formData.weeklyStatus}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="danger" onClick={handleDelete}>מחק סוכן <TrashIcon /></Button>
            <Button variant="primary" type="submit" className="mx-2">שמור</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default AgentsModal;
