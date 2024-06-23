import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import SearchBox from "../components/SearchBox";
import UserMenu from "../components/UserMenu";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import AgentsTable from "../components/AgentsTable";
import ExportToXlsx from "../components/ExportToXlsxBtn";
import UsersModal from "../components/UsersModal";

const UsersScreen = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const columns = ["firstName","lastName","username", "email", "isAdmin"];
  const columnsHebrew = ["שם",'שם משפחה','שם משתמש', "דואר אלקטרוני", "הרשאות מנהל"];


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsAdmin(user.isAdmin);
    }
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("There was a problem fetching the users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle search by name
  const handleSearch = async (searchTerm) => {
    if (searchTerm === "") {
      const response = await axios.get(`/api/users`);
      setUsers(response.data);
    } else {
      try {
        const response = await axios.get(`/api/users/search/${searchTerm}`);
        setUsers(response.data);
      } catch (error) {
        console.error("There was a problem searching for users:", error);
      }
    }
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(
        `/api/users/${id}`
      );
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("There was a problem fetching the user data:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };




  return (
    <div>
        <Header title={`מסך משתמשים (${users.length})`}/>
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
        <Container dir="rtl" className="mt-5">
          {isAdmin ? <div>
            <SearchBox onSearch={handleSearch} searchFor={"שם פרטי"} />
            {isLoading ? (
              <Loader />
            ) : (
              <AgentsTable 
                columns={columns}
                data={users}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
            {!isLoading && (
              <Row className="mt-2">
                <Col md={10}>
                  <h3 dir="rtl">סה״כ משתמשים:{users.length}</h3>
                </Col>
                <Col md={2}>
                <ExportToXlsx jsonData={users} fileName={'רשימת משתמשים'} />
                </Col>
              </Row>
            )}
        
          <UsersModal
            show={showModal}
            onHide={handleCloseModal}
            user={selectedUser}
            onDelete={handleDeleteUser}
          />
          </div> : <h2 className="mt-2">אין לך גישה לדף זה</h2>}
        </Container>
        </Col>
      </Row>
      <Footer />
    </div>
  );
};

export default UsersScreen;
