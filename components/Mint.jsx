import React, { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { Loading, Tooltip } from "@nextui-org/react";
import Error from "../icons/Error";
import { contract } from "../pages/_app";

const Mint = ({ onClose, address }) => {
  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "safeMint",
    args: [address],
  });

  const {
    data: mintData,
    isError: isMintingError,
    error: mintingError,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    write: mint,
  } = useContractWrite({
    ...config,
  });

  const {
    isSuccess: isTxSuccess,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    if (isTxSuccess) {
      onClose();
    }
  }, [isTxSuccess]);

  const onMintNFT = () => {
    console.log("trigering onMintNFT");
    mint && mint();
  };

  return (
    <div className="flex flex-col justify-between h-full items-center">
      <h3 className="text-white mb-2">Mint a new Cthulgotchie Egg</h3>
      <p className="text-white/80 mb-2 leading-[1.2rem]">
        The minting will remain open and free until we reach 1000 units. Then, people must reproduce
        their Cthulgotchis to keep the collection alive.
      </p>
      <p className="text-white/80 leading-[1.2rem]">
        Remember, your Cthulgotchi will get burned from the collection if he doesn't eat enough!
      </p>
      <span className="flex align-items text-white "></span>
      {/* mintData, isMintLoading, isMintStarted, isMintingError*/}
      {/* isTxSuccess, isTxLoading,  isTxError */}
      <Tooltip
        content={
          (isMintingError || isTxError) && (
            <span className="flex items-center">
              <Error className="w-5 h-5 mr-1 text-red-500" />
              <p className="text-red-500">
                {isMintingError ? mintingError.toString() : txError.toString()}
              </p>
            </span>
          )
        }
        placement="bottom"
        color="invert"
        rounded={false}
        className={"mt-6 !w-full"}
      >
        <button
          className="btn w-full h-10"
          disabled={isMintLoading || isTxLoading}
          onClick={() => {
            onMintNFT();
          }}
        >
          <p className="mr-2">
            {isMintLoading && "Waiting confirmation"}
            {isMintingError && "Transaction rejected. Try Again"}
            {isTxError && "Transaction error"}
            {isTxLoading && "Processing transaction"}
            {isTxSuccess && "Transaction success!"}

            {!isMintLoading &&
              !isMintingError &&
              !isTxLoading &&
              !isTxError &&
              !isTxSuccess &&
              "Mint NFT"}
          </p>

          {(isMintLoading || isTxLoading) && (
            <Loading size="sm" color="currentColor" textColor={"primary"} />
          )}
        </button>
      </Tooltip>
    </div>
  );
};

export default Mint;
