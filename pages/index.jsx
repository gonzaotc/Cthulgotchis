import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useEffect, useState, useCallback, useContext } from "react";
import { useAccount, useContractReads } from "wagmi";
import NFTCard from "../components/NFTCard";
import Modal from "../components/Modal";
import NFTContainer from "../components/NFTContainer";
import Banner from "../components/Banner";
import Feed from "../components/feed";
import Mint from "../components/Mint";
import MintButton from "../components/MintButton";
import Footer from "../components/Footer";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import * as particles from "/particles.json";
import { alchemy_apiKey, contract } from "./_app";
import { EventContext } from "../context/EventContext";

const Home = () => {
  const { eventData } = useContext(EventContext);
  const { address } = useAccount();

  const [firstRender, setFirstRender] = useState(true);
  const [lastAlchemyUpdate, setLastAlchemyUpdate] = useState(null);
  const alchemyDelay = lastAlchemyUpdate
    ? ((new Date().getTime() - new Date(lastAlchemyUpdate).getTime()) / 1000).toFixed(0)
    : "unknown";

  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [ownedTokenIds, setOwnedTokenIds] = useState([]);
  const [NFTsWithData, setNFTsWithData] = useState([]);

  const [modal, setModal] = useState({ display: false, type: "", data: {} });

  const {
    data: readData,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      { ...contract, functionName: "getLastTimeFeeds", args: [ownedTokenIds] },
      { ...contract, functionName: "getAges", args: [ownedTokenIds] },
    ],
    enabled: ownedTokenIds.length > 0,
    watch: ownedTokenIds.length > 0,
  });

  const fetchUserNFTs = async () => {
    if (!address) {
      setOwnedNFTs([]);
    } else {
      const baseURL = `https://polygon-mumbai.g.alchemyapi.io/nft/v2/${alchemy_apiKey}/getNFTs/`;
      const fetchURL = `${baseURL}?contractAddresses[]=${contract.addressOrName}&withMetadata=true&owner=${address}&refreshCache=true`;
      await fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
          setLastAlchemyUpdate(data?.ownedNfts[0]?.timeLastUpdated);
          let tokenIds = [];
          data.ownedNfts.forEach((nft, index) => {
            tokenIds.push(nft.id.tokenId.toString(16));
          });
          setOwnedTokenIds(tokenIds);
          console.log("fetchUserNFTs - ownedNFTs", data.ownedNfts);
          setOwnedNFTs(data.ownedNfts);
        })
        .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    setFirstRender(false);
  }, []);

  // Enter -> loader -> fetchUserNfts from Alchemy API  changes OwnedNFTs,OwnerTokenIds ->
  // use Ids to read from Smart Contract

  useEffect(() => {
    if (address) {
      fetchUserNFTs();
    }
  }, [address]);

  // React to particular events with changes in the UI
  useEffect(() => {
    if (eventData?.event == "Transfer") {
      if (eventData.data[0] == address || eventData.data[1] == address) {
        console.log("Refetching because you have minted, or received an NFT.");
        fetchUserNFTs();
      }
    }
    if (eventData?.event == "Evolve") {
      if (eventData.data[0] == address) {
        console.log("Refetching because your nft has evolved");
        fetchUserNFTs();
      }
    }
  }, [eventData]);

  // Testing: triying to diminish Metadata delay.
  // This have to be actived only when user is logged, and he has nfts.
  // In other case, this makes no sense.
  useEffect(() => {
    if (address && ownedNFTs.length > 0) {
      fetchUserNFTs();
      console.log("refetching because readData has changed. (blockchain watch)");
    }
  }, [readData]);

  useEffect(() => {
    // Sinchronous Task, changes the NFTsWithData shown in the UI.
    // When readData(Feed & Age Smart Contract data) or ownedNFTs(result from Alchemy API) changes
    if (readData && readData[0] && ownedNFTs) {
      let nfts = [];
      ownedNFTs.forEach((nft, index) => {
        nfts.push({
          ...nft,
          lastTimeFeed: readData[0][index].toNumber(),
          age: readData[1][index].toNumber(),
        });
      });
      setNFTsWithData(nfts);
    } else {
      setNFTsWithData([]);
    }
  }, [readData, ownedNFTs]);

  // PARTICLES LIBRARY DEPENDENCIES
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async container => {}, []);

  const handleCloseModal = () => {
    setModal({ display: false, type: "", data: {} });
  };

  return (
    <div
      className={`bg-[url('/background.jpg')] bg-center bg-cover flex flex-col items-center min-h-screen`}
    >
      <Head>
        <title>Cthulgotchis</title>
        <meta name="description" content="A React + Solidity small fun NFT tamagotchis app!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Paticles background implementation. Options in particles.json */}
      {particlesInit && particlesLoaded && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={particles.particles}
        />
      )}

      <Banner />

      {/* Main app container */}
      <div className="w-11/12 h-full flex flex-col items-center min-h-screen">
        {/* Mint & Feed modals */}
        {modal.display && (
          <Modal onClose={handleCloseModal}>
            {modal.type == "mint" && <Mint onClose={handleCloseModal} address={address} />}
            {modal.type == "feed" && <Feed data={modal.data} onClose={handleCloseModal} />}
          </Modal>
        )}
        {/* Navbar */}
        <nav className="w-full flex justify-between items-center pb-2 mt-2 mb-6 border-white/10 border-b-2">
          <span className="flex items-center">
            <h1 className="text-[1.4rem] sm:text-3xl text-white-80">
              <span className="text-primary">Cthul</span>gotchis
              {/* <img src="/favicon.ico" className="w-8 h-8 mx-1.5 relative top-0.5" alt="" /> */}
            </h1>
          </span>
          <ConnectButton accountStatus="address" />
        </nav>

        <main className="w-full flex flex-col mb-14">
          {!firstRender && (
            <>
              <section className="flex mb-4">
                {/* if wallet is connected, show mint button. Disable if user already have 3 nfts.
                  (*this is also checked in the smart contract*) */}
                {address && (
                  <div className="flex justify-between w-full">
                    <MintButton
                      NFTsWithData={NFTsWithData}
                      onClick={() => {
                        setModal({ display: true, type: "mint", data: {} });
                      }}
                    />
                    <p className="text-white/80">Metadata lastUpdate: {alchemyDelay + "s ago"}</p>
                  </div>
                )}
              </section>

              {/* If wallet is connected, offer faucet link */}
              {address && (
                <a
                  className="font-semibold mb-4 text-primary text-shadow self-start"
                  href="https://faucet.polygon.technology/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>Click here to claim free MATIC to test this dApp</p>
                </a>
              )}

              {address ? (
                <section className="mb-6">
                  <h2 className="mb-3 text-[rgba(255,255,255,0.3] text-white/80 text-xl">
                    Your NFT collection
                  </h2>
                  {/* <FeedButton
                        NFTsWithData={NFTsWithData}
                        onClick={() => {
                          setModal({ display: true, content: "feed" });
                        }}
                      /> */}
                  <NFTContainer className="">
                    {NFTsWithData.length > 0 ? (
                      NFTsWithData.map((nft, index) => (
                        <NFTCard
                          key={index}
                          nft={nft}
                          owned={true}
                          onClick={() => {
                            setModal({ display: true, type: "feed", data: { nft } });
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-white">You dont own any NFTs.</p>
                    )}
                  </NFTContainer>
                </section>
              ) : (
                <span className="mb-8">
                  <h3 className="text-primary">
                    Connect your wallet before interacting with the dApp.
                  </h3>
                </span>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
