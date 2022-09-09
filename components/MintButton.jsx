import { Tooltip } from "@nextui-org/react";
import React from "react";
import TooltipInfo from "./TooltipInfo";

const MintButton = ({ NFTsWithData, onClick }) => {
  return (
    <Tooltip
      content={
        <TooltipInfo
          text={
            NFTsWithData.length < 3
              ? "Mint freely a Cthulgochie NFT!"
              : "You can't mint more NFTs. (3 Máx per wallet)"
          }
        />
      }
      placement="right"
      color="invert"
      rounded={false}
    >
      <button
        className="btn mr-2 w-full sm:w-auto"
        onClick={onClick}
        disabled={NFTsWithData.length >= 3}
      >
        Mint NFT
      </button>
    </Tooltip>
  );
};

export default MintButton;
