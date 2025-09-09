// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftNftSwapAllowlist is ERC721Holder, Ownable, ReentrancyGuard {
    struct Swap {
        address proposer;
        address proposerNFT;
        uint256 proposerTokenId;
        address targetNFT;
        uint256 targetTokenId;
        bool active;
    }

    uint256 public swapCount;
    mapping(uint256 => Swap) public swaps;

    mapping(address => bool) public allowedCollection;
    mapping(address => string) public nftNames;
    address[] public allowedCollectionsList;

    event SwapProposed(uint256 indexed swapId, address indexed proposer);
    event SwapAccepted(uint256 indexed swapId, address indexed accepter);
    event SwapCancelled(uint256 indexed swapId);
    event AllowedCollectionUpdated(address indexed collection, bool allowed, string name);

    constructor(address[] memory initialAllowlist, string[] memory names) {
        require(initialAllowlist.length == names.length, "length mismatch");
        for (uint i = 0; i < initialAllowlist.length; i++) {
            address a = initialAllowlist[i];
            string memory n = names[i];
            if (a != address(0) && !allowedCollection[a]) {
                allowedCollection[a] = true;
                nftNames[a] = n;
                allowedCollectionsList.push(a);
                emit AllowedCollectionUpdated(a, true, n);
            }
        }
    }

    function addAllowedCollection(address collection, string memory name) external onlyOwner {
        require(collection != address(0), "zero");
        if (!allowedCollection[collection]) {
            allowedCollection[collection] = true;
            nftNames[collection] = name;
            allowedCollectionsList.push(collection);
            emit AllowedCollectionUpdated(collection, true, name);
        }
    }

    function removeAllowedCollection(address collection) external onlyOwner {
        require(allowedCollection[collection], "not in allowlist");
        allowedCollection[collection] = false;
        nftNames[collection] = "";
        uint len = allowedCollectionsList.length;
        for (uint i = 0; i < len; i++) {
            if (allowedCollectionsList[i] == collection) {
                allowedCollectionsList[i] = allowedCollectionsList[len - 1];
                allowedCollectionsList.pop();
                break;
            }
        }
        emit AllowedCollectionUpdated(collection, false, "");
    }

    function getAllowedCollections() external view returns (address[] memory, string[] memory) {
        string[] memory names = new string[](allowedCollectionsList.length);
        for (uint i = 0; i < allowedCollectionsList.length; i++) {
            names[i] = nftNames[allowedCollectionsList[i]];
        }
        return (allowedCollectionsList, names);
    }

    function proposeSwap(
        address proposerNFT,
        uint256 proposerTokenId,
        address targetNFT,
        uint256 targetTokenId
    ) external nonReentrant returns (uint256) {
        require(allowedCollection[proposerNFT], "proposer NFT not allowed");
        require(allowedCollection[targetNFT], "target NFT not allowed");
        IERC721(proposerNFT).transferFrom(msg.sender, address(this), proposerTokenId);

        uint id = swapCount++;
        swaps[id] = Swap({
            proposer: msg.sender,
            proposerNFT: proposerNFT,
            proposerTokenId: proposerTokenId,
            targetNFT: targetNFT,
            targetTokenId: targetTokenId,
            active: true
        });

        emit SwapProposed(id, msg.sender);
        return id;
    }

    function acceptSwap(uint256 swapId) external nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.active, "not active");
        IERC721(s.targetNFT).transferFrom(msg.sender, s.proposer, s.targetTokenId);
        IERC721(s.proposerNFT).transferFrom(address(this), msg.sender, s.proposerTokenId);
        s.active = false;
        emit SwapAccepted(swapId, msg.sender);
    }

    function cancelSwap(uint256 swapId) external nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.active, "not active");
        require(s.proposer == msg.sender, "not proposer");
        IERC721(s.proposerNFT).transferFrom(address(this), s.proposer, s.proposerTokenId);
        s.active = false;
        emit SwapCancelled(swapId);
    }
}
