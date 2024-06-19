import React, { useRef, useState } from "react";
import { Table } from "react-bootstrap";

const AgentsTable = ({ columns, data, columnsHebrew, onRowClick }) => {
  const tableContainerRef = useRef(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const handleScroll = () => {
    const container = tableContainerRef.current;
    if (container) {
      // Check if scrolled to the top
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

  React.useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isScrolledDown]); // Re-run effect when isScrolledDown state changes


  return (
    <div
      ref={tableContainerRef}
      className="table-responsive mt-4"
      style={{ maxHeight: "70vh", overflow: "auto" }}
    >
      <Table striped bordered hover className="table-fixed-header">
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr>
            {columnsHebrew.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ overflowY: "auto", maxHeight: "60vh" }}>
          {data.map((agent, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick(agent._id)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {Array.isArray(agent[column])
                    ? agent[column].sort().join(", ")
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
