// src/components/VerifiedCollections.tsx
import React from "react";

/**
 * Lightweight verified collections UI.
 * This version avoids any advanced tuple indexing or optional-chaining on numeric keys
 * which caused earlier parsing errors. It accepts a safe data prop or shows a fallback.
 */

type Collection = { address: string; name?: string };

export default function VerifiedCollections({ collections }: { collections?: Collection[] }) {
  const list = Array.isArray(collections) ? collections : [];

  return (
    <section style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 980, borderRadius: 14, padding: 18, background: "rgba(255,255,255,0.02)" }}>
        <h3 style={{ margin: 0, color: "var(--fox-orange)" }}>Verified Collections</h3>
        <p style={{ color: "var(--fox-gray)", marginTop: 8 }}>
          Collections that have been verified — data shown is from a safe prop to avoid runtime RPC issues.
        </p>

        <div style={{ marginTop: 12 }}>
          {list.length === 0 ? (
            <div style={{ color: "var(--fox-gray)" }}>No verified collections available.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
              {list.map((c, i) => (
                <div key={`${c.address}-${i}`} style={{ padding: 12, borderRadius: 10, background: "rgba(0,0,0,0.3)" }}>
                  <div style={{ fontWeight: 700 }}>{c.name ?? "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: "var(--fox-gray)", marginTop: 6 }}>{shortAddr(c.address)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function shortAddr(a: string) {
  if (!a) return "";
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}
