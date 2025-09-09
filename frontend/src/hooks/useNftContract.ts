// src/hooks/useNftContract.ts
import { useMemo } from "react";
import { Contract } from "ethers";
import useOptionalSigner from "./useOptionalSigner";
// NOTE: adjust path to your NFT ABI file if different
import monadNftAbiJson from "../contracts/abis/monadNftAbi.json";

/**
 * Returns a contract instance for an ERC-721 (signed if connected).
 * If signer is not available, returns undefined (read-only operations should use public client).
 */
export function useNftContract(nftAddress?: string): Contract | undefined {
  const signer = useOptionalSigner();

  return useMemo(() => {
    try {
      if (!nftAddress) return undefined;
      const abi = (monadNftAbiJson as any).abi ?? monadNftAbiJson;
      if (!abi) return undefined;
      if (!signer) return undefined;
      return new Contract(nftAddress, abi, signer);
    } catch (err) {
      console.error("useNftContract error:", err);
      return undefined;
    }
  }, [nftAddress, signer]);
}
