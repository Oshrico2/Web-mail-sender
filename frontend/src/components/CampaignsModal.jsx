import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrashIcon from "@rsuite/icons/legacy/Trash";
import axios from "axios";

const CampaignsModal = ({ show, onHide, campaign, onDelete }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || "",
      });
    }
  }, [campaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/campaigns/${campaign._id}`);
      onDelete(campaign._id);
      toast.success("הקמפיין נמחק בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("יש בעיה במחיקת הקמפיין");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/campaigns/${campaign._id}`,
        formData
      );
      toast.success("פרטי הקמפיין עודכנו בהצלחה");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("יש בעיה בעדכון פרטי הקמפיין");
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
            עריכה/מחיקה של קמפיין{" "}
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
            <Button variant="danger" onClick={handleDelete}>
              מחק קמפיין <TrashIcon />
            </Button>
            <Button variant="primary" type="submit" className="mx-2">
              שמור
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer rtl={true}/>
    </>
  );
};

export default CampaignsModal;
