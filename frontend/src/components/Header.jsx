import React from "react";

const Header = ({title}) => {
  return (
      <div
        style={{
          height: "15vh",
          backgroundColor: "#80b3ff",
          marginBottom: "3px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color:'white'
        }}
      >
          <h1>{title}</h1>
      </div>
  );
};

export default Header;
