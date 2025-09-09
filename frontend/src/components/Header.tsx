import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Header for Monad NFT Swap.
 * Positions the wallet connect button at the top-right,
 * while centering the app title and subtitle beneath.
 */
export default function Header(): JSX.Element {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-left" />
        <div className="header-center">
          <h1 className="site-title">Monad NFT Swap</h1>
          <div className="site-sub">
            Swap 1 to 1 with whitelisted verified collections
          </div>
        </div>
        <div className="header-right">
          {/* Wallet connection button (RainbowKit) */}
          <ConnectButton
            chainStatus="none"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </header>
  );
}
