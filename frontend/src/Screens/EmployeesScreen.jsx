import { Row, Col, Container } from "react-bootstrap";
import UserMenu from "../components/UserMenu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AgentsTable from "../components/AgentsTable";
import SearchBox from "../components/SearchBox";
import Header from "../components/Header";
import EmployeesModal from "../components/EmployeeModal";
import Loader from "../components/Loader";

const EmployeesScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const columns = ["name", "email", "subject"];
  const columnsHebrew = ["שם", "דואר אלקטרוני", "תחום"];

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("There was a problem fetching the employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Function to handle search by name
  const handleSearch = async (searchTerm) => {
    if (searchTerm === "") {
      const response = await axios.get(`/api/employees`);
      setEmployees(response.data);
    } else {
      try {
        const response = await axios.get(
          `/api/employees/search-by-subject/${searchTerm}`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("There was a problem searching for employees:", error);
      }
    }
  };

  const handleRowClick = async (id) => {
    try {
      const response = await axios.get(
        `/api/employees/${id}`
      );
      setSelectedEmployee(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("There was a problem fetching the employee data:", error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`/api/employees/${employeeId}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <Header title="רשימת עובדים" />
      <Row>
        <Col md={2}>
          <UserMenu />
        </Col>
        <Col md={10}>
          <Container className="mt-5" dir="rtl">
            <SearchBox onSearch={handleSearch} searchFor={"תחום"} />
            {isLoading ? (
              <Loader />
            ) : (
              <AgentsTable
                columns={columns}
                data={employees}
                columnsHebrew={columnsHebrew}
                onRowClick={handleRowClick}
              />
            )}
          </Container>
          <EmployeesModal
            show={showModal}
            onHide={handleCloseModal}
            employee={selectedEmployee}
            onDelete={handleDeleteEmployee}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EmployeesScreen;
