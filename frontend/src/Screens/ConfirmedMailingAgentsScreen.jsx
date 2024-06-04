import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../components/Footer";

const ConfirmedMailingAgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const columns = ["name", "agentNumber", "email", "additionalMail"];
  const columnsHebrew = ["שם", "מספר סוכן", "דואר אלקטרוני", "מייל נוסף"];

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await axios.get("/api/agents/confirmed-mailing");
        setAgents(response.data);
      } catch (error) {
        console.error("There was a problem fetching the agents:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchAgents();
  }, []);

  const handleRowClick = () => {
    toast.warning('לשינוי שדות סוכן, עבור ללשונית "רשימת סוכנים".');
  };

  return (
    <div>
      <ToastContainer />
      <Header title="סוכנים ברשימת תפוצה" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            {isLoading ? (
              <Loader />
            ) : (
              <AgentsTable
                columns={columns}
                data={agents}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
            {!isLoading && (
              <h3 dir="rtl">סה״כ סוכנים ברשימת תפוצה:{agents.length}</h3>
            )}
          </Container>
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default ConfirmedMailingAgentsScreen;
