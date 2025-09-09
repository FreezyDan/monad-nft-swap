import React, { useEffect, useState } from "react";

/**
 * Simple Connect Wallet button using window.ethereum (MetaMask).
 * - Shows "Connect Wallet" when not connected.
 * - Shows truncated address when connected (e.g. 0x12...C17b).
 * - Listens for account changes and disconnect.
 *
 * Note: This intentionally does NOT use wagmi/rainbowkit to avoid touching wagmi.ts.
 */

function truncateAddress(addr: string) {
  if (!addr) return "";
  // show "0x" + first 4 hex chars then ... last 4 chars
  const prefix = addr.slice(0, 6); // "0x" + 4 chars
  const suffix = addr.slice(-4);
  return `${prefix}...${suffix}`;
}

export default function ConnectWalletButton(): JSX.Element {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // If site loaded and wallet already connected, read selectedAddress if available
    const eth = (window as any).ethereum;
    if (eth?.selectedAddress) {
      setAccount(eth.selectedAddress);
    }

    // Handler for account changes
    const handleAccountsChanged = (accounts: Array<string> | string) => {
      // EIP-1193: accounts is an array
      if (Array.isArray(accounts)) {
        if (accounts.length === 0) {
          setAccount(null);
        } else {
          setAccount(accounts[0]);
        }
      } else if (typeof accounts === "string") {
        setAccount(accounts || null);
      } else {
        setAccount(null);
      }
    };

    // Listen for account changes
    if (eth?.on) {
      eth.on("accountsChanged", handleAccountsChanged);
      eth.on("disconnect", () => setAccount(null));
    }

    // cleanup
    return () => {
      if (eth?.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("disconnect", () => setAccount(null));
      }
    };
  }, []);

  const connect = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      // No injected provider
      // open metamask page in new tab
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    try {
      setIsConnecting(true);
      // Request accounts
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      if (Array.isArray(accounts) && accounts[0]) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      // user rejected or other error
      console.error("Wallet connect error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // There is no standard programmatic disconnect for injected wallets.
    // Clearing local UI state to "disconnect" view.
    setAccount(null);
  };

  return (
    <>
      {account ? (
        <button
          className="connect-btn connected"
          onClick={disconnect}
          title={account}
          aria-label="Connected wallet; click to disconnect"
        >
          {truncateAddress(account)}
        </button>
      ) : (
        <button
          className="connect-btn"
          onClick={connect}
          disabled={isConnecting}
          aria-label="Connect wallet"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </>
  );
}
