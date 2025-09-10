// src/lib/monadClient.ts
import { createPublicClient, http } from "viem";

const DEFAULT_RPC = import.meta.env.VITE_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz"; // change if different

export const monadClient = createPublicClient({
  chain: undefined as any, // we don't need a chain object for simple public reads
  transport: http(DEFAULT_RPC),
});
