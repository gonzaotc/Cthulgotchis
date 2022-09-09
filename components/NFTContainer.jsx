import React from "react";

const NFTContainer = ({ children, className }) => {
  return <div className={` ${className} gridContainer`}>{children}</div>;
};

export default NFTContainer;
