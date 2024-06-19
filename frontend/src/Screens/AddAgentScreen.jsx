import React, { useEffect, useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import AddAgentModal from "../components/AddAgentModal";
import UserMenu from "../components/UserMenu";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgentsTable from "../components/AgentsTable";
import axios from "axios";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";

const AddAgentScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentlyAddedAgents, setRecentlyAddedAgents] = useState([]);
  const columns = ["name", "agentNumber", "email", "additionalMail"];
  const columnsHebrew = ["שם", "מספר סוכן", "דואר אלקטרוני", "מייל נוסף"];

  useEffect(() => {
    const fetchRecentlyAddedAgents = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await axios.get("/api/agents/recently-added");
        setRecentlyAddedAgents(response.data);
      } catch (error) {
        console.error("There was a problem fetching the agents:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchRecentlyAddedAgents();
  }, []);

  const handleRowClick = () => {
    toast.warning("לשינוי שדות סוכן עבור ל״רשימת סוכנים״.");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  return (
    <div>
      <Header title="הוספת סוכן חדש" />
      <ToastContainer rtl={true} />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <Button variant="primary" onClick={handleModalShow}>
              הוסף סוכן חדש
            </Button>
            <AddAgentModal show={showModal} onHide={handleModalClose} />
            {isLoading ? (
              <Loader />
            ) : (
              <div>
                <h4 className="mt-4">סוכנים שנוספו לאחרונה: </h4>
                <AgentsTable
                  columns={columns}
                  columnsHebrew={columnsHebrew}
                  data={recentlyAddedAgents}
                  onRowClick={handleRowClick}
                />
              </div>
            )}
          </Container>
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default AddAgentScreen;
