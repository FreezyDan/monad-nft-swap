// src/lib/monadClient.ts
import { createPublicClient, http } from "viem";

const DEFAULT_RPC =
  import.meta.env.VITE_MONAD_RPC_URL || "https://testnet-rpc.monad.xyz"; // replace if different

export const monadClient = createPublicClient({
  // For simple reads we can omit chain config and provide a transport only
  chain: undefined as any,
  transport: http(DEFAULT_RPC),
});
