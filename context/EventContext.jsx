import { createContext, useState } from "react";
import { useContractEvent } from "wagmi";
import { contract } from "../pages/_app";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventData, setEventData] = useState(undefined);

  // Transfer(address from, address to, uint256 tokenId);
  useContractEvent({
    ...contract,
    eventName: "Transfer",
    listener: event => {
      console.log(event);
      setEventData({ event: "Transfer", data: event });
    },
  });

  // Feed( address owner, uint256tokenId, uint256 timestamp);
  // I'm not using this event at this moment, because I'm watching getAges & getLastTimeFeed on every block.
  // useContractEvent({
  //   ...contract,
  //   eventName: "Feed",
  //   listener: event => {
  //     console.log(event);
  //     setEventData({ event: "Feed", data: event });
  //   },
  // });

  // event Evolve( address owner, uint256 tokenId, uint256 evolution);
  useContractEvent({
    ...contract,
    eventName: "Evolve",
    listener: event => {
      console.log(event);
      setEventData({ event: "Evolve", data: event });
    },
  });

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>{children}</EventContext.Provider>
  );
};
