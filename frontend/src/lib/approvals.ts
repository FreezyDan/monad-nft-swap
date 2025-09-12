// src/lib/approvals.ts
import type { Address } from "viem";
import { ERC721_ENUMERABLE_ABI } from "../abi/erc721";

export async function ensureOperatorApprovedFor721(params: {
  owner: Address;
  operator: Address;           // swap contract
  tokenContracts: Address[];   // unique ERC721 contract addresses you will offer
  walletClient: any;           // from wagmi useWalletClient()
  publicClient: any;           // from wagmi or viem public client
}) {
  const { owner, operator, tokenContracts, walletClient, publicClient } = params;
  // de-dup contracts
  const uniq = Array.from(new Set(tokenContracts.map((a) => a.toLowerCase()))) as Address[];

  for (const c of uniq) {
    const approved = await publicClient.readContract({
      address: c,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "isApprovedForAll",
      args: [owner, operator],
    });
    if (!approved) {
      await walletClient.writeContract({
        address: c,
        abi: ERC721_ENUMERABLE_ABI,
        functionName: "setApprovalForAll",
        args: [operator, true],
      });
    }
  }
}
