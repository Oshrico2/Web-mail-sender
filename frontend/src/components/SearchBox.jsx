import React, { useState } from "react";
import { Form } from "react-bootstrap";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";

const SearchBox = ({ onSearch, searchFor }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Form.Group controlId="searchAgent" style={{ position: "relative" }}>
      <Form.Control
        type="text"
        placeholder={`חפש לפי ${searchFor}`}
        value={searchTerm}
        onChange={handleSearch}
        style={{ paddingLeft: "50px" }} // Adjust padding to make space for the larger icon
      />
      <SearchPeopleIcon
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "1.5em", // Adjust the font size to make the icon bigger
        }}
      />
    </Form.Group>
  );
};

export default SearchBox;
