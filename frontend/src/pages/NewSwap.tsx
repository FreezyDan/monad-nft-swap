// src/pages/NewSwap.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function NewSwap(): JSX.Element {
  const [counterparty, setCounterparty] = useState("");

  // very light validation: 0x-address, @twitter, or *.mon
  const isValid = useMemo(() => {
    const v = counterparty.trim();
    const isEthAddress = /^0x[a-fA-F0-9]{40}$/.test(v);
    const isTwitter = /^@[A-Za-z0-9_]{1,15}$/.test(v);
    const isMonDomain = /.+\.mon$/i.test(v);
    return isEthAddress || isTwitter || isMonDomain;
  }, [counterparty]);

  function handleLoadNfts() {
    alert(`Loading NFTs for: ${counterparty}`);
  }

  // keep your palette
  const ORANGE = "#FF8A2B";
  const DISABLED_GRADIENT =
    "linear-gradient(180deg, rgba(34,24,32,1) 0%, rgba(21,14,20,1) 100%)";
  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";

  // --- inline styles to guarantee centering ---
  const pageSection: React.CSSProperties = { padding: "40px 16px" };

  // The **narrow purple box** directly under the subtitle (centered)
  const cardWrap: React.CSSProperties = {
    maxWidth: 560,       // <- adjust this number tighter/wider if you like
    width: "100%",
    margin: "0 auto",
  };

  const card: React.CSSProperties = {
    background: CARD_GRADIENT,
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
  };

  const h3: React.CSSProperties = {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: 0.2,
    color: "var(--foxOrange, #FF8A2B)",
    margin: 0,
  };

  const sub: React.CSSProperties = {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
    marginBottom: 0,
    lineHeight: 1.5,
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: 80,
    borderRadius: 40,
    padding: "0 24px",
    background: "rgba(0,0,0,0.25)",
    border: `4px solid ${ORANGE}`,
    color: "#fff",
    fontSize: 22,
    fontWeight: 500,
    outline: "none",
    boxShadow:
      "0 20px 0 rgba(0,0,0,0.35), 0 0 0 3px rgba(0,0,0,0.15) inset, 0 0 36px rgba(255,138,43,0.2)",
  };

  const loadBtnEnabled: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: 80,
    borderRadius: 40,
    fontSize: 22,
    fontWeight: 800,
  };

  const loadBtnDisabled: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: 80,
    borderRadius: 40,
    fontSize: 22,
    fontWeight: 800,
    background: DISABLED_GRADIENT,
    color: "rgba(255,255,255,0.55)",
    boxShadow: "0 18px 26px rgba(0,0,0,0.55), 0 8px 0 rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "not-allowed",
  };

  const backWrap: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
  };

  const backBtn: React.CSSProperties = {
    textDecoration: "none",
    height: 56,
    borderRadius: 28,
    padding: "0 24px",
    fontSize: "1.05rem",
    fontWeight: 800,
  };

  return (
    <div className="swap-page">
      {/* Hero (unchanged; your global styles handle this) */}
      <div className="swap-hero">
        <div className="swap-hero-inner" style={{ textAlign: "center" }}>
          <h2 className="site-title">Start a New Swap</h2>
          <p className="site-sub">Enter a counterparty and we'll load their NFTs for selection.</p>
        </div>
      </div>

      {/* Centered narrow card */}
      <section style={pageSection}>
        <div style={cardWrap}>
          <div style={card}>
            <h3 style={h3}>Which wallet are you swapping with?</h3>
            <p style={sub}>
              Enter the wallet address you're swapping with, and we'll go ahead and load their NFTs
              for your selection.
            </p>

            <div style={{ marginTop: 24, display: "grid", rowGap: 24 }}>
              <input
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValid) handleLoadNfts();
                }}
                placeholder="Enter wallet address, .mon domain or @twitter"
                style={inputStyle}
                autoFocus
              />

              {isValid ? (
                <button onClick={handleLoadNfts} className="cta-primary" style={loadBtnEnabled}>
                  Load NFTs
                </button>
              ) : (
                <button disabled style={loadBtnDisabled}>
                  Load NFTs
                </button>
              )}

              <div style={backWrap}>
                <Link to="/swap" className="cta-secondary" style={backBtn}>
                  {"\u2190"} Back to Swap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
