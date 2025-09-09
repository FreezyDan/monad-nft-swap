// src/contracts/nftSwapContracts.ts
// NOTE: ensure this path matches where your JSON artifact actually is:
// frontend/src/contracts/abis/NftNftSwapAllowlist.json

import NftNftSwapArtifact from "./abis/NftNftSwapAllowlist.json";

export const NFT_NFT_SWAP_ADDRESS = "0xF3E27E5E25555eab11C8Af48f2F1FC58d7B9D3b9"; // change if needed
export const NFT_TOKEN_SWAP_ADDRESS = "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691"; // change if needed

// well-formed ABI array for ethers
export const NftNftSwapAbi = Array.isArray(NftNftSwapArtifact.abi)
  ? NftNftSwapArtifact.abi
  : (NftNftSwapArtifact as any).abi || [];

export default {
  NFT_NFT_SWAP_ADDRESS,
  NFT_TOKEN_SWAP_ADDRESS,
  NftNftSwapAbi,
};
