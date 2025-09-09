// src/hooks/useNftNftSwapContract.ts
import { useMemo } from "react";
import { Contract } from "ethers";
import { useSigner } from "wagmi";
import { NFT_NFT_SWAP_ADDRESS, NftNftSwapAbi } from "../contracts/nftSwapContracts";

export function useNftNftSwapContract() {
  const { data: signer } = useSigner(); // wagmi v2 hook
  return useMemo(() => {
    if (!signer) return null;
    // signer could be a SignerWithProvider; ethers.Contract accepts signer directly
    return new Contract(NFT_NFT_SWAP_ADDRESS, NftNftSwapAbi, signer);
  }, [signer]);
}

export default useNftNftSwapContract;
