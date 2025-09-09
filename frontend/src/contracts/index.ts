// src/contracts/index.ts
import { ethers } from "ethers";

export const RPC = "https://testnet-rpc.monad.xyz";
export const CHAIN_ID = 10143;

// YOUR DEPLOYED SWAP CONTRACTS (from this conversation)
export const NFT_NFT_SWAP_ADDRESS = "0xF3E27E5E25555eab11C8Af48f2F1FC58d7B9D3b9";
export const NFT_TOKEN_SWAP_ADDRESS = "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691";

// Minimal ABI fragments used by the frontend (ethers v6 string fragments)
export const NFT_NFT_SWAP_ABI = [
  "function getAllowedCollections() view returns (address[] memory, string[] memory)",
  "function proposeSwap(address proposerNFT,uint256 proposerTokenId,address targetNFT,uint256 targetTokenId) returns (uint256)",
  "function acceptSwap(uint256 swapId)",
  "function cancelSwap(uint256 swapId)",
  "function swapCount() view returns (uint256)",
  "function swaps(uint256) view returns (address proposer,address proposerNFT,uint256 proposerTokenId,address targetNFT,uint256 targetTokenId,bool active)"
];

export const NFT_TOKEN_SWAP_ABI = [
  "function getAllowedCollections() view returns (address[] memory, string[] memory)",
  "function createSwap(address _party2,address _nft1,uint256 _tokenId1,address _token1,uint256 _amount1,address _nft2,uint256 _tokenId2,address _token2,uint256 _amount2,uint64 _expiry) returns (uint256)",
  "function deposit(uint256 id,bool depositNft,bool depositToken)",
  "function swapCount() view returns (uint256)",
  "function swaps(uint256) view returns (address party1,address party2,tuple(address nft,uint256 tokenId,address token,uint256 amount) side1,tuple(address nft,uint256 tokenId,address token,uint256 amount) side2,uint8 status,uint64 expiry,bool party1Deposited,bool party2Deposited)"
];

// Minimal ERC721 ABI used
export const ERC721_MIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function setApprovalForAll(address operator, bool approved)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function approve(address to, uint256 tokenId)"
];

// helper to get a read provider if needed
export function getRpcProvider() {
  return new ethers.JsonRpcProvider(RPC);
}
