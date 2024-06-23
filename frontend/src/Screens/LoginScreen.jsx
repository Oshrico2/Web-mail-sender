import React, { useState } from "react";
import { Form, Button } from "rsuite";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import Footer from "../components/Footer";
import Header from "../components/Header";

const LoginScreen = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    const userData = { username: username, password: password };

    axios.post('/api/login', userData)
    .then(response => {
        const { token, expiration, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expiration);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setTimeout(() => {
            toast.success('התחברת בהצלחה!');
            // window.location.href = '/';
        }, 1000);
    })
    .catch(error => {
        toast.error('שם משתמש או סיסמא לא נכונים');
        console.error('Error logging in:', error);
        setError('Invalid credentials');
    });
};

  return (
    <>
    <Header title={'ברוכים הבאים'} />
    <div className="background-container"
      style={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >

      <Form className="center mb-5" dir="rtl">
        <Form.Control
          value={username}
          placeholder="שם משתמש"
          className="mb-2 form-control"
          onChange={(value) => setUsername(value)}
        ></Form.Control>
        <Form.Control
          value={password}
          type="password"
          placeholder="סיסמא"
          className="mb-2 form-control"
          onChange={(value) => setPassword(value)}
        ></Form.Control>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button
        type="submit"
          appearance="primary"
          style={{ width: "100%" }}
          onClick={handleClick}
        >
          התחבר
        </Button>
      </Form>
    </div>
    <ToastContainer rtl={true}/>
      <Footer />
      </>
  );
};

export default LoginScreen;
