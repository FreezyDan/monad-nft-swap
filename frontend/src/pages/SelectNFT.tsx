// src/pages/SelectNFT.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchNftsForAddress } from "../lib/nft";
import type { NFTItem } from "../lib/nft";
import { VERIFIED_COLLECTIONS } from "../config/collections";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Simple address resolver (0x...). Hook your .mon / @twitter resolver later.
function resolveInputToAddress(raw: string): string | null {
  const v = raw.trim();
  const isHex = /^0x[a-fA-F0-9]{40}$/.test(v);
  if (isHex) return v;
  return null;
}

export default function SelectNFT(): JSX.Element {
  const query = useQuery();
  const inputAddr = query.get("addr") || "";

  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const owner = useMemo(() => resolveInputToAddress(inputAddr), [inputAddr]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        if (!owner) {
          setNfts([]);
        } else {
          const items = await fetchNftsForAddress(owner as `0x${string}`, VERIFIED_COLLECTIONS);
          if (mounted) setNfts(items);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [owner]);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const ORANGE = "#FF8A2B";
  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";
  const DISABLED_GRADIENT =
    "linear-gradient(180deg, rgba(34,24,32,1) 0%, rgba(21,14,20,1) 100%)";

  const byCollection = useMemo(() => {
    const map = new Map<string, NFTItem[]>();
    for (const it of nfts) {
      const k = it.collectionName || "Collection";
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(it);
    }
    return Array.from(map.entries());
  }, [nfts]);

  return (
    <div className="swap-page">
      <div className="swap-hero">
        <div className="swap-hero-inner" style={{ textAlign: "center" }}>
          <h2 className="site-title">Which NFT Does Your Heart Desire?</h2>
          <p className="site-sub">Select the NFT(s) that you wish to receive.</p>
        </div>
      </div>

      {/* Header selection pill (top CTA replaced with a grayed-out "SELECT YOUR NFT") */}
      <section style={{ padding: "24px 16px 0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              border: "2px dashed rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 700, marginBottom: 12 }}>
              {selectedCount} NFT(s) Selected.
            </div>

            <button
              disabled={selectedCount === 0}
              className={selectedCount === 0 ? "" : "cta-primary"}
              style={
                selectedCount === 0
                  ? {
                      height: 56,
                      padding: "0 28px",
                      borderRadius: 28,
                      fontWeight: 800,
                      fontSize: 18,
                      background: DISABLED_GRADIENT,
                      color: "rgba(255,255,255,0.7)",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.45)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      cursor: "not-allowed",
                    }
                  : {
                      height: 56,
                      padding: "0 28px",
                      borderRadius: 28,
                      fontWeight: 800,
                      fontSize: 18,
                    }
              }
            >
              {selectedCount === 0 ? "SELECT YOUR NFT" : "CONTINUE"}
            </button>

            <div style={{ marginTop: 12, color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              Browsing wallet: <span style={{ fontFamily: "monospace" }}>
                {owner ?? "(unsupported input — use 0x address)"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NFT grid */}
      <section style={{ padding: "24px 16px 40px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ color: "#a88ed6", fontSize: 28, fontWeight: 900, letterSpacing: 1, marginBottom: 12 }}>
            THEIR NFTS
          </div>

          {!owner ? (
            <div style={{ color: "rgba(255,255,255,0.7)" }}>
              Please use a 0x wallet address (add your .mon / @twitter resolver later).
            </div>
          ) : (
            <>
              {loading ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>Loading NFTs…</div>
              ) : byCollection.length === 0 ? (
                <div style={{ color: "rgba(255,255,255,0.7)" }}>
                  No NFTs found in verified collections for this wallet.
                </div>
              ) : (
                byCollection.map(([collName, items]) => (
                  <div
                    key={collName}
                    style={{
                      background: CARD_GRADIENT,
                      borderRadius: 20,
                      padding: 16,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                      marginBottom: 18,
                    }}
                  >
                    <div style={{ color: "#fff", fontWeight: 800, marginBottom: 8 }}>
                      {collName} ({items.length})
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: 16,
                      }}
                    >
                      {items.map((nft) => {
                        const key = `${nft.contract}:${nft.tokenId}`;
                        const isSel = !!selected[key];
                        return (
                          <button
                            key={key}
                            onClick={() =>
                              setSelected((s) => ({ ...s, [key]: !s[key] }))
                            }
                            style={{
                              textAlign: "left",
                              background: "rgba(0,0,0,0.25)",
                              borderRadius: 16,
                              border: isSel ? `2px solid ${ORANGE}` : "1px solid rgba(255,255,255,0.1)",
                              overflow: "hidden",
                              boxShadow: isSel
                                ? "0 14px 30px rgba(0,0,0,0.5), 0 0 24px rgba(255,138,43,0.25)"
                                : "0 14px 30px rgba(0,0,0,0.35)",
                            }}
                          >
                            {nft.image ? (
                              <img
                                src={nft.image}
                                alt={nft.name}
                                style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: 160,
                                  display: "grid",
                                  placeItems: "center",
                                  color: "rgba(255,255,255,0.6)",
                                  fontSize: 12,
                                }}
                              >
                                No Image
                              </div>
                            )}
                            <div style={{ padding: "10px 12px", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                              {nft.name}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Link
              to="/swap/new"
              className="cta-secondary"
              style={{
                textDecoration: "none",
                height: 56,
                borderRadius: 28,
                padding: "0 24px",
                fontSize: "1.05rem",
                fontWeight: 800,
              }}
            >
              {"\u2190"} Back
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
