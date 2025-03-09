import React from "react";
import "./index.css";

const CircularProgressLoader = ({ align }) => {
  return (
    <div className={`circular-loader ${align}`}>
      <div className=""></div>
      <div className=""></div>
      <div className=""></div>
    </div>
  );
};

export default CircularProgressLoader;
