import {
  Row,
  Col,
  Container,
  ButtonGroup,
  Button,
  Table,
} from "react-bootstrap";
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
  const [agentConfirmedMailing, setAgentConfirmedMailing] = useState(true);

  const columns = ["name", "agentNumber", "email", "additionalMail"];
  const columnsHebrew = ["שם", "מספר סוכן", "דואר אלקטרוני", "מייל נוסף"];

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await axios.get("/api/agents");
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

  const handleClick1 = () => {
    setAgentConfirmedMailing(true);
  };

  const handleClick2 = () => {
    setAgentConfirmedMailing(false);
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
              <div>
                <ButtonGroup>
                  <Button
                    className="rounded-0 rounded-end-4"
                    variant="success"
                    onClick={handleClick1}
                  >
                    מקבל דיוור
                  </Button>
                  <Button
                    className="rounded-0 rounded-start-4"
                    variant="danger"
                    onClick={handleClick2}
                  >
                    לא מקבל דיוור
                  </Button>
                </ButtonGroup>
                <AgentsTable
                  columns={columns}
                  data={
                    agentConfirmedMailing
                      ? agents.filter(
                          (agent) => agent.confirmedMailing === true
                        )
                      : agents.filter(
                          (agent) => agent.confirmedMailing === false
                        )
                  }
                  columnsHebrew={columnsHebrew}
                  onRowClick={handleRowClick}
                />
              </div>
            )}
            {!isLoading && (
              <div className="info-agents">
                <Table>
                  <tr>
                    <th>סה״כ</th>
                    <th>מקבלים דיוור</th>
                    <th>לא מקבלים דיוור</th>
                  </tr>
                  <tr>
                    <td>{agents.length}</td>
                    <td>
                      {
                        agents.filter(
                          (agent) => agent.confirmedMailing === true
                        ).length
                      }
                    </td>
                    <td>
                      {
                        agents.filter(
                          (agent) => agent.confirmedMailing === false
                        ).length
                      }
                    </td>
                  </tr>
                </Table>
              </div>
            )}
          </Container>
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default ConfirmedMailingAgentsScreen;
