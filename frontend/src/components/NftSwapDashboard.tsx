// src/components/NftSwapDashboard.tsx
import React from "react";

/**
 * Stable UI-first Swap Dashboard.
 * - No direct wagmi/useSigner/usePrepareContractWrite calls here.
 * - Buttons are UI placeholders that call functions passed via props or window alerts.
 * Replace placeholders later with safe hooks.
 */

type Props = {
  onInitiate?: () => void;
  onPending?: () => void;
};

export default function NftSwapDashboard({ onInitiate, onPending }: Props) {
  return (
    <section style={{ padding: 28, display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "100%",
        maxWidth: 980,
        borderRadius: 16,
        padding: 30,
        background: "linear-gradient(180deg,#2b153f 0%, #0d0710 100%)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)"
      }}>
        <h2 style={{ textAlign: "center", color: "var(--fox-orange)", fontSize: 34, margin: "6px 0 18px" }}>
          Swap NFTs
        </h2>

        <p style={{ textAlign: "center", color: "var(--fox-gray)", maxWidth: 760, margin: "0 auto 22px" }}>
          Use the buttons below to start a swap or view pending swaps. Verified collections are on their own page.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
          <button
            onClick={() => (onInitiate ? onInitiate() : alert("Initiate Swap clicked"))}
            style={{
              background: "linear-gradient(90deg, var(--fox-orange), #ffb27a)",
              border: "none",
              padding: "12px 30px",
              borderRadius: 28,
              fontWeight: 800,
              cursor: "pointer",
              color: "#000",
              fontSize: 16,
            }}
          >
            Initiate New Swap
          </button>

          <button
            onClick={() => (onPending ? onPending() : alert("View Pending clicked"))}
            style={{
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.08)",
              padding: "10px 26px",
              borderRadius: 28,
              color: "#fff",
              cursor: "pointer",
              fontSize: 16
            }}
          >
            View Pending Swaps
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <ActionButton onClick={() => alert("Verified Collections")} label="Verified Collections" />
          <ActionButton onClick={() => alert("My Swap History")} label="My Swap History" />
          <ActionButton onClick={() => alert("Common Scams")} label="Common Scams" />
          <ActionButton onClick={() => window.open("https://discord.gg", "_blank")} label="Join our Discord" />
        </div>

        <p style={{ textAlign: "center", color: "var(--fox-gray)", marginTop: 18 }}>
          Note: contract features are temporarily disabled in this recovery build so the UI stays responsive.
        </p>
      </div>
    </section>
  );
}

function ActionButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 14px",
        borderRadius: 12,
        color: "var(--fox-gray)",
        cursor: "pointer",
        fontSize: 13
      }}
    >
      {label}
    </button>
  );
}
