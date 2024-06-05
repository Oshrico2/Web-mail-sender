import React, { useState } from "react";
import Header from "../components/Header";
import { Row, Col, Form, Button } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import axios from "axios";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";

const SendMailingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const attachment = event.target.attachment.files[0];

    const formData = new FormData();
    formData.append("title", event.target.title.value);
    formData.append("content", event.target.content.value);
    if(attachment){
        formData.append(
          "attachment",
          attachment,
          encodeURIComponent(attachment.name)
        );
    }

    setIsLoading(true);
    await axios
      .post("/api/mailing", formData, {
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        toast.error("בעייה בשליחת המייל");
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // Deactivate loader after request is completed
        toast.success('השליחה הסתיימה בהצלחה')
      });
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
              dir="rtl"
            >
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={3}>
                    <Form.Group className="my-2">
                      <input
                        className="rounded-4"
                        type="file"
                        name="attachment"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={9}>
                    <Form.Group className="my-2">
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
                  <Form.Control
                    className="rounded-3"
                    placeholder="תוכן המייל"
                    as="textarea"
                    rows={5}
                    type="text"
                    name="content"
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="mt-2 rounded-3"
                  style={{ width: "100%" }}
                >
                  שליחת תפוצה
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {isLoading && (
        <div>
          <Loader text={'אנא המתן בעת שליחת התפוצה'}/>
        </div>
      ) }
    </div>
  );
};

export default SendMailingScreen;
