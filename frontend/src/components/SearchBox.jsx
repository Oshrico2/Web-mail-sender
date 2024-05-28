import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SearchBox = ({ onSearch, searchFor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Form.Group controlId="searchAgent">
      <Form.Control
        type="text"
        placeholder={`חפש לפי ${searchFor}`}
        value={searchTerm}
        onChange={handleSearch}
      />
    </Form.Group>
  );
};

export default SearchBox;
