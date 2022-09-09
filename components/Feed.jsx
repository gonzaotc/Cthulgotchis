import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { Loading, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import Error from "../icons/Error";
import { contract } from "../pages/_app";

const Feed = ({ data, onClose }) => {
  const tokenId = parseInt(data.nft.id.tokenId);

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "feedNFT",
    args: [tokenId], // receives uint256 tokenId
  });

  const {
    data: actionData,
    isError: isActionError,
    error: actionError,
    isLoading: isActionLoading,
    isSuccess: isActionStarted,
    write: action,
  } = useContractWrite({
    ...config,
  });

  const {
    isSuccess: isTxSuccess,
    isLoading: isTxLoading,
    isError: isTxError,
    error: txError,
  } = useWaitForTransaction({
    hash: actionData?.hash,
  });

  useEffect(() => {
    if (isTxSuccess) {
      onClose();
    }
  }, [isTxSuccess]);

  const onFeedNFT = () => {
    action && action();
  };
  return (
    <>
      <h3 className="text-white mb-5">Feed your Cthulgotchi</h3>
      <p className="text-white/80">You are about to feed your Cthulgotchi Nº {tokenId}</p>

      <Tooltip
        content={
          (isActionError || isTxError) && (
            <span className="flex items-center">
              <Error className="w-5 h-5 mr-1 text-red-500" />
              <p className="text-red-500">
                {isActionError ? actionError.toString() : txError.toString()}
              </p>
            </span>
          )
        }
        placement="bottom"
        color="invert"
        rounded={false}
        className={"mt-8 !w-full"}
      >
        <button
          className="btn w-full h-10"
          disabled={isActionLoading || isTxLoading}
          onClick={() => {
            onFeedNFT();
          }}
        >
          <p className="mr-2">
            {isActionLoading && "Waiting confirmation"}
            {isActionError && "Transaction rejected. Try Again"}
            {isTxError && "Transaction error"}
            {isTxLoading && "Processing transaction"}
            {isTxSuccess && "Transaction success!"}

            {!isActionLoading &&
              !isActionError &&
              !isTxLoading &&
              !isTxError &&
              !isTxSuccess &&
              "Feed NFT"}
          </p>

          {(isActionLoading || isTxLoading) && (
            <Loading size="sm" color="currentColor" textColor={"primary"} />
          )}
        </button>
      </Tooltip>
    </>
  );
};

export default Feed;
