// src/components/NftGrid.tsx
import React from "react";

type NftItem = {
  id: string;
  image?: string;
  name?: string;
  collection?: string;
};

const demoItems: NftItem[] = []; // keep empty so it doesn't make network calls

const NftGrid: React.FC<{ items?: NftItem[] }> = ({ items = demoItems }) => {
  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Available Whitelisted NFTs</h2>
        <p className="text-sm text-gray-300">
          These are the whitelisted NFT collections for swaps. Select an NFT to start a swap.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-8 border rounded-lg bg-black/40 text-center">
          <p className="text-gray-300 mb-4">
            No NFTs loaded yet. The grid is intentionally simplified — it won’t fetch anything
            until you enable whitelisted collection fetching.
          </p>
          <p className="text-sm text-gray-400">
            To enable, add your contract ABI and a hook to fetch `getAllowedCollections()` from the
            NFT-NFT swap contract.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="bg-black/40 rounded-lg p-4">
              <div className="h-48 bg-gray-800 rounded mb-3 flex items-center justify-center">
                {it.image ? (
                  <img src={it.image} alt={it.name} className="h-full object-contain" />
                ) : (
                  <span className="text-gray-500">No image</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{it.name ?? `#${it.id}`}</h3>
                <p className="text-sm text-gray-400">{it.collection ?? "Unknown collection"}</p>
                <button className="mt-3 px-3 py-1 rounded bg-purple-600 text-white text-sm">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NftGrid;
