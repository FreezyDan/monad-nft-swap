// src/pages/MySwapHistoryPage.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function MySwapHistoryPage() {
  // Placeholder: wire to on-chain swaps + indexing later
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-300 underline">← Back to Swap</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">My Swap History</h1>
      <p className="text-gray-400 mb-6">This page will show swaps you proposed or accepted. (Wire to on-chain data / subgraph.)</p>

      <div className="bg-[#120612] border border-white/6 rounded-lg p-6">
        <div className="text-gray-400">No swaps yet. Once you create swaps they'll appear here.</div>
      </div>
    </div>
  );
}
