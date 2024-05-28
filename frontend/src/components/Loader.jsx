import React from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <center>
    <InfinitySpin 
  width="300"
  color="#80b3ff"
  ariaLabel="infinity-spin-loading"
/>
    </center>
  );
};

export default Loader;
