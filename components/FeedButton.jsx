import { Tooltip } from "@nextui-org/react";
import React from "react";
import TooltipInfo from "./TooltipInfo";

const FeedButton = ({ onClick, NFTsWithData }) => {
  return (
    <Tooltip
      content={<TooltipInfo text={"Feed you Tamagotchie before 24 hours or he will DIE."} />}
      placement="right"
      color="invert"
      rounded={false}
    >
      <button
        className="btn w-full sm:w-auto"
        onClick={onClick}
        disabled={NFTsWithData.length == 0}
      >
        Feed NFT
      </button>
    </Tooltip>
  );
};

export default FeedButton;
