import React, { useState, useRef } from "react";
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
  const quillRef = useRef(null); // Reference for the Quill editor

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the value of the hidden input to determine which button was pressed
    const buttonPressed = event.target.buttonPressed.value;
    let isTest = false;
    buttonPressed === 'sendMailing' ? isTest = false : isTest = true;

    const attachment = event.target.attachment.files[0];
    const formData = new FormData();

    formData.append("title", event.target.title.value);
    formData.append("content", content);
    if (attachment) {
      formData.append("attachment", attachment, encodeURIComponent(attachment.name));
    }

    setIsLoading(true);
    try {
      await axios.post("/api/mailing", {formData:formData,isTest:isTest},{
        headers: {
          "Content-Type": "multipart/form-data; charset=utf-8",
        },
      });
      toast.success("השליחה הסתיימה בהצלחה");
    } catch (error) {
      toast.error("בעייה בשליחת המייל");
      console.error(error);
    } finally {
      setIsLoading(false); // Deactivate loader after request is completed
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["image"], // Add image toolbar button
      ["clean"],
    ],
  };

  const formats = [
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
    "link",
    "image", // Add support for image format
  ];

  const handleEditorChange = (value) => {
    setContent(value);
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
  
      // Ensure new images inserted also conform to the default styles
      quill.root.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '30%';
        img.style.height = 'auto';
      });
      quill.format('align', 'right');  // Set text alignment to right
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
          <h4 className="mt-4 me-4" dir="rtl">
            במסך זה ניתן לשלוח מייל תפוצה לכל הסוכנים, יש לבחור נושא קובץ מצורף
            ותוכן.
          </h4>
          <p className="fs-6 fw-bold mt-2 me-4" dir='rtl'>באפשרותך לבצע בדיקה למייל ספציפי טרם השליחה.</p>
          <div className="d-flex justify-content-center mt-5">
            <div className="mailing-form mt-5" style={{ maxWidth: "800px", width: "100%" }}>
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
                    ref={quillRef} // Attach the ref to the ReactQuill component
                    value={content}
                    onChange={handleEditorChange}
                    placeholder="תוכן המייל"
                    theme="snow"
                    style={{ height: "300px" }}
                    modules={modules}
                    formats={formats}
                  />
                  <Button
                    type="submit"
                    className="mt-5 rounded-3"
                    style={{ width: "100%" }}
                    name="sendMailing"
                    onClick={() => document.getElementById('buttonPressed').value = 'sendMailing'}
                  >
                    שליחת תפוצה
                  </Button>
                </Form.Group>
                <Form.Group dir="rtl" style={{height:'40px'}} controlId="testButton" className="my-2  d-flex">
                  <Form.Control className="rounded-0 rounded-end-3" style={{width:'600px'}} placeholder="המייל אליו תשלח הבדיקה" />
                  <Button
                    type="submit"
                    name="testButton"
                    variant="success"
                    style={{width:'200px'}}
                    onClick={() => document.getElementById('buttonPressed').value = 'testButton'}
                  >
                    בצע בדיקה
                  </Button>
                </Form.Group>
                <input type="hidden" id="buttonPressed" name="buttonPressed" value="" />
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
