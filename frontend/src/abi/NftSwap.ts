// src/abi/NftSwap.ts
export const NFT_SWAP_ABI = [
  // view
  { "type": "function", "stateMutability": "view", "name": "feeRecipient", "inputs": [], "outputs": [{"name":"","type":"address"}] },
  { "type": "function", "stateMutability": "view", "name": "flatFeeWei", "inputs": [], "outputs": [{"name":"","type":"uint256"}] },
  { "type": "function", "stateMutability": "view", "name": "getSwap", "inputs": [{"name":"swapId","type":"uint256"}],
    "outputs":[
      {"name":"initiator","type":"address"},
      {"name":"counterparty","type":"address"},
      {"name":"offered","type":"tuple[]","components":[{"name":"token","type":"address"},{"name":"id","type":"uint256"}]},
      {"name":"requested","type":"tuple[]","components":[{"name":"token","type":"address"},{"name":"id","type":"uint256"}]},
      {"name":"deadline","type":"uint64"},
      {"name":"active","type":"bool"}
    ]
  },

  // admin
  { "type": "function", "stateMutability": "nonpayable", "name": "setFeeConfig",
    "inputs":[{"name":"_recipient","type":"address"},{"name":"_flatFeeWei","type":"uint256"}], "outputs":[] },

  // main actions
  { "type": "function", "stateMutability": "nonpayable", "name": "createSwap",
    "inputs":[
      {"name":"_counterparty","type":"address"},
      {"name":"_offeredTokens","type":"address[]"},
      {"name":"_offeredTokenIds","type":"uint256[]"},
      {"name":"_requestedTokens","type":"address[]"},
      {"name":"_requestedTokenIds","type":"uint256[]"},
      {"name":"_deadline","type":"uint64"}
    ],
    "outputs":[{"name":"swapId","type":"uint256"}]
  },
  { "type": "function", "stateMutability": "nonpayable", "name": "cancelSwap",
    "inputs":[{"name":"swapId","type":"uint256"}], "outputs":[] },
  { "type": "function", "stateMutability": "payable", "name": "acceptSwap",
    "inputs":[{"name":"swapId","type":"uint256"}], "outputs":[] }
] as const;
