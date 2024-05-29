import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import Header from "../components/Header";
import { ToastContainer,toast } from "react-toastify";

const WeeklyAgentsScreen = () => {
  const [agents, setAgents] = useState([]);

  const columns = ["name", "agentNumber", "email", "additionalMail"];
  const columnsHebrew = ["שם", "מספר סוכן", "דואר אלקטרוני", "מייל נוסף"];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/agents/per-week");
        setAgents(response.data);
      } catch (error) {
        console.error("There was a problem fetching the agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const handleRowClick = () => {
    toast.warning('לשינוי שדות סוכן, עבור ללשונית "רשימת סוכנים".');
  }

  return (
    <>
    <ToastContainer />
    <Header title='סוכנים שמקבלים סטטוס שבועי'/>
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10} dir='rtl'>
        <Container className="mt-5" dir="rtl">
          <AgentsTable
            columns={columns}
            data={agents}
            columnsHebrew={columnsHebrew}
            onRowClick={handleRowClick}

          />
        </Container>
          </Col>
      </Row>
      </>
  );
};

export default WeeklyAgentsScreen;
