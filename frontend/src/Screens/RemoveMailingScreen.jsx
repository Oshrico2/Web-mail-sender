import React, { useState } from 'react';
import Header from '../components/Header';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import axios from 'axios';

const RemoveMailingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true);
    const email = e.target.email.value;

    try {
      const response = await axios.get(`/api/agents`);
      const agents = response.data;
      const agent = agents.find(agent => agent.email === email);
      const response2 = await axios.put(`/api/agents/${agent._id}`,{confirmedMailing:false});
      console.log(response2);
      toast.success('נשלח בהצלחה');
    } catch (error) {
      console.error(error);
      toast.error('מייל זה לא קיים במערכת'); // Show an error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir='rtl'>
    <ToastContainer />
      <Header title={'הסרה מדיוור'} />
      <h3 className='my-3 me-4'>להסרה מדיוור תלפיות הכנס פרטים ולחץ על שליחה</h3>
      <Row className='justify-content-center mt-5'>
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 rounded-3">
              <Form.Label>אימייל להסרה מדיוור</Form.Label>
              <Form.Control name='email' type='email' required />
            </Form.Group>
            {isLoading ? <Loader text={'אנא המתן לסיום'} /> : (
              <Button className='rounded-3' style={{ width: '100%' }} type="submit">שליחה</Button>
            )}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default RemoveMailingScreen;
