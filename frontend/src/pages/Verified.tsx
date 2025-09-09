// src/pages/Verified.tsx
import React, { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import type { Address } from "viem";

const SWAP_CONTRACT_ADDRESS = "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691";

export default function Verified() {
  const publicClient = usePublicClient?.();
  const [collections, setCollections] = useState<{ address: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllowed() {
      setLoading(true);
      setError(null);
      try {
        if (!publicClient) throw new Error("publicClient not available");

        const abi = [
          {
            inputs: [],
            name: "getAllowedCollections",
            outputs: [
              { internalType: "address[]", name: "", type: "address[]" },
              { internalType: "string[]", name: "", type: "string[]" },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];

        const res: any = await (publicClient as any).readContract?.({
          address: SWAP_CONTRACT_ADDRESS as Address,
          abi,
          functionName: "getAllowedCollections",
          args: [],
        });

        let addresses: string[] = [];
        let names: string[] = [];

        if (Array.isArray(res)) {
          addresses = Array.isArray(res[0]) ? res[0] : [];
          names = Array.isArray(res[1]) ? res[1] : [];
        } else if (res && res[0] && res[1]) {
          addresses = Array.isArray(res[0]) ? res[0] : [];
          names = Array.isArray(res[1]) ? res[1] : [];
        }

        const coll = addresses.map((a, i) => ({ address: a, name: names[i] ?? "Unnamed" }));
        setCollections(coll);
      } catch (err: any) {
        console.error("Failed to fetch allowed collections:", err);
        setError(err?.message ?? String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchAllowed();
  }, [publicClient]);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <section className="py-12">
        <h2 className="text-3xl font-bold text-foxOrange mb-4 text-center">Verified Collections</h2>

        {loading && <p className="text-center text-foxGray">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {collections.length === 0 && !loading ? (
            <div className="col-span-full text-center text-foxGray">No verified collections found.</div>
          ) : (
            collections.map((c) => (
              <div key={c.address} className="bg-foxCard p-4 rounded-xl shadow-md">
                <div className="h-40 bg-gradient-to-br from-foxPurple/40 to-foxOrange/10 rounded-md flex items-center justify-center mb-3">
                  <span className="text-foxOrange font-bold">{c.name?.slice(0, 18) || "Collection"}</span>
                </div>
                <div className="text-sm text-foxGray break-all">{c.address}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
