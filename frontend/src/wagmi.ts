// src/wagmi.ts
// Minimal, robust RainbowKit + wagmi config for Monad Testnet.
// Uses getDefaultConfig from @rainbow-me/rainbowkit so projectId is passed correctly.

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

/**
 * Monad Testnet chain object (you said chain id is 10143).
 * Keep this shape simple and compatible with RainbowKit / wagmi.
 */
export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
};

export const chains = [monadTestnet];

// Your WalletConnect / projectId value (the one you shared)
const projectId = "1a48c1fba807d453358b1c1562a93050";

/**
 * getDefaultConfig builds a wagmi config object and RainbowKit connectors for you.
 * Export wagmiConfig and chains for use in main.tsx.
 */
export const wagmiConfig = getDefaultConfig({
  appName: "Monad NFT Swap",
  projectId,
  chains,
});
