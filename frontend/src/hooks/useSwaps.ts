// src/hooks/useSwaps.ts
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import {
  getRpcProvider,
  NFT_NFT_SWAP_ADDRESS,
  NFT_TOKEN_SWAP_ADDRESS,
  NFT_NFT_SWAP_ABI,
  NFT_TOKEN_SWAP_ABI,
} from "../contracts";

export type UnifiedSwap = {
  id: string;
  source: "NFT-NFT" | "NFT-TOKEN";
  raw: any;
  summary: {
    party1: string;
    party2?: string;
    offered: string;
    requested: string;
    status?: string;
  };
};

export function useSwaps() {
  const [swaps, setSwaps] = useState<UnifiedSwap[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    try {
      const provider = getRpcProvider();
      const nftNft = new ethers.Contract(NFT_NFT_SWAP_ADDRESS, NFT_NFT_SWAP_ABI, provider);
      const nftToken = new ethers.Contract(NFT_TOKEN_SWAP_ADDRESS, NFT_TOKEN_SWAP_ABI, provider);

      // 1) NFT-NFT
      const countBn1: bigint = await nftNft.swapCount();
      const count1 = Number(countBn1.toString());
      const out: UnifiedSwap[] = [];
      for (let i = 0; i < count1; i++) {
        try {
          const s = await nftNft.swaps(i);
          // s: (proposer, proposerNFT, proposerTokenId, targetNFT, targetTokenId, active)
          const active = s[5];
          const id = `${i}`;
          out.push({
            id,
            source: "NFT-NFT",
            raw: s,
            summary: {
              party1: s[0],
              party2: undefined,
              offered: `${s[1]} #${s[2].toString()}`,
              requested: `${s[3]} #${s[4].toString()}`,
              status: active ? "Open" : "Closed",
            },
          });
        } catch { /* skip */ }
      }

      // 2) NFT-TOKEN
      const countBn2: bigint = await nftToken.swapCount();
      const count2 = Number(countBn2.toString());
      for (let i = 1; i <= count2; i++) {
        try {
          const s = await nftToken.swaps(i);
          // s: party1, party2, side1, side2, status, expiry, party1Deposited, party2Deposited
          const id = `T-${i}`;
          // format offered/requested
          const side1 = s[2];
          const side2 = s[3];
          const offered = side1.nft !== ethers.ZeroAddress ? `${side1.nft} #${side1.tokenId.toString()}` : `${side1.amount?.toString() || "0"} of ${side1.token}`;
          const requested = side2.nft !== ethers.ZeroAddress ? `${side2.nft} #${side2.tokenId.toString()}` : `${side2.amount?.toString() || "0"} of ${side2.token}`;
          const statusNum = Number(s[4]);
          const statusMap: Record<number,string> = {0:"Open",1:"Cancelled",2:"Completed",3:"Expired"};
          out.push({
            id,
            source: "NFT-TOKEN",
            raw: s,
            summary: {
              party1: s[0],
              party2: s[1],
              offered,
              requested,
              status: statusMap[statusNum] ?? "Unknown",
            }
          });
        } catch { /* skip */ }
      }

      // sort newest first (by numeric/parsing)
      out.sort((a,b) => {
        // try numeric comparison if possible
        const an = parseInt(a.id.replace(/\D/g,'')) || 0;
        const bn = parseInt(b.id.replace(/\D/g,'')) || 0;
        return bn - an;
      });

      setSwaps(out);
    } catch (err) {
      console.error("useSwaps fetch error", err);
      setSwaps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  return { swaps, loading, refresh: fetchSwaps };
}
