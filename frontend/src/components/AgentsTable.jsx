import React from 'react';
import { Table } from 'react-bootstrap';

const AgentsTable = ({ columns, data, columnsHebrew, onRowClick }) => {
  return (
    <div className="table table-responsive mt-4" style={{ overflowY: 'auto', height: '40vh' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columnsHebrew.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((agent, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick(agent._id)}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {Array.isArray(agent[column])
                    ? agent[column].sort().join(', ')
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
