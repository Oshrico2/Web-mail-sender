import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import CampaignsModal from "../components/CampaignsModal";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import ExportToXlsx from "../components/ExportToXlsxBtn";

const CampaignsScreen = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const columns = ["name"];
  const columnsHebrew = ["שם"];

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await axios.get("/api/campaigns");
        setCampaigns(response.data);
      } catch (error) {
        console.error("There was a problem fetching the campaigns:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchCampaigns();
  }, []);

  // Function to handle search by name
  const handleSearch = async (searchTerm) => {
    if (searchTerm === "") {
      const response = await axios.get(`/api/campaigns`);
      setCampaigns(response.data);
    } else {
      try {
        const response = await axios.get(`/api/campaigns/search/${searchTerm}`);
        setCampaigns(response.data);
      } catch (error) {
        console.error("There was a problem searching for campaigns:", error);
      }
    }
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(`/api/campaigns/${id}`);
      setSelectedCampaign(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("There was a problem fetching the campaign data:", error);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await axios.delete(`/api/campaigns/${campaignId}`);
      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign._id !== campaignId)
      );
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
  };

  return (
    <div>
      <Header title="רשימת קמפיינים/ועדים" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <SearchBox onSearch={handleSearch} searchFor={"שם"} />
            {isLoading ? (
              <Loader />
            ) : (
              <AgentsTable
                columns={columns}
                data={campaigns}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
            {!isLoading && (
              <Row className="mt-2">
                <Col md={10}>
                  <h3 dir="rtl">סה״כ קמפיינים וועדים:{campaigns.length}</h3>
                </Col>
                <Col md={2}>
                <ExportToXlsx jsonData={campaigns} fileName={'רשימת קמפיינים וועדים'} />
                </Col>
              </Row>
            )}
          </Container>
          <CampaignsModal
            show={showModal}
            onHide={handleCloseModal}
            campaign={selectedCampaign}
            onDelete={handleDeleteCampaign}
          />
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default CampaignsScreen;
