// src/wagmi.ts
// Minimal, robust RainbowKit + wagmi config for Monad Testnet.

import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Define your Monad Testnet chain
export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
} as const;

export const chains = [monadTestnet];

// WalletConnect projectId (keep as your value)
const projectId = "1a48c1fba807d453358b1c1562a93050";

// RainbowKit v2 helper returns a wagmi config you can pass directly to WagmiConfig
export const wagmiConfig = getDefaultConfig({
  appName: "Monad NFT Swap",
  projectId,
  chains,
  ssr: false, // set true only if you’re actually doing SSR
});
