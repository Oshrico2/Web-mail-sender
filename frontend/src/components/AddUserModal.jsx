import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddUserModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData);
      await axios.post("/api/users/add", formData);
      await axios.post('/api/users-activity/add', {
        title:'הוספת משתמש',
        action: 'נוסף',
        entityName: formData.username,
        color:'green',
      });
      toast.success("המשתמש נוסף בהצלחה!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("שגיאה בהוספת המשתמש");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
        }}
        closeButton
      >
        <Modal.Title style={{ flexGrow: 1, textAlign: "right" }}>
          הוספת משתמש חדש
        </Modal.Title>
      </Modal.Header>
      <Modal.Body dir="rtl">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>
              <strong>שם משתמש:</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName" className="my-2">
                <Form.Label>
                  <strong>שם פרטי:</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName" className="my-2">
                <Form.Label>
                  <strong>שם משפחה:</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formEmail">
            <Form.Label>
              <strong>דואר אלקטרוני:</strong>
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>
              <strong>סיסמא:</strong>
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Modal.Footer dir="rtl">
            <Button variant="secondary" onClick={onHide}>
              סגירה
            </Button>
            <Button variant="success" type="submit">
              הוספה
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
      <ToastContainer rtl={true} />
    </Modal>
  );
};

export default AddUserModal;
