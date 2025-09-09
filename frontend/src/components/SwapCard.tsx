// src/components/SwapCard.tsx
import React from "react";

type Props = {
  swap: any;
  onDeposit?: (s:any)=>void;
  onCancel?: (s:any)=>void;
  onAccept?: (s:any)=>void;
  currentAddress?: string | null;
};

export default function SwapCard({ swap, onDeposit, onCancel, onAccept, currentAddress }: Props) {
  const { id, source, summary } = swap;
  const status = summary.status || "Open";
  const party1Short = summary.party1 ? `${summary.party1.slice(0,6)}...${summary.party1.slice(-4)}` : "—";
  const party2Short = summary.party2 ? `${summary.party2.slice(0,6)}...${summary.party2.slice(-4)}` : "—";

  const isOwner = currentAddress && summary.party1 && currentAddress.toLowerCase() === summary.party1.toLowerCase();

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-4 rounded-2xl shadow-lg border border-zinc-700">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-zinc-400">{source}</div>
          <div className="text-sm font-semibold">Swap {id}</div>
        </div>
        <div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${status === "Open" ? "bg-green-600 text-white" : status === "Completed" ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs text-zinc-400">Offered</div>
        <div className="font-medium">{summary.offered}</div>

        <div className="mt-2 text-xs text-zinc-400">Requested</div>
        <div className="font-medium">{summary.requested}</div>

        <div className="mt-3 text-xs text-zinc-400">Proposer</div>
        <div className="text-sm">{party1Short}</div>
        {summary.party2 && <>
          <div className="mt-1 text-xs text-zinc-400">Counterparty</div>
          <div className="text-sm">{party2Short}</div>
        </>}
      </div>

      <div className="mt-4 flex gap-2">
        {status === "Open" && (
          <>
            {isOwner ? (
              <button onClick={()=>onCancel?.(swap)} className="flex-1 px-3 py-2 bg-yellow-500 rounded text-black font-semibold">Cancel</button>
            ) : (
              <button onClick={()=>onAccept?.(swap)} className="flex-1 px-3 py-2 bg-blue-600 rounded text-white font-semibold">Accept</button>
            )}
            <button onClick={()=>onDeposit?.(swap)} className="px-3 py-2 border border-zinc-600 rounded text-sm">Deposit</button>
          </>
        )}
      </div>
    </div>
  );
}
