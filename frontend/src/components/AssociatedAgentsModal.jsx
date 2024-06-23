import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Loader from './Loader';
import SearchBox from "./SearchBox";

const AssociatedAgentsModal = ({ show, onHide, businessManager }) => {
  const [agents, setAgents] = useState([]);
  const [searchedAgents, setSearchedAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);  // Start loading
      try {
        const response = await axios.get(`/api/agents/`);
        const agentsFound = response.data;
        const filteredAgents = agentsFound.filter(agent =>
          agent.lastName && businessManager.lettersOfLastNamesUnderCare.includes(agent.lastName.charAt(0))
        );
        setAgents(filteredAgents);
        setSearchedAgents(filteredAgents); // Initialize searchedAgents with all agents
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);  // Loading is complete
      }
    };

    if (businessManager && show) {
      fetchAgents();
    }
  }, [businessManager, show]);

  const handleSearch = (searchTerm) => {
    const filteredAgents = agents.filter(agent =>
      agent.name.includes(searchTerm)
    );
    setSearchedAgents(filteredAgents);
  };

  return (
    <Modal show={show} onHide={onHide} dir='rtl'>
      <Modal.Header dir="rtl" closeButton>
        <Modal.Title style={{ flexGrow: 1, textAlign: "right" }}>סוכנים משויכים ({agents.length})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchBox onSearch={handleSearch} searchFor={'שם'} />
        {isLoading ? (
          <Loader />
        ) : (
          searchedAgents.length > 0 ? (
            <ListGroup className="mt-2" style={{maxHeight:'60vh', overflowY:'auto'}}>
              {searchedAgents.map((agent) => (
                <ListGroup.Item key={agent._id}>{agent.name}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>לא נמצאו סוכנים משויכים</p>
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          סגור
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssociatedAgentsModal;
