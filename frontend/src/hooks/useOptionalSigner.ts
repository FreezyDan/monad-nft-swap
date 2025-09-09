// src/hooks/useOptionalSigner.ts
import { useWalletClient } from "wagmi";
import { useMemo } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";

/**
 * Returns an ethers JsonRpcSigner when a wallet client is available.
 * This replaces wagmi's old `useSigner` usage so we don't rely on a removed export.
 *
 * Returns `undefined` when wallet is not connected or provider missing.
 */
export default function useOptionalSigner(): JsonRpcSigner | undefined {
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    try {
      if (typeof window === "undefined") return undefined;
      // If there's no wallet client, user is not connected
      if (!walletClient) return undefined;

      const maybeEth = (window as any).ethereum ?? (window as any).wallet?.provider;
      if (!maybeEth) return undefined;

      const provider = new BrowserProvider(maybeEth);
      return provider.getSigner();
    } catch (err) {
      console.error("useOptionalSigner error:", err);
      return undefined;
    }
  }, [walletClient]);
}
