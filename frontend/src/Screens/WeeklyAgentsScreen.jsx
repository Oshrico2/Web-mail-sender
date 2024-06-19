import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../components/Footer";

const WeeklyAgentsScreen = () => {
  const [weeklyStatusAgents, setWeeklyStatusAgents] = useState([]);
  const [noStatusAgents, setNoStatusAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const columns = ["name", "agentNumber", "email", "additionalMail"];
  const columnsHebrew = ["שם", "מספר סוכן", "דואר אלקטרוני", "מייל נוסף"];

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response1 = await axios.get("/api/agents/per-week");
        const response2 = await axios.get("/api/agents/no-customer-status");
        setWeeklyStatusAgents(response1.data);
        setNoStatusAgents(response2.data);
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
    <>
      <ToastContainer rtl={true} />
      <Header title="סוכנים שמקבלים סטטוס שבועי" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10} dir="rtl">
          <Container className="mt-5" dir="rtl">
            {isLoading ? (
              <Loader />
            ) : (
              <Row>
                <Col md={6}>
                  <h4>סוכנים בסטטוס שבועי ({weeklyStatusAgents.length}):</h4>
                  <AgentsTable
                    columns={columns}
                    data={weeklyStatusAgents}
                    columnsHebrew={columnsHebrew}
                    onRowClick={handleRowClick}
                  />
                </Col>
                <Col md={6}>
                  <h4>סוכנים שלא מקבלים סטטוס ({noStatusAgents.length}):</h4>
                  <AgentsTable
                    columns={columns}
                    data={noStatusAgents}
                    columnsHebrew={columnsHebrew}
                    onRowClick={handleRowClick}
                  />
                </Col>
              </Row>
            )}
          </Container>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default WeeklyAgentsScreen;
