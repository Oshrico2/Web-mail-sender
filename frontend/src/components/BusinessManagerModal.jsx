import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import axios from "axios";

const BusinessManagersModal = ({ show, onHide, businessManager, onDelete }) => {
  const hebrewAlphabet = [
    "א",
    "ב",
    "ג",
    "ד",
    "ה",
    "ו",
    "ז",
    "ח",
    "ט",
    "י",
    "כ",
    "ל",
    "מ",
    "נ",
    "ס",
    "ע",
    "פ",
    "צ",
    "ק",
    "ר",
    "ש",
    "ת",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    lettersOfLastNamesUnderCare: [],
  });

  useEffect(() => {
    if (businessManager) {
      setFormData({
        name: businessManager.name || "",
        email: businessManager.email || "",
        lettersOfLastNamesUnderCare: businessManager.lettersOfLastNamesUnderCare || [],
      });
    }
  }, [businessManager]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedLetters = checked
        ? [...prevState.lettersOfLastNamesUnderCare, value]
        : prevState.lettersOfLastNamesUnderCare.filter((letter) => letter !== value);

      return {
        ...prevState,
        lettersOfLastNamesUnderCare: updatedLetters,
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

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/business-managers/${businessManager._id}`);
      onDelete(businessManager._id);
      toast.success("המנהל נמחק בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting businessManager:", error);
      toast.error("יש בעיה במחיקת המנהל");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingManagers = await getAllAgents();
      const conflict = existingManagers.some((manager) => 
        manager._id !== businessManager._id && 
        manager.lettersOfLastNamesUnderCare.some((letter) => 
          formData.lettersOfLastNamesUnderCare.includes(letter)
        )
      );

      if (conflict) {
        toast.error('יש כבר מנהל אחר עם אותיות תחת טיפול זהות');
        return;
      }
      await axios.put(
        `/api/business-managers/${businessManager._id}`,
        formData
      );
      toast.success("פרטי המנהל עודכנו בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating businessManager:", error);
      toast.error("יש בעיה בעדכון פרטי המנהל");
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
            עריכה/מחיקה של מנהל{" "}
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
            <Form.Group controlId="formLetters">
              <Form.Label>
                <strong>אותיות של שמות משפחה תחת טיפול:</strong>
              </Form.Label>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {hebrewAlphabet.map((letter) => (
                  <Form.Check
                    key={letter}
                    type="checkbox"
                    label={letter}
                    value={letter}
                    checked={formData.lettersOfLastNamesUnderCare.includes(letter)}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: "10px" }}
                  />
                ))}
              </div>
            </Form.Group>
            <Button variant="danger" onClick={handleDelete}>
              מחק מנהל <TrashIcon />
            </Button>
            <Button variant="primary" type="submit" className="mx-2">
              שמור
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer rtl={true} />
    </>
  );
};

export default BusinessManagersModal;
