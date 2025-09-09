// src/pages/NewSwap.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function NewSwap(): JSX.Element {
  const [counterparty, setCounterparty] = useState("");

  // light validation: 0x-address, @twitter, or *.mon
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

  // palette to match your existing UI
  const ORANGE = "#FF8A2B";
  const DISABLED_GRADIENT =
    "linear-gradient(180deg, rgba(34,24,32,1) 0%, rgba(21,14,20,1) 100%)";
  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";

  return (
    <div className="swap-page">
      {/* Hero/header area */}
      <div className="swap-hero">
        <div className="swap-hero-inner">
          <h2 className="site-title">Start a New Swap</h2>
          <p className="site-sub">Enter a counterparty and we’ll load their NFTs for selection.</p>
        </div>
      </div>

      {/* Centered page body */}
      <div className="px-4 py-12 flex justify-center">
        {/* Max width expanded and centered */}
        <div className="w-full max-w-[1000px]">
          <div
            className="rounded-[32px] p-10 shadow-2xl"
            style={{ background: CARD_GRADIENT }}
          >
            <h3 className="text-center text-3xl font-extrabold tracking-wide text-foxOrange mb-3">
              Which wallet are you swapping with?
            </h3>
            <p className="text-center text-white/80 mb-10">
              Enter the wallet address you're swapping with, and we'll go ahead and load their NFTs
              for your selection.
            </p>

            {/* BIG centered input + button */}
            <div className="space-y-6">
              {/* Orange-outlined pill input */}
              <input
                value={counterparty}
                onChange={(e) => setCounterparty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValid) handleLoadNfts();
                }}
                placeholder="Enter wallet address, .mon domain or @twitter"
                className="
                  block w-full h-20 rounded-[40px]
                  px-8 text-white text-2xl font-medium placeholder-white/70
                  mx-auto
                "
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: `4px solid ${ORANGE}`,
                  boxShadow:
                    `0 20px 0 rgba(0,0,0,0.35), 0 0 0 3px rgba(0,0,0,0.15) inset, 0 0 36px ${ORANGE}33`,
                  outline: "none",
                }}
                autoFocus
              />

              {/* Load NFTs button (disabled state matches 'View Pending Swaps') */}
              {isValid ? (
                <button
                  onClick={handleLoadNfts}
                  className="block w-full h-20 rounded-[40px] cta-primary text-2xl font-extrabold"
                >
                  Load NFTs
                </button>
              ) : (
                <button
                  disabled
                  className="block w-full h-20 rounded-[40px] text-2xl font-extrabold tracking-wide"
                  style={{
                    background: DISABLED_GRADIENT,
                    color: "rgba(255,255,255,0.55)",
                    boxShadow: "0 18px 26px rgba(0,0,0,0.55), 0 8px 0 rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "not-allowed",
                  }}
                >
                  Load NFTs
                </button>
              )}
            </div>

            {/* Back button */}
            <div className="mt-10 flex justify-center">
              <Link
                to="/swap"
                className="cta-secondary inline-flex items-center justify-center"
                style={{
                  textDecoration: "none",
                  height: "64px",
                  borderRadius: 32,
                  paddingInline: 28,
                  fontSize: "1.125rem",
                  fontWeight: 800,
                }}
              >
                ← Back to Swap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
