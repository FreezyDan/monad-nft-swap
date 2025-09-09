import NftNftSwapAllowlistJson from "./abis/NftNftSwapAllowlist.json";
import NftTokenSwapAllowlistJson from "./abis/NftTokenSwapAllowlist.json";

export const NFT_SWAP_1 = {
  name: "NftNftSwapAllowlist",
  address: "0xF3E27E5E25555eab11C8Af48f2F1FC58d7B9D3b9",
  abi: NftNftSwapAllowlistJson.abi as any[],
};

export const NFT_SWAP_2 = {
  name: "NftTokenSwapAllowlist",
  address: "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691",
  abi: NftTokenSwapAllowlistJson.abi as any[],
};
