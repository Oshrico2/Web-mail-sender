import React, { useState } from "react";
import { Form, Button } from "rsuite";
import axios from "axios";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    const userData = { username: username, password: password };
    

    axios.post('http://localhost:4000/api/login', userData)
            .then(response => {
                console.log('Login successful:', response.data);
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <Form className="center my-5" dir="rtl">
        <Form.Control
          value={username}
          placeholder="שם משתמש"
          className="mb-2"
          onChange={(value) => setUsername(value)}
        ></Form.Control>
        <Form.Control
          value={password}
          placeholder="סיסמא"
          className="mb-2"
          onChange={(value) => setPassword(value)}
        ></Form.Control>
        <Button
          appearance="primary"
          style={{ width: "100%" }}
          onClick={handleClick}
        >
          התחבר
        </Button>
      </Form>
    </div>
  );
};

export default LoginScreen;
