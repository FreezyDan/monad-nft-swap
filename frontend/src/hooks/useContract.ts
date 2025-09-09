// src/hooks/useContract.ts
import { useMemo } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

const MONAD_RPC = "https://testnet-rpc.monad.xyz";

/**
 * Hook to create an ethers.Contract instance that:
 * - Uses injected wallet signer when available (window.ethereum)
 * - Falls back to readonly JsonRpcProvider otherwise
 *
 * @param address contract address
 * @param abi contract ABI (JSON)
 */
export function useContract(address: string, abi: any) {
  const { address: connectedAddress } = useAccount();

  return useMemo(() => {
    if (!address || !abi) return null;

    // Try to use injected provider (MetaMask/WalletConnect)
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
        // If the user is connected in wallet, we can get signer
        const signer = connectedAddress ? web3Provider.getSigner() : undefined;
        const contract = signer ? new ethers.Contract(address, abi, signer) : new ethers.Contract(address, abi, web3Provider);
        return contract;
      }
    } catch (err) {
      console.warn("useContract: error creating signer-based contract, falling back to JsonRpcProvider", err);
    }

    // Read-only fallback
    const provider = new ethers.providers.JsonRpcProvider(MONAD_RPC);
    return new ethers.Contract(address, abi, provider);
  }, [address, abi, connectedAddress]);
}
