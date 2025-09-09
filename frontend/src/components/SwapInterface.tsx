// src/components/SwapInterface.tsx
import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { useAccount } from "wagmi";

type Props = { contract: Contract | null | undefined };

type Swap = {
  swapId: number;
  proposer: string;
  proposerNFT: string;
  proposerTokenId: number;
  targetNFT: string;
  targetTokenId: number;
  active: boolean;
};

export default function SwapInterface({ contract }: Props) {
  const { address } = useAccount();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [proposerNFT, setProposerNFT] = useState("");
  const [proposerTokenId, setProposerTokenId] = useState<number | "">("");
  const [targetNFT, setTargetNFT] = useState("");
  const [targetTokenId, setTargetTokenId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const fetchSwaps = async () => {
    if (!contract) return;
    try {
      const countBn = await contract.swapCount();
      const count = Number(countBn.toString());
      const arr: Swap[] = [];
      for (let i = 0; i < count; i++) {
        const s = await contract.swaps(i);
        arr.push({
          swapId: i,
          proposer: s.proposer,
          proposerNFT: s.proposerNFT,
          proposerTokenId: Number(s.proposerTokenId.toString()),
          targetNFT: s.targetNFT,
          targetTokenId: Number(s.targetTokenId.toString()),
          active: s.active,
        });
      }
      setSwaps(arr.reverse());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const proposeSwap = async () => {
    if (!contract || !address) return alert("Connect wallet and ensure contract is available.");
    try {
      setLoading(true);
      const tx = await contract.proposeSwap(proposerNFT, Number(proposerTokenId), targetNFT, Number(targetTokenId));
      await tx.wait();
      await fetchSwaps();
      setProposerNFT("");
      setProposerTokenId("");
      setTargetNFT("");
      setTargetTokenId("");
      alert("Swap proposed!");
    } catch (err: any) {
      console.error(err);
      alert("Propose failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const cancelSwap = async (id: number) => {
    if (!contract) return;
    try {
      const tx = await contract.cancelSwap(id);
      await tx.wait();
      await fetchSwaps();
    } catch (e) {
      console.error(e);
    }
  };

  const acceptSwap = async (id: number) => {
    if (!contract) return;
    try {
      const tx = await contract.acceptSwap(id);
      await tx.wait();
      await fetchSwaps();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="rounded-2xl bg-foxCard p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Propose a Swap</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input className="p-2 rounded bg-foxInput text-black" placeholder="Your NFT address" value={proposerNFT} onChange={(e) => setProposerNFT(e.target.value)} />
        <input className="p-2 rounded bg-foxInput text-black" placeholder="Your Token ID" type="number" value={proposerTokenId} onChange={(e) => setProposerTokenId(Number(e.target.value))} />
        <input className="p-2 rounded bg-foxInput text-black" placeholder="Target NFT address" value={targetNFT} onChange={(e) => setTargetNFT(e.target.value)} />
        <input className="p-2 rounded bg-foxInput text-black" placeholder="Target Token ID" type="number" value={targetTokenId} onChange={(e) => setTargetTokenId(Number(e.target.value))} />
      </div>

      <div className="flex gap-3">
        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-foxOrange to-foxOrangeAlt shadow" onClick={proposeSwap} disabled={loading}>
          {loading ? "Proposing..." : "Propose"}
        </button>
        <button className="px-6 py-2 rounded-full border border-foxGray text-foxGray" onClick={fetchSwaps}>
          Refresh
        </button>
      </div>

      <hr className="my-6 border-foxPurple/40" />

      <h4 className="mb-3 font-semibold">Active Swaps</h4>
      <div className="space-y-3">
        {swaps.filter(s => s.active).length === 0 && <div className="text-foxGray">No active swaps</div>}
        {swaps.filter(s => s.active).map(s => (
          <div key={s.swapId} className="flex items-center justify-between bg-foxBgAlt p-3 rounded">
            <div>
              <div className="text-sm">
                <strong>#{s.swapId}</strong> — {s.proposer} asks {s.proposerNFT} #{s.proposerTokenId} → {s.targetNFT} #{s.targetTokenId}
              </div>
            </div>
            <div className="flex gap-2">
              {s.proposer.toLowerCase() === address?.toLowerCase() ? (
                <button className="px-3 py-1 rounded bg-foxOrange text-black" onClick={() => cancelSwap(s.swapId)}>Cancel</button>
              ) : (
                <button className="px-3 py-1 rounded bg-foxPurple text-white" onClick={() => acceptSwap(s.swapId)}>Accept</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
