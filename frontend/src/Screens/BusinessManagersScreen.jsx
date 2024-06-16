import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import Header from "../components/Header";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import BusinessManagersModal from "../components/BusinessManagerModal";

const BusinessManagersScreen = () => {
  const [businessManagers, setBusinessManagers] = useState([]);
  const [selectedBusinessManager, setSelectedBusinessManager] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const columns = ["name", "email","lettersOfLastNamesUnderCare"];
  const columnsHebrew = ["שם", "דואר אלקטרוני","שמות משפחה בטיפול"];

  useEffect(() => {
    const fetchBusinessManagers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/business-managers");
        setBusinessManagers(response.data);
      } catch (error) {
        console.error("There was a problem fetching the business Managers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessManagers();
  }, []);

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(
        `/api/business-managers/${id}`
      );
      setSelectedBusinessManager(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("There was a problem fetching the business Manager data:", error);
    }
  };

  const handleDeleteBusinessManager = async (businessManagerId) => {
    try {
      await axios.delete(`/api/business-managers/${businessManagerId}`);
      setBusinessManagers((prevBusinessManagers) =>
        prevBusinessManagers.filter((businessManager) => businessManager._id !== businessManagerId)
      );
    } catch (error) {
      console.error("Error deleting business Manager:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBusinessManager(null);
  };

  return (
    <div>
      <Header title="רשימת מנהלי פיתוח עסקי" />
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
                data={businessManagers}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
          </Container>
          <BusinessManagersModal
            show={showModal}
            onHide={handleCloseModal}
            businessManager={selectedBusinessManager}
            onDelete={handleDeleteBusinessManager}
          />
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default BusinessManagersScreen;
