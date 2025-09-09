// src/pages/CommonScamsPage.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function CommonScamsPage() {
  const examples = [
    { title: "Never send your private key", desc: "We will never ask for your private key." },
    { title: "Beware fake marketplaces", desc: "Only use trusted marketplaces and verified contracts." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-300 underline">← Back to Swap</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Common Scams</h1>
      <p className="text-gray-400 mb-6">Guidance to help you avoid common scams when swapping NFTs.</p>

      <div className="bg-[#120612] border border-white/6 rounded-lg p-6 space-y-4">
        {examples.map((e) => (
          <div key={e.title}>
            <div className="font-semibold text-white">{e.title}</div>
            <div className="text-sm text-gray-400">{e.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
