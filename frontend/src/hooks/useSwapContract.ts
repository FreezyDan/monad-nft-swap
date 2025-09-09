// src/hooks/useSwapContract.ts
import { useMemo } from "react";
import { Contract } from "ethers";
import useOptionalSigner from "./useOptionalSigner";
// NOTE: your ABI path - you mentioned the abis are inside src/contracts/abis
import nftNftSwapAllowlistJson from "../contracts/abis/NftNftSwapAllowlist.json";

export const SWAP_CONTRACT_ADDRESS = "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691";

/**
 * Returns a signer-connected Contract when signer is available, otherwise undefined.
 * Use this for write operations. For read-only you can use wagmi's public client.
 */
export function useSwapContract(): Contract | undefined {
  const signer = useOptionalSigner();

  return useMemo(() => {
    try {
      const abi = (nftNftSwapAllowlistJson as any).abi ?? nftNftSwapAllowlistJson;
      if (!abi) {
        console.warn("Swap ABI not found");
        return undefined;
      }
      if (!signer) return undefined;
      return new Contract(SWAP_CONTRACT_ADDRESS, abi, signer);
    } catch (err) {
      console.error("useSwapContract error:", err);
      return undefined;
    }
  }, [signer]);
}
