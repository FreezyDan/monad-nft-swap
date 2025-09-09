// src/components/SwapPage.tsx
import React, { useState } from "react";
import SidebarButtons from "./SidebarButtons";
import InitiateSwapModal from "./InitiateSwapModal";
import VerifiedCollections from "./VerifiedCollections";
import SwapHistory from "./SwapHistory";

export default function SwapPage() {
  const [pendingSwaps] = useState<number>(0); // wire to real data later
  const [showInitiate, setShowInitiate] = useState(false);

  // view: 'home' | 'verified' | 'history' | 'scams'
  const [view, setView] = useState<"home" | "verified" | "history" | "scams">("home");

  return (
    <div className="swap-page">
      <div className="swap-hero">
        <h1 className="hero-title">Monad NFT Swap</h1>
        <p className="hero-sub">Swap 1 to 1 with whitelisted verified collections</p>
      </div>

      <div className="swap-body container">
        <div className="left-col">
          <SidebarButtons
            onSelect={(k) => {
              if (k === "discord") {
                window.open("https://discord.gg/", "_blank");
              } else {
                setView(k);
              }
            }}
          />
        </div>

        <div className="right-col">
          {view === "home" && (
            <>
              <div className="pending-info">
                <div className="pending-text">You have <strong>{pendingSwaps}</strong> pending swaps.</div>

                <div className="action-buttons">
                  <button
                    className="btn-primary big"
                    onClick={() => setShowInitiate(true)}
                    aria-label="Initiate new swap"
                  >
                    INITIATE NEW SWAP
                  </button>

                  <button
                    className="btn-secondary big"
                    disabled={pendingSwaps === 0}
                    aria-label="View pending swaps"
                    onClick={() => {
                      /* you can route to pending list or open modal */
                      setView("history");
                    }}
                  >
                    VIEW PENDING SWAPS
                  </button>
                </div>

                <div className="swap-info-block">
                  <p className="muted">
                    Connect your wallet and click <strong>INITIATE NEW SWAP</strong> to propose a trade.
                  </p>
                </div>
              </div>
            </>
          )}

          {view === "verified" && (
            <div style={{ width: "100%" }}>
              <VerifiedCollections />
            </div>
          )}

          {view === "history" && (
            <div style={{ width: "100%" }}>
              <SwapHistory />
            </div>
          )}

          {view === "scams" && (
            <div className="swap-info-block">
              <h2>Common Scams</h2>
              <p className="muted">Be careful of impersonators, phishing links and fake contracts. Always verify addresses.</p>
              <ul>
                <li>Never share your private key or seed phrase</li>
                <li>Check contract addresses on verified sources</li>
                <li>Use small tx amounts first if unsure</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <InitiateSwapModal visible={showInitiate} onClose={() => setShowInitiate(false)} />
    </div>
  );
}
