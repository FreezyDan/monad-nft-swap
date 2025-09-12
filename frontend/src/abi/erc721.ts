// src/abi/erc721.ts
export const ERC721_ENUMERABLE_ABI = [
  { "inputs": [], "name": "name",   "outputs": [{"type":"string"}], "stateMutability":"view", "type":"function" },
  { "inputs": [], "name": "symbol", "outputs": [{"type":"string"}], "stateMutability":"view", "type":"function" },

  // ownership & enumerable
  { "inputs":[{"name":"tokenId","type":"uint256"}], "name":"ownerOf", "outputs":[{"type":"address"}], "stateMutability":"view", "type":"function" },
  { "inputs":[{"name":"owner","type":"address"}], "name":"balanceOf", "outputs":[{"type":"uint256"}], "stateMutability":"view", "type":"function" },
  { "inputs":[{"name":"owner","type":"address"},{"name":"index","type":"uint256"}], "name":"tokenOfOwnerByIndex", "outputs":[{"type":"uint256"}], "stateMutability":"view", "type":"function" },

  // metadata
  { "inputs":[{"name":"tokenId","type":"uint256"}], "name":"tokenURI", "outputs":[{"type":"string"}], "stateMutability":"view", "type":"function" },

  // approvals
  { "inputs":[{"name":"owner","type":"address"},{"name":"operator","type":"address"}], "name":"isApprovedForAll", "outputs":[{"type":"bool"}], "stateMutability":"view", "type":"function" },
  { "inputs":[{"name":"operator","type":"address"},{"name":"approved","type":"bool"}], "name":"setApprovalForAll", "outputs":[], "stateMutability":"nonpayable", "type":"function" }
] as const;
