// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NftTokenSwapAllowlist is ERC721Holder, Ownable, ReentrancyGuard {
    enum Status { Open, Cancelled, Completed, Expired }

    struct Side {
        address nft;      
        uint256 tokenId;
        address token;    
        uint256 amount;   
    }

    struct Swap {
        address party1;
        address party2;
        Side side1;
        Side side2;
        Status status;
        uint64 expiry;
        bool party1Deposited;
        bool party2Deposited;
    }

    uint256 public swapCount;
    mapping(uint256 => Swap) public swaps;

    mapping(address => bool) public allowedCollection;
    mapping(address => string) public nftNames;
    address[] public allowedCollectionsList;

    event SwapCreated(uint256 indexed id, address indexed party1, address indexed party2);
    event Deposited(uint256 indexed id, address indexed who);
    event SwapCompleted(uint256 indexed id);
    event SwapCancelled(uint256 indexed id);
    event SwapDeclined(uint256 indexed id);
    event SwapExpired(uint256 indexed id);
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

    function createSwap(
        address _party2,
        address _nft1,
        uint256 _tokenId1,
        address _token1,
        uint256 _amount1,
        address _nft2,
        uint256 _tokenId2,
        address _token2,
        uint256 _amount2,
        uint64 _expiry
    ) external nonReentrant returns (uint256) {
        require(_party2 != address(0), "invalid counterparty");
        require(_nft1 != address(0) || _token1 != address(0), "party1 empty");
        require(_nft2 != address(0) || _token2 != address(0), "party2 empty");
        require(!(_nft1 == address(0) && _nft2 == address(0)), "token<->token not supported");
        if (_nft1 != address(0)) require(allowedCollection[_nft1], "nft1 not allowed");
        if (_nft2 != address(0)) require(allowedCollection[_nft2], "nft2 not allowed");

        swapCount++;
        swaps[swapCount] = Swap({
            party1: msg.sender,
            party2: _party2,
            side1: Side(_nft1, _tokenId1, _token1, _amount1),
            side2: Side(_nft2, _tokenId2, _token2, _amount2),
            status: Status.Open,
            expiry: _expiry,
            party1Deposited: false,
            party2Deposited: false
        });

        emit SwapCreated(swapCount, msg.sender, _party2);
        return swapCount;
    }

    function deposit(uint256 id, bool depositNft, bool depositToken) external nonReentrant {
        Swap storage s = swaps[id];
        require(s.status == Status.Open, "not open");
        if (s.expiry != 0) require(block.timestamp <= s.expiry, "expired");

        if (msg.sender == s.party1) {
            _depositSide(s.side1, msg.sender, depositNft, depositToken);
            s.party1Deposited = true;
        } else if (msg.sender == s.party2) {
            _depositSide(s.side2, msg.sender, depositNft, depositToken);
            s.party2Deposited = true;
        } else {
            revert("not a party");
        }

        emit Deposited(id, msg.sender);

        if (s.party1Deposited && s.party2Deposited) _finalize(id);
    }

    function _depositSide(Side storage side, address from, bool depositNft, bool depositToken) internal {
        if (depositNft && side.nft != address(0)) IERC721(side.nft).transferFrom(from, address(this), side.tokenId);
        if (depositToken && side.token != address(0) && side.amount > 0) IERC20(side.token).transferFrom(from, address(this), side.amount);
    }

    function _finalize(uint256 id) internal {
        Swap storage s = swaps[id];
        if (s.side1.nft != address(0)) IERC721(s.side1.nft).transferFrom(address(this), s.party2, s.side1.tokenId);
        if (s.side1.token != address(0) && s.side1.amount > 0) IERC20(s.side1.token).transfer(s.party2, s.side1.amount);
        if (s.side2.nft != address(0)) IERC721(s.side2.nft).transferFrom(address(this), s.party1, s.side2.tokenId);
        if (s.side2.token != address(0) && s.side2.amount > 0) IERC20(s.side2.token).transfer(s.party1, s.side2.amount);
        s.status = Status.Completed;
        emit SwapCompleted(id);
    }
}
