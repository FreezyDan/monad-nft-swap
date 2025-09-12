// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/// @title Simple NFT↔NFT Swap with Flat Platform Fee (native token)
/// @notice Initiator escrows offered NFTs. Acceptor transfers requested NFTs and pays a flat fee.
contract NftSwap is Ownable, ReentrancyGuard, IERC721Receiver {
    struct NFT {
        address token; // ERC721 contract
        uint256 id;    // tokenId
    }

    struct Swap {
        address initiator;         // creator (escrows offered)
        address counterparty;      // optional; 0x0 = anyone can accept
        NFT[] offered;             // NFTs held in escrow (from initiator)
        NFT[] requested;           // NFTs the initiator wants from acceptor
        uint64  deadline;          // unix ts; 0 = no deadline
        bool    active;            // true until accepted/canceled
    }

    uint256 public nextSwapId;
    mapping(uint256 => Swap) private swaps;

    // fee config
    address public feeRecipient;
    uint256 public flatFeeWei; // paid on acceptSwap() by acceptor

    event SwapCreated(uint256 indexed swapId, address indexed initiator, address indexed counterparty);
    event SwapCanceled(uint256 indexed swapId);
    event SwapAccepted(uint256 indexed swapId, address indexed acceptor);
    event FeeConfigUpdated(address indexed feeRecipient, uint256 flatFeeWei);

    constructor(address _feeRecipient, uint256 _flatFeeWei) {
        require(_feeRecipient != address(0), "fee recipient required");
        feeRecipient = _feeRecipient;
        flatFeeWei = _flatFeeWei;
        emit FeeConfigUpdated(_feeRecipient, _flatFeeWei);
    }

    // ===== Admin =====
    function setFeeConfig(address _recipient, uint256 _flatFeeWei) external onlyOwner {
        require(_recipient != address(0), "bad recipient");
        feeRecipient = _recipient;
        flatFeeWei = _flatFeeWei;
        emit FeeConfigUpdated(_recipient, _flatFeeWei);
    }

    // ===== Create / Cancel / Accept =====

    /// @param _counterparty 0x0 to allow anyone to accept
    function createSwap(
        address _counterparty,
        address[] calldata _offeredTokens,
        uint256[] calldata _offeredTokenIds,
        address[] calldata _requestedTokens,
        uint256[] calldata _requestedTokenIds,
        uint64 _deadline
    ) external nonReentrant returns (uint256 swapId) {
        require(_offeredTokens.length == _offeredTokenIds.length, "offered len mismatch");
        require(_requestedTokens.length == _requestedTokenIds.length, "requested len mismatch");
        require(_offeredTokens.length > 0, "no offered NFTs");

        swapId = nextSwapId++;
        Swap storage s = swaps[swapId];
        s.initiator = msg.sender;
        s.counterparty = _counterparty;
        s.deadline = _deadline;
        s.active = true;

        // escrow offered
        for (uint256 i = 0; i < _offeredTokens.length; i++) {
            address t = _offeredTokens[i];
            uint256 id = _offeredTokenIds[i];
            s.offered.push(NFT({token: t, id: id}));
            IERC721(t).safeTransferFrom(msg.sender, address(this), id);
        }
        // record requested
        for (uint256 j = 0; j < _requestedTokens.length; j++) {
            s.requested.push(NFT({token: _requestedTokens[j], id: _requestedTokenIds[j]}));
        }

        emit SwapCreated(swapId, msg.sender, _counterparty);
    }

    function cancelSwap(uint256 swapId) external nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.active, "not active");
        require(s.initiator == msg.sender, "only initiator");
        s.active = false;

        // return escrow
        for (uint256 i = 0; i < s.offered.length; i++) {
            NFT memory n = s.offered[i];
            IERC721(n.token).safeTransferFrom(address(this), s.initiator, n.id);
        }
        emit SwapCanceled(swapId);
        delete swaps[swapId];
    }

    function acceptSwap(uint256 swapId) external payable nonReentrant {
        Swap storage s = swaps[swapId];
        require(s.active, "not active");
        if (s.counterparty != address(0)) require(s.counterparty == msg.sender, "not allowed");
        if (s.deadline != 0) require(block.timestamp <= s.deadline, "expired");
        require(msg.value >= flatFeeWei, "fee not paid");

        // pull requested from acceptor → initiator
        for (uint256 i = 0; i < s.requested.length; i++) {
            NFT memory n = s.requested[i];
            IERC721(n.token).safeTransferFrom(msg.sender, s.initiator, n.id);
        }

        // send offered from escrow → acceptor
        for (uint256 j = 0; j < s.offered.length; j++) {
            NFT memory n = s.offered[j];
            IERC721(n.token).safeTransferFrom(address(this), msg.sender, n.id);
        }

        s.active = false;
        emit SwapAccepted(swapId, msg.sender);

        (bool ok, ) = payable(feeRecipient).call{value: msg.value}("");
        require(ok, "fee transfer failed");

        delete swaps[swapId];
    }

    // Views
    function getSwap(uint256 swapId)
        external
        view
        returns (
            address initiator,
            address counterparty,
            NFT[] memory offered,
            NFT[] memory requested,
            uint64 deadline,
            bool active
        )
    {
        Swap storage s = swaps[swapId];
        return (s.initiator, s.counterparty, s.offered, s.requested, s.deadline, s.active);
    }

    // IERC721Receiver
    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    // Rescue
    function rescueERC721(address token, uint256 tokenId, address to) external onlyOwner {
        IERC721(token).safeTransferFrom(address(this), to, tokenId);
    }
}
