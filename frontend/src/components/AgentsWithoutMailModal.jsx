import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const AgentsWithoutMailModal = ({ show, onHide, agents }) => {
  return (
    <Modal show={show} onHide={onHide}>
 <Modal.Header className='text-bg-success' style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }} closeButton>
          <Modal.Title style={{ flexGrow: 1, textAlign: 'right' }}>השליחה הסתיימה בהצלחה</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <h3 dir='rtl'>רשימת סוכנים שלא קיבלו מייל:</h3>
      <ListGroup dir='rtl'>
        {agents.map(agent => (
          <ListGroup.Item key={agent.name}>{agent.name}</ListGroup.Item>
        ))}
      </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgentsWithoutMailModal;
