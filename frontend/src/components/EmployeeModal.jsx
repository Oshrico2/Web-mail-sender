import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import axios from "axios";
import { formatDate } from "../utils/scripts";

const EmployeesModal = ({ show, onHide, employee, onDelete }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject:"",
    createdAt:"",
    createdBy:"",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        subject: employee.subject || "",
        createdAt: employee.createdAt || "",
        createdBy: employee.createdBy || "",

      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/employees/${employee._id}`);
      onDelete(employee._id);
      toast.success("העובד נמחק בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("יש בעיה במחיקת העובד");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/employees/${employee._id}`,
        formData
      );
      toast.success("פרטי העובד עודכנו בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("יש בעיה בעדכון פרטי העובד");
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
            עריכה/מחיקה של עובד{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body dir="rtl">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="my-2">
              <Form.Label>
                <strong>שם:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
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
            <Form.Group controlId="formSubject" className="my-2">
              <Form.Label>
                <strong>תחום:</strong>
              </Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="danger" onClick={handleDelete}>
              מחק עובד <TrashIcon />
            </Button>
            <Button variant="primary" type="submit" className="mx-2">
              שמור
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <label dir="rtl">
            נוצר על ידי {formData.createdBy}, בתאריך{" "}
            {formatDate(formData.createdAt)}
            {employee?.updatedAt && (
              <>
                <br />
                עודכן לאחרונה על ידי {employee.updatedBy}, בתאריך{" "}
                {formatDate(employee.updatedAt)}
              </>
            )}
          </label>
        </Modal.Footer>
      </Modal>
      <ToastContainer rtl={true}/>
    </>
  );
};

export default EmployeesModal;
