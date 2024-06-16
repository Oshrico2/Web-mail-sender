import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const hebrewAlphabet = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

const AddBusinessManagerModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lettersOfLastNamesUnderCare: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const updatedLetters = checked
        ? [...prevState.lettersOfLastNamesUnderCare, value]
        : prevState.lettersOfLastNamesUnderCare.filter(letter => letter !== value);

      return {
        ...prevState,
        lettersOfLastNamesUnderCare: updatedLetters
      };
    });
  };

  const getAllAgents = async () => {
    try {
      const response = await axios.get('/api/business-managers');
      return response.data;
    } catch (error) {
      console.error('Error fetching business managers:', error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingManagers = await getAllAgents();
      const conflict = existingManagers.some(manager =>
        manager.lettersOfLastNamesUnderCare.some(letter =>
          formData.lettersOfLastNamesUnderCare.includes(letter)
        )
      );

      if (conflict) {
        toast.error('יש כבר מנהל אחר עם אותיות תחת טיפול זהות');
        return;
      }

      await axios.post('/api/business-managers/add', formData);
      toast.success('המנהל נוסף בהצלחה!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error adding Business Manager:', error);
      toast.error('הוספת המנהל נכשלה אנא בדוק את השדות');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
        <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>הוספת מנהל פיתוח עסקי חדש</Modal.Title>
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
              required
            />
          </Form.Group>
          <Form.Group controlId="formLetters">
            <Form.Label><strong>אותיות של שמות משפחה תחת טיפול:</strong></Form.Label>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {hebrewAlphabet.map(letter => (
                <Form.Check
                  key={letter}
                  type="checkbox"
                  label={letter}
                  value={letter}
                  onChange={handleCheckboxChange}
                  style={{ marginRight: '10px' }}
                />
              ))}
            </div>
          </Form.Group>
          <Modal.Footer dir="rtl">
            <Button variant="secondary" onClick={onHide}>סגירה</Button>
            <Button variant="success" type="submit">הוספה</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
      <ToastContainer rtl={true} />
    </Modal>
  );
};

export default AddBusinessManagerModal;
