import React, { useRef, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import CloseIcon from '@rsuite/icons/Close';
import CheckIcon from '@rsuite/icons/Check';


const AgentsTable = ({ columns, data, columnsHebrew, onRowClick }) => {
  const tableContainerRef = useRef(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const container = tableContainerRef.current;

    const handleScroll = () => {
      if (container) {
        const atTop = container.scrollTop === 0;
        if (atTop && isScrolledDown) {
          setIsScrolledDown(false);
          console.log("Table scrolled back to the top");
          const tableHeader = document.querySelector("thead");
          tableHeader.classList.remove("table-secondary");
        } else if (!atTop && !isScrolledDown) {
          setIsScrolledDown(true);
          const tableHeader = document.querySelector("thead");
          tableHeader.classList.add("table-secondary");
          console.log("Table scrolled down");
        }
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isScrolledDown]);

  return (
    <div
      ref={tableContainerRef}
      className="table-responsive mt-4"
      style={{ maxHeight: "40vh", overflow: "auto"}}
    >
      <Table striped bordered hover >
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr>
            {columnsHebrew.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{cursor:'pointer'}}>
          {data.map((agent, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick(agent._id)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                {Array.isArray(agent[column])
                  ? agent[column].sort().join(", ") // Converts array to comma-separated string
                  : typeof agent[column] === 'boolean'
                    ? agent[column] === false ? <CloseIcon color="red" style={{fontSize:'30px'}}/> : <CheckIcon color="green" style={{fontSize:'30px'}} /> // Converts boolean to string explicitly
                    : agent[column]} 
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AgentsTable;
