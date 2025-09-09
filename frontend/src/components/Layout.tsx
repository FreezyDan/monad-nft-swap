// src/components/Layout.tsx
import React, { ReactNode } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-fox-bg text-white">
      {/* Fixed top-right Connect button */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <ConnectButton chainStatus="icon" accountStatus="avatar" showBalance={false} />
      </div>

      {/* Minimal header band — no left texts/links */}
      <header className="relative bg-fox-gradient shadow-lg pt-16 md:pt-20">
        {/* empty header just for the gradient bar and spacing */}
        <div className="max-w-6xl mx-auto px-4 pb-4" />
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-fox-footer text-center p-4 text-white/70">
        Powered by Monad · Built with ❤️
      </footer>
    </div>
  );
}
