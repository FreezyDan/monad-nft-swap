// src/pages/VerifiedCollectionsPage.tsx
import React, { useMemo } from "react";
import { useContractRead } from "wagmi";
import nftAllowlistJson from "../contracts/abis/NftNftSwapAllowlist.json";
import { Link } from "react-router-dom";

const ALLOWLIST_CONTRACT_ADDRESS = "0x23e1031EAFBdd7DbEB8F1E7b18FD08D4878aD691"; // same address as dashboard

export default function VerifiedCollectionsPage() {
  const { data, isLoading, isError } = useContractRead({
    address: ALLOWLIST_CONTRACT_ADDRESS as `0x${string}`,
    abi: (nftAllowlistJson as any).abi ?? nftAllowlistJson,
    functionName: "getAllowedCollections",
    watch: false,
  });

  const collections = useMemo(() => {
    if (!data) return [];
    try {
      if (Array.isArray(data) && data.length >= 2) {
        const addrs = Array.isArray(data[0]) ? data[0] : [];
        const names = Array.isArray(data[1]) ? data[1] : [];
        return addrs.map((a: string, i: number) => ({ address: a, name: typeof names[i] === "string" ? names[i] : undefined }));
      }
      const anyData = data as any;
      if (anyData && (anyData[0] || anyData[1])) {
        const addrs = Array.isArray(anyData[0]) ? anyData[0] : [];
        const names = Array.isArray(anyData[1]) ? anyData[1] : [];
        return addrs.map((a: string, i: number) => ({ address: a, name: typeof names[i] === "string" ? names[i] : undefined }));
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [data]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-300 underline">← Back to Swap</Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Verified collections</h1>
      <p className="text-gray-400 mb-6">These collections are verified and allowed for swaps on Monad Testnet.</p>

      {isLoading && <div className="text-gray-400">Loading...</div>}
      {isError && <div className="text-red-400">Failed to fetch collections.</div>}

      <div className="bg-[#120612] border border-white/6 rounded-lg p-6">
        {collections.length === 0 ? (
          <div className="text-gray-400">No verified collections found.</div>
        ) : (
          <ul className="space-y-4">
            {collections.map((c) => (
              <li key={c.address} className="p-3 border border-white/4 rounded hover:bg-white/2">
                <div className="font-semibold text-white">{c.name ?? "Unnamed collection"}</div>
                <div className="text-sm text-gray-400 break-all">{c.address}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
