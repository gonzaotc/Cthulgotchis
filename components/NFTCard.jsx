import React from "react";
import { MINS_COOLDOWN } from "../pages/_app";

const NFTCard = ({ nft, index, owned = true, onClick }) => {
  let lastTimeFeed = new Date().getTime() / 1000 - nft.lastTimeFeed;
  return (
    <article
      key={index}
      className={`text-white pt-2.5 pb-2.5 rounded-md flex drop-shadow-[0_0_5px_rgba(255,255,255,0.05)] shadow-[0_0_7px_#04c84530] ${"bg-[#081906]/20"}`}
    >
      <div className="flex flex-col items-center justify-between relative w-full h-full ">
        <span className="flex items-center ml-2">
          {owned && (
            <p className="text-lg sm:text-base mx-auto text-primary font-semibold text-shadow mr-2">
              {nft.metadata.name}
            </p>
          )}
          <p className="text-lg sm:text-sm text-white/80 font-semibold italic ">
            N.º{parseInt(nft.id.tokenId)}
          </p>
        </span>
        <img
          className={`w-auto max-h-[135px] object-contain image mt-1 mb-0.5`}
          src={nft.metadata.image}
          alt="nft image"
        />
        <div className="flex items-center justify-evenly w-full">
          <button
            className="italic text-white flex items-center text-shadow text-sm bg-black/20 hover:bg-black/40 disabled:bg-black/20 px-1.5 py-0.5 rounded-md"
            onClick={onClick}
            disabled={(lastTimeFeed / 60).toFixed(0) <= MINS_COOLDOWN}
          >
            <img className="w-6 h-6" src="/steak.png" alt="" />
            <p className="text-white/80">
              {lastTimeFeed < 3600
                ? Math.floor(lastTimeFeed / 60) + "min ago"
                : Math.floor(lastTimeFeed / 3600) + " hours ago"}
            </p>
          </button>
          <span className="italic text-white flex items-center text-shadow text-sm">
            <img className="w-6 h-6 mr-[0.05rem]" src="/cake.png" alt="" />{" "}
            <p className="text-white/80">
              {nft.age < 3600
                ? Math.floor(nft.age / 60) + "min"
                : Math.floor(nft.age / 3600) + " hours"}
            </p>
          </span>
        </div>
      </div>
    </article>
  );
};

export default NFTCard;
