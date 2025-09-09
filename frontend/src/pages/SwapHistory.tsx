// src/pages/SwapHistory.tsx
import React from "react";

export default function SwapHistory(): JSX.Element {
  // Simple placeholder data to avoid runtime crashes
  const placeholder = [
    { id: 1, proposer: "0x123…abc", proposerNFT: "0xNFT1", tokenId: "42", status: "Pending" },
    { id: 2, proposer: "0x456…def", proposerNFT: "0xNFT2", tokenId: "7", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-foxDark text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foxOrange">Swap History</h1>
          <p className="text-foxGray mt-2">Your past and pending NFT swaps (placeholder)</p>
        </header>

        <section className="bg-foxPurple/60 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent swaps</h2>

          <div className="space-y-4">
            {placeholder.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between bg-foxPurple/30 p-4 rounded-xl"
              >
                <div>
                  <div className="text-sm text-foxGray">Proposer</div>
                  <div className="font-mono text-sm">{s.proposer}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-foxGray">NFT</div>
                  <div className="font-medium">{s.proposerNFT}</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-foxGray">Token ID</div>
                  <div className="font-medium">{s.tokenId}</div>
                </div>

                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm ${s.status === "Pending" ? "bg-yellow-500 text-black" : "bg-green-500 text-black"}`}>
                    {s.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 text-center text-foxGray">
          <small>Swap history is currently a placeholder — real data will appear here after integration.</small>
        </footer>
      </div>
    </div>
  );
}
