// src/pages/Swap.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Swap(): JSX.Element {
  // placeholder pending count - replace with actual data later
  const pendingCount = 0;

  return (
    <div className="swap-page">
      <div className="swap-hero">
        <div className="swap-hero-inner">
          <h2 className="site-title">Monad NFT Swap</h2>
          <p className="site-sub">Swap 1 to 1 with whitelisted verified collections</p>
        </div>
      </div>

      <div className="swap-content container">
        <aside className="left-menu" aria-label="left navigation">
          <nav>
            <ul>
              <li>
                <Link to="/history" className="pill">
                  <span className="pill-icon">⏱</span>
                  <span>My Swap History</span>
                </Link>
              </li>
              <li>
                <Link to="/verified" className="pill">
                  <span className="pill-icon">★</span>
                  <span>Verified Collections</span>
                </Link>
              </li>
              <li>
                <Link to="/scams" className="pill">
                  <span className="pill-icon">⚠️</span>
                  <span>Common Scams</span>
                </Link>
              </li>
              <li>
                <a
                  className="pill"
                  href="https://discord.gg/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="pill-icon">💬</span>
                  <span>Join our Discord</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <section className="right-panel">
          <div className="pending-row">
            <div className="pending-text">You have {pendingCount} pending swaps.</div>

            <div className="cta-wrap">
              <button className="cta-primary" onClick={() => { /* open modal later */ }}>
                INITIATE NEW SWAP
              </button>

              <button className="cta-secondary" disabled>
                VIEW PENDING SWAPS
              </button>
            </div>
          </div>

          <p className="help-text">
            Connect your wallet and click <strong>INITIATE NEW SWAP</strong> to propose a trade.
          </p>
        </section>
      </div>
    </div>
  );
}
