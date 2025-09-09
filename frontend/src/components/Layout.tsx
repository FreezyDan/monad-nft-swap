// src/components/Layout.tsx
import React, { ReactNode } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-fox-bg text-white">
      {/* Header */}
      <header className="relative bg-fox-gradient shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          {/* left area for nav (keeps spacing even) */}
          <div className="flex-1 flex items-center gap-4">
            <Link to="/" className="hidden md:inline text-sm text-white/80 hover:underline">
              Home
            </Link>
          </div>

          {/* right area: connect button */}
          <div className="flex-1 flex justify-end">
            <ConnectButton chainStatus="icon" accountStatus="avatar" showBalance={false} />
          </div>
        </div>

        {/* Absolutely centered title (always centered regardless of left/right width) */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center">
          <Link to="/" className="pointer-events-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider text-fox-accent drop-shadow-md">
              Monad NFT Swap
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/70">Safe 1↔1 NFT swaps · Monad Testnet</p>
          </Link>
        </div>
      </header>

      {/* Main content (centered wrappers inside pages will handle vertical centering) */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
      </main>

      <footer className="bg-fox-footer text-center p-4 text-white/70">
        Powered by Monad · Built with ❤️
      </footer>
    </div>
  );
}
