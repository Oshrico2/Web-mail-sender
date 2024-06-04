import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import AgentsModal from "../components/AgentsModal";
import Header from "../components/Header";
import SearchBox from '../components/SearchBox'
import Loader from '../components/Loader';
import Footer from "../components/Footer";


const AgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const columns = ['name', 'agentNumber', 'email', 'additionalMail'];
  const columnsHebrew = ['שם', 'מספר סוכן', 'דואר אלקטרוני', 'מייל נוסף'];

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await axios.get('/api/agents');
        setAgents(response.data);
      } catch (error) {
        console.error('There was a problem fetching the agents:', error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchAgents();
  }, []);

  // Function to handle search by name
  const handleSearch = async (searchTerm) => {
    if(searchTerm === ''){
      const response = await axios.get(`/api/agents`);
      setAgents(response.data);
    }else{
      try {
        const response = await axios.get(`/api/agents/search/${searchTerm}`);
        setAgents(response.data);
      } catch (error) {
        console.error('There was a problem searching for agents:', error);
      }

    }
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(`/api/agents/${id}`);
      setSelectedAgent(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('There was a problem fetching the agent data:', error);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      await axios.delete(`/api/agents/${agentId}`);
      setAgents(prevAgents => prevAgents.filter(agent => agent._id !== agentId));
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAgent(null);
  };

  return (
    <div>
      <Header title='רשימת סוכנים'/>
    <Row>
      <Col md={2}>
        <UserMenu />
      </Col>
      <Col md={10}>
        <Container className="mt-5" dir="rtl">
          <SearchBox onSearch={handleSearch} searchFor={'שם'} />
          {isLoading ? <Loader /> : (
              <AgentsTable
                columns={columns}
                data={agents}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
            {!isLoading && (
              <h3 dir="rtl">סה״כ סוכנים:{agents.length}</h3>
            )}
        </Container>
        <AgentsModal
          show={showModal}
          onHide={handleCloseModal}
          agent={selectedAgent}
          onDelete={handleDeleteAgent}
        />
      </Col>
    </Row>
    <Footer />
    </div>
  );
};

export default AgentsScreen;
