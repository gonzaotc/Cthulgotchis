import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../context/EventContext";
import Info from "../icons/Info";
import { getAddressShortcut } from "../utils";

const Banner = () => {
  const { eventData, setEventData } = useContext(EventContext);
  const [message, setMessage] = useState();

  const [firstRender, setFirstRender] = useState(true);

  const evolutions = [
    "Egg Cthulgotchi",
    "Baby Cthulgotchi",
    "Young Cthulgotchi",
    "Adult Cthulgotchi",
    "King Cthulgotchi",
  ];

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (eventData) {
      console.log(eventData);
      eventData.event == "Transfer" &&
        setMessage(
          getAddressShortcut(eventData?.data[1]) +
            " has just minted the Cthulgotchie Egg Nº" +
            eventData?.data[2].toString()
        );
      eventData?.event == "Evolve" &&
        setMessage(
          "Cthulgotchi Nº " +
            eventData?.data[1] +
            " owned by " +
            getAddressShortcut(eventData?.data[0]) +
            " has evolved to " +
            evolutions[parseInt(eventData?.data[2])] +
            " !"
        );
      setTimeout(() => {
        setEventData(undefined);
        setMessage("");
      }, 20000);
    }
  }, [eventData]);

  return (
    <>
      {!firstRender && (
        <div
          className={`w-full max-h-[16] py-3 bg-emerald-300 flex items-center justify-center transition-all duration-500 ${
            !message && "!max-h[0] !py-0"
          }`}
        >
          <div className="flex items-center justify-center">
            {message && <Info className="text-green-800 w-[24px] h-[24px] mr-1" />}
            <p className="relative bottom-[1px] font-medium text-base text-green-800 flex items-center">
              {message}
              <span className="text-sm font-normal italic ml-2">
                {message && "Notice: As we are on a testnet, metadata can take time to be updated."}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
