import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import axios from "axios";
import { formatDate } from "../utils/scripts";

const UsersModal = ({ show, onHide, user, onDelete }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    createdAt: "",
    createdBy: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: user.password || "",
        createdAt: user.createdAt || "",
        createdBy: user.createdBy || "",
        isAdmin: user.isAdmin !== undefined ? user.isAdmin : false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/${user._id}`);
      onDelete(user._id);
      toast.success("המשתמש נמחק בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("יש בעיה במחיקת המשתמש");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${user._id}`, formData);
      toast.success("פרטי המשתמש עודכנו בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("יש בעיה בעדכון פרטי המשתמש");
    }
  };

  return (
    <>
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
            עריכה/מחיקה של משתמש{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body dir="rtl">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName" className="my-2">
              <Form.Label>
                <strong>שם:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
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
            <Form.Group controlId="formUsername" className="my-2">
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
            
            <Form.Group controlId="formEmail" className="my-2">
              <Form.Label>
                <strong>דואר אלקטרוני:</strong>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formIsAdmin" className="my-2">
              <Form.Check
                type="switch"
                label={<strong>הרשאות אדמין</strong>}
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="danger" onClick={handleDelete}>
              מחק משתמש <TrashIcon />
            </Button>
            <Button variant="primary" type="submit" className="mx-2">
              שמור
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer dir="rtl">
          <label>
            נוצר על ידי {formData.createdBy}, בתאריך{" "}
            {formatDate(formData.createdAt)}
          </label>
        </Modal.Footer>
      </Modal>
      <ToastContainer rtl={true} />
    </>
  );
};

export default UsersModal;
