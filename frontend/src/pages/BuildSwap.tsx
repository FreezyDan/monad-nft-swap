// src/pages/BuildSwap.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import type { NFTItem } from "../lib/nft";
import { fetchNftsForAddress } from "../lib/nft";
import { VERIFIED_COLLECTIONS } from "../config/collections";
import { ensureOperatorApprovedFor721 } from "../lib/approvals";
import { NFT_SWAP_ABI } from "../abi/NftSwap";
import { SWAP_CONTRACT } from "../config/addresses";

export default function BuildSwap(): JSX.Element {
  const { state } = useLocation() as { state: { counterparty: `0x${string}`, theirSelections: NFTItem[] } };
  const counterparty = state?.counterparty;
  const theirSelections = state?.theirSelections || [];

  const { address: myAddress } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(true);
  const [myNfts, setMyNfts] = useState<NFTItem[]>([]);
  const [selMine, setSelMine] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);

  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";
  const ORANGE = "#FF8A2B";
  const DISABLED_GRADIENT = "linear-gradient(180deg, rgba(34,24,32,1) 0%, rgba(21,14,20,1) 100%)";

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!myAddress) return;
      setLoading(true);
      try {
        const mine = await fetchNftsForAddress(myAddress as `0x${string}`, VERIFIED_COLLECTIONS);
        if (mounted) setMyNfts(mine);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [myAddress]);

  const myByCollection = useMemo(() => {
    const map = new Map<string, NFTItem[]>();
    for (const it of myNfts) {
      const k = it.collectionName || "Collection";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    }
    return Array.from(map.entries());
  }, [myNfts]);

  function toggleMine(key: string) {
    setSelMine((s) => ({ ...s, [key]: !s[key] }));
  }

  async function handleCreateSwap() {
    if (!walletClient || !publicClient) return alert("Connect your wallet first.");
    if (!counterparty) return alert("Missing counterparty.");
    const chosenMine = myNfts.filter((it) => selMine[`${it.contract}:${it.tokenId}`]);
    if (chosenMine.length === 0) return alert("Select at least one of your NFTs to offer.");

    // Prepare arrays
    const offeredTokens = chosenMine.map((it) => it.contract);
    const offeredTokenIds = chosenMine.map((it) => BigInt(it.tokenId));
    const requestedTokens = theirSelections.map((it) => it.contract);
    const requestedTokenIds = theirSelections.map((it) => BigInt(it.tokenId));
    const deadline = 0n; // you can add a picker later

    try {
      setCreating(true);

      // Ensure operator approval for each ERC721 collection you're offering
      await ensureOperatorApprovedFor721({
        owner: myAddress as `0x${string}`,
        operator: SWAP_CONTRACT,
        tokenContracts: offeredTokens,
        walletClient,
        publicClient,
      });

      // createSwap(counterparty, offered[], offeredIds[], requested[], requestedIds[], deadline)
      const hash = await walletClient.writeContract({
        address: SWAP_CONTRACT,
        abi: NFT_SWAP_ABI,
        functionName: "createSwap",
        args: [counterparty, offeredTokens, offeredTokenIds, requestedTokens, requestedTokenIds, deadline],
      });

      alert("Swap created! Tx hash:\n" + hash);
      // TODO: route to a "Swap Created" page or show the new swapId by reading logs or calling nextSwapId-1.
    } catch (e: any) {
      console.error(e);
      alert("Create swap failed:\n" + (e?.message || e));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="swap-page">
      <div className="swap-hero">
        <div className="swap-hero-inner" style={{ textAlign: "center" }}>
          <h2 className="site-title">Build Your Side of the Swap</h2>
          <p className="site-sub">Pick the NFT(s) you will offer. Your counterparty will accept and pay the 0.1 MON fee.</p>
        </div>
      </div>

      {/* Summary of "their" selection */}
      <section style={{ padding: "24px 16px 0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ background: CARD_GRADIENT, borderRadius: 16, padding: 16, marginBottom: 18 }}>
            <div style={{ color: "#fff", fontWeight: 800, marginBottom: 8 }}>
              You’re requesting ({theirSelections.length}) from {counterparty?.slice(0, 6)}…{counterparty?.slice(-4)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {theirSelections.map((it) => (
                <div key={`${it.contract}:${it.tokenId}`} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
                  {it.image ? <img src={it.image} alt={it.name} style={{ width: "100%", height: 120, objectFit: "cover" }} /> : <div style={{ height: 120 }} />}
                  <div style={{ padding: 8, color: "#fff", fontSize: 12, fontWeight: 700 }}>{it.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your NFTs to offer */}
      <section style={{ padding: "0 16px 40px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ color: "#a88ed6", fontSize: 28, fontWeight: 900, letterSpacing: 1, marginBottom: 12 }}>
            YOUR NFTS
          </div>

          {!myAddress ? (
            <div style={{ color: "rgba(255,255,255,0.7)" }}>Connect your wallet to load your NFTs.</div>
          ) : loading ? (
            <div style={{ color: "rgba(255,255,255,0.7)" }}>Loading your NFTs…</div>
          ) : myByCollection.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.7)" }}>No NFTs found in verified collections for your wallet.</div>
          ) : (
            myByCollection.map(([coll, items]) => (
              <div key={coll} style={{ background: CARD_GRADIENT, borderRadius: 20, padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", marginBottom: 18 }}>
                <div style={{ color: "#fff", fontWeight: 800, marginBottom: 8 }}>{coll} ({items.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                  {items.map((nft) => {
                    const key = `${nft.contract}:${nft.tokenId}`;
                    const isSel = !!selMine[key];
                    return (
                      <button key={key} onClick={() => toggleMine(key)}
                        style={{ textAlign: "left", background: "rgba(0,0,0,0.25)", borderRadius: 16,
                          border: isSel ? `2px solid ${ORANGE}` : "1px solid rgba(255,255,255,0.1)",
                          overflow: "hidden", boxShadow: isSel ? "0 14px 30px rgba(0,0,0,0.5), 0 0 24px rgba(255,138,43,0.25)" : "0 14px 30px rgba(0,0,0,0.35)" }}>
                        {nft.image ? (
                          <img src={nft.image} alt={nft.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                        ) : <div style={{ width: "100%", height: 160 }} />}
                        <div style={{ padding: "10px 12px", color: "#fff", fontWeight: 800, fontSize: 12 }}>{nft.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <button
              disabled={creating || Object.values(selMine).every((v) => !v)}
              onClick={handleCreateSwap}
              className={creating || Object.values(selMine).every((v) => !v) ? "" : "cta-primary"}
              style={
                creating || Object.values(selMine).every((v) => !v)
                  ? { height: 56, padding: "0 28px", borderRadius: 28, fontWeight: 800, fontSize: 18,
                      background: DISABLED_GRADIENT, color: "rgba(255,255,255,0.7)", boxShadow: "0 10px 20px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)" }
                  : { height: 56, padding: "0 28px", borderRadius: 28, fontWeight: 800, fontSize: 18 }
              }
            >
              {creating ? "CREATING…" : "CREATE SWAP"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Link to="/swap/select" state={{ addr: counterparty }} className="cta-secondary"
              style={{ textDecoration: "none", height: 56, borderRadius: 28, padding: "0 24px", fontSize: "1.05rem", fontWeight: 800 }}>
              {"\u2190"} Back
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
