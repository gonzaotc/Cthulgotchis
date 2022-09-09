import React from "react";
import Info from "../icons/Info";

const TooltipInfo = ({ text }) => {
  return (
    <span className="flex items-center">
      <Info className="w-5 h-5 mr-1" />
      <p className="text-sm">{text}</p>
    </span>
  );
};

export default TooltipInfo;
