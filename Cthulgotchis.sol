// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts@4.6.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";

contract Cthulgotchis is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
 
   // Metadata information for each stage of the NFT on IPFS.
    string[] IpfsUri = [
    "https://gateway.pinata.cloud/ipfs/QmTpKCi9JhaqC4hBT4xPEn155nyq5myfSLXhRZDWu9LRVg/cthulgotchi-json-0.json",
    "https://gateway.pinata.cloud/ipfs/QmTpKCi9JhaqC4hBT4xPEn155nyq5myfSLXhRZDWu9LRVg/cthulgotchi-json-1.json",
    "https://gateway.pinata.cloud/ipfs/QmTpKCi9JhaqC4hBT4xPEn155nyq5myfSLXhRZDWu9LRVg/cthulgotchi-json-2.json",
    "https://gateway.pinata.cloud/ipfs/QmTpKCi9JhaqC4hBT4xPEn155nyq5myfSLXhRZDWu9LRVg/cthulgotchi-json-3.json",
    "https://gateway.pinata.cloud/ipfs/QmTpKCi9JhaqC4hBT4xPEn155nyq5myfSLXhRZDWu9LRVg/cthulgotchi-json-4.json"
    ]; 

    mapping(uint256 => uint256) public lastTimeFeed;
    mapping(uint256 => uint256) public mintDate;

    uint256 public constant FEED_COOLDOWN = 2 minutes;

    event Feed(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed timestamp
    );

    event Evolve(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 indexed evolution
    );

    error feedOnCooldown(uint256 timePassed , uint256 totalCooldown);

    modifier onlyNFTOwner(uint256 _tokenId){
        require(msg.sender == ownerOf(_tokenId), "Only the NFT owner is able to execute this function.");
        _;
    }

    constructor() ERC721("Cthulgotchis", "CGC") {
    }

    function safeMint(address to) public {
        // Restrict minting amount!!!!! to do
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, IpfsUri[0]);
        // set as feeded
        lastTimeFeed[tokenId] = block.timestamp;
    }

    function feedNFT(uint256 _tokenId) public onlyNFTOwner(_tokenId) { 
        // FEED_COOLDOWN must have finished to feed again.
        uint256 lastTime = lastTimeFeed[_tokenId];
        if (block.timestamp - lastTime < FEED_COOLDOWN){
            //                      time passed, totalCooldown
            revert feedOnCooldown(block.timestamp - lastTime, FEED_COOLDOWN);
        }
        lastTimeFeed[_tokenId] = block.timestamp;
        emit Feed(msg.sender, _tokenId, block.timestamp);

        // If the time for evolving has come, evolve!
        evolveNFT(_tokenId);
    }


    function evolveNFT(uint256 _tokenId) private {
        uint256 age = block.timestamp - mintDate[_tokenId];
        uint256 currentStage = getCurrentStage(_tokenId);
        if(currentStage >= 4){return;} // cannot evolve from stage 4

        if (currentStage == 0 && age < 2 minutes){return;}
        if (currentStage == 1 && age < 5 minutes){return;}
        if (currentStage == 2 && age < 10 minutes){return;}
        if (currentStage == 3 && age < 15 minutes){return;}
        
        // Get the current stage of the NFT and add 1
        uint256 newVal = currentStage + 1;
        // store the new URI
        string memory newUri = IpfsUri[newVal];
        // Update the URI
        _setTokenURI(_tokenId, newUri);
        emit Evolve(msg.sender, _tokenId, newVal);
    }

    // determine the stage of the flower growth
    function getCurrentStage(uint256 _tokenId) public view returns (uint256) {
        string memory _uri = tokenURI(_tokenId);

        if (compareStrings(_uri, IpfsUri[0])) {  // Egg
            return 0;
        }
        if (compareStrings(_uri, IpfsUri[1])) {  // Baby
            return 1;
        }
        if (compareStrings(_uri, IpfsUri[2])) {  // Young
            return 2;
        }
        if (compareStrings(_uri, IpfsUri[3])) {  // Adult
            return 3;
        }
        return 4;  // King
    }

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    // The following functions is an override required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // My custom getters

    function getLastTimeFeed (uint256 tokenId) public view returns(uint256){
        return lastTimeFeed[tokenId];
    }
}