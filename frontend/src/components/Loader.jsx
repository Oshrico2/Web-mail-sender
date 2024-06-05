import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loader = ({text}) => {
  return (
    <center>
    <h4>{text}</h4>
    <InfinitySpin 
  width="200"
  color="#80b3ff"
  ariaLabel="infinity-spin-loading"
/>
    </center>
  );
};

export default Loader;
