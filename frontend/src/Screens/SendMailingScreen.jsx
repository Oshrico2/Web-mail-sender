import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/Header";
import { Row, Col, Form, Button } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import axios from "axios";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";

const SendMailingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const attachment = event.target.attachment.files[0];

    const formData = new FormData();
    formData.append("title", event.target.title.value);
    formData.append("content", content);
    if (attachment) {
      formData.append(
        "attachment",
        attachment,
        encodeURIComponent(attachment.name)
      );
    }

    setIsLoading(true);
    try {
      await axios
      .post("/api/mailing", formData, {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8",
        },
      })
      toast.success("השליחה הסתיימה בהצלחה");
    } catch (error) {
      toast.error("בעייה בשליחת המייל");
      console.error(error);
    }finally{
      setIsLoading(false); // Deactivate loader after request is completed

    }
  
  };

  return (
    <div>
      <ToastContainer />
      <Header title="שליחת הודעת תפוצה" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <h4 className="my-4 me-4" dir="rtl">
            במסך זה ניתן לשלוח מייל תפוצה לכל הסוכנים, יש לבחור נושא קובץ מצורף
            ותוכן.
          </h4>
          <div className="d-flex justify-content-center mt-5">
            <div
              className="mailing-form mt-5"
              style={{ maxWidth: "800px", width: "100%" }}
            >
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={3}>
                    <Form.Group dir="rtl" className="my-2">
                      <input
                        className="rounded-4"
                        type="file"
                        name="attachment"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={9}>
                    <Form.Group dir="rtl" className="my-2">
                      <Form.Control
                        className="rounded-3"
                        placeholder="נושא המייל"
                        type="text"
                        name="title"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="my-2">
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="תוכן המייל"
          theme="snow"
          style={{ height: "300px" }}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline"],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["link"], // Add the link button to the toolbar
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "list",
            "bullet",
            "bold",
            "italic",
            "underline",
            "indent",
            "align",
            "color",
            "background",
            "link", // Add support for the link format
          ]}
        />
        <Button
          type="submit"
          className="mt-5 rounded-3"
          style={{ width: "100%" }}
        >
          שליחת תפוצה
        </Button>
      </Form.Group>


              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {isLoading && (
        <div>
          <Loader text={"אנא המתן בעת שליחת התפוצה"} />
        </div>
      )}
    </div>
  );
};

export default SendMailingScreen;
