// src/pages/NewSwap.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  function handleLoadNfts() {
    // TODO: resolve `.mon` / `@twitter` -> address, then fetch NFTs
    // For now, go to the next step of your flow or keep here:
    // navigate("/swap/select", { state: { counterparty } });
    alert(`Loading NFTs for: ${counterparty}`);
  }

  return (
    <div className="swap-page">
      {/* Hero/Header zone (keeps your visual style) */}
      <div className="swap-hero">
        <div className="swap-hero-inner">
          <h2 className="site-title">Start a New Swap</h2>
          <p className="site-sub">Enter a counterparty and we’ll load their NFTs for selection.</p>
        </div>
      </div>

      {/* Page body */}
      <div className="container max-w-3xl mx-auto px-4 py-10">
        <div
          className="rounded-3xl p-6 sm:p-8 shadow-xl"
          style={{ background: "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)" }}
        >
          <h3 className="text-center text-2xl sm:text-3xl font-extrabold tracking-wide text-foxOrange mb-4">
            Which wallet are you swapping with?
          </h3>
          <p className="text-center text-white/80 mb-6">
            Enter the wallet address you're swapping with, and we'll go ahead and load their NFTs for your selection.
          </p>

          <div className="space-y-4">
            <input
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid) handleLoadNfts();
              }}
              placeholder="Enter wallet address, .mon domain or @twitter"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-mono text-purple-100 placeholder-purple-300/70 focus:outline-none focus:ring-2 focus:ring-foxOrange/60"
              autoFocus
            />

            <button
              onClick={handleLoadNfts}
              disabled={!isValid}
              className={`w-full rounded-[28px] px-6 py-4 text-lg font-extrabold tracking-wide transition
                          ${isValid
                            ? "bg-foxOrange text-black shadow-xl hover:brightness-95"
                            : "bg-white/10 text-white/40 cursor-not-allowed"}`}
            >
              Load NFTs
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Link to="/swap" className="text-white/80 hover:text-white underline decoration-white/30">
              ← Back to Swap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
