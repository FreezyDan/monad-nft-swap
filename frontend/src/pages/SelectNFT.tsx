// src/pages/SelectNFT.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NFT = {
  id: string;         // token id
  name: string;       // display name
  image: string;      // image url
  collection: string; // collection name
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SelectNFT(): JSX.Element {
  const query = useQuery();
  const navigate = useNavigate();
  const inputAddr = query.get("addr") || "";

  // TODO: Replace with your real resolver for .mon or @twitter
  const resolved = useMemo(() => inputAddr.trim(), [inputAddr]);

  // Demo/placeholder fetch. Replace with real Monad NFT fetch later.
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    async function fetchNfts() {
      setLoading(true);
      // stubbed data (3 items) – swap with chain call
      const demo: NFT[] = [
        {
          id: "1301",
          name: "#1301",
          image: "https://picsum.photos/seed/monad1301/300/300",
          collection: "Retardio Cousins",
        },
        {
          id: "1349",
          name: "#1349",
          image: "https://picsum.photos/seed/monad1349/300/300",
          collection: "Retardio Cousins",
        },
        {
          id: "4295",
          name: "#4295",
          image: "https://picsum.photos/seed/monad4295/300/300",
          collection: "Retardio Cousins",
        },
      ];
      // simulate latency
      await new Promise((r) => setTimeout(r, 300));
      if (mounted) {
        setNfts(demo);
        setLoading(false);
      }
    }
    fetchNfts();
    return () => {
      mounted = false;
    };
  }, [resolved]);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  const ORANGE = "#FF8A2B";
  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";
  const DISABLED_GRADIENT =
    "linear-gradient(180deg, rgba(34,24,32,1) 0%, rgba(21,14,20,1) 100%)";

  return (
    <div className="swap-page">
      {/* Title */}
      <div className="swap-hero">
        <div className="swap-hero-inner" style={{ textAlign: "center" }}>
          <h2 className="site-title">Which NFT Does Your Heart Desire?</h2>
          <p className="site-sub">Select the NFT(s) that you wish to receive.</p>
        </div>
      </div>

      {/* Selection header box */}
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

            {/* Replaces “Receive SOL Instead” with a GRAYED OUT pill */}
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
              Browsing wallet: <span style={{ fontFamily: "monospace" }}>{resolved}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tokens filter bar (stubbed) */}
      <section style={{ padding: "24px 16px 0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ color: "#a88ed6", fontSize: 28, fontWeight: 900, letterSpacing: 1 }}>
            THEIR TOKENS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 80px", gap: 12, marginTop: 10 }}>
            <input
              placeholder="Select..."
              style={{
                height: 46,
                borderRadius: 12,
                padding: "0 14px",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            />
            <input
              placeholder="Amount"
              style={{
                height: 46,
                borderRadius: 12,
                padding: "0 14px",
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            />
            <button
              style={{
                height: 46,
                borderRadius: 12,
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              disabled
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* NFT Grid */}
      <section style={{ padding: "24px 16px 40px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ color: "#a88ed6", fontSize: 28, fontWeight: 900, letterSpacing: 1, marginBottom: 12 }}>
            THEIR NFTS
          </div>

          <div
            style={{
              background: CARD_GRADIENT,
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* Collection header (stub) */}
            <div style={{ color: "#fff", fontWeight: 800, marginBottom: 8 }}>
              Retardio Cousins ({nfts.length})
            </div>

            {loading ? (
              <div style={{ color: "rgba(255,255,255,0.6)", padding: 16 }}>Loading NFTs…</div>
            ) : nfts.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.6)", padding: 16 }}>No NFTs found for this wallet.</div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                {nfts.map((nft) => {
                  const isSel = !!selected[nft.id];
                  return (
                    <button
                      key={nft.id}
                      onClick={() => toggle(nft.id)}
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
                      <img
                        src={nft.image}
                        alt={nft.name}
                        style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                      />
                      <div style={{ padding: "10px 12px", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                        {nft.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer actions */}
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
