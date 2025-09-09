// src/components/ConnectWalletButton.tsx
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

/**
 * Simple Connect Wallet button that:
 * - Uses injected connector (MetaMask / browser wallets)
 * - Shows "Connect Wallet" when disconnected
 * - Shows truncated address (0x + first 4 chars) when connected
 * - Clicking the connected pill will disconnect
 *
 * Keep this small and standalone to avoid touching global wagmi config.
 */
export default function ConnectWalletButton(): JSX.Element {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // show "0x" + 4 chars (e.g. 0x12ab)
  const shortAddress = address ? `${address.slice(0, 6)}` : "";

  const onConnect = async () => {
    try {
      await connect({ connector: new InjectedConnector() });
    } catch (err) {
      // swallow - UI should remain simple; dev console will show the error
      // optionally show a toast here if you have a system
      console.error("connect error", err);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {!isConnected ? (
        <button
          className="connect-btn"
          onClick={onConnect}
          disabled={isConnecting}
          title={isConnecting ? "Connecting..." : "Connect wallet"}
          aria-label="Connect wallet"
        >
          {isConnecting && pendingConnector ? `Connecting…` : "Connect Wallet"}
        </button>
      ) : (
        <button
          className="connect-btn connected"
          onClick={() => disconnect()}
          title="Click to disconnect"
          aria-label="Disconnect wallet"
        >
          <span className="connect-avatar" aria-hidden>
            {/* simple avatar circle */}
            {shortAddress.slice(2, 3)?.toUpperCase() ?? "0"}
          </span>
          <span className="connect-label">{shortAddress}</span>
        </button>
      )}
    </div>
  );
}
