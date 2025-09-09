// src/components/InitiateSwapModal.tsx
import React from "react";

/**
 * Minimal initiate swap modal UI placeholder.
 * Does not call wagmi hooks directly; exposes callback props for later wiring.
 */

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: { proposerNFT: string; proposerTokenId: string; targetNFT: string; targetTokenId: string }) => void;
};

export default function InitiateSwapModal({ open, onClose, onSubmit }: Props) {
  if (!open) return null;

  const submit = () => {
    const payload = {
      proposerNFT: "0x0000000000000000000000000000000000000000",
      proposerTokenId: "1",
      targetNFT: "0x0000000000000000000000000000000000000000",
      targetTokenId: "1",
    };
    if (onSubmit) onSubmit(payload);
    else alert("Submit: " + JSON.stringify(payload));
  };

  return (
    <div style={{
      position: "fixed", left: 0, top: 0, right: 0, bottom: 0, display: "flex",
      alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: 1200
    }}>
      <div style={{ width: 520, maxWidth: "94%", borderRadius: 12, padding: 18, background: "#0b0a0f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h4 style={{ margin: 0, color: "var(--fox-orange)" }}>Initiate Swap</h4>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--fox-gray)", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ color: "var(--fox-gray)", marginBottom: 12 }}>
          Fill in the fields and press submit. This placeholder avoids contract calls — you'll wire it to wagmi later.
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "var(--fox-gray)", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={submit} style={{ padding: "8px 14px", borderRadius: 8, background: "var(--fox-orange)", border: "none", color: "#000", fontWeight: 700, cursor: "pointer" }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
