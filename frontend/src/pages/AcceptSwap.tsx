import React, { useMemo, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { NFT_SWAP_ABI } from "../abi/NftSwap";
import { SWAP_CONTRACT, SWAP_FLAT_FEE_WEI } from "../config/addresses";
import { ensureOperatorApprovedFor721 } from "../lib/approvals";
import type { Address } from "viem";

type NFT = { token: Address; id: bigint };

export default function AcceptSwap(): JSX.Element {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [swapIdInput, setSwapIdInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [swap, setSwap] = useState<{
    initiator: Address;
    counterparty: Address;
    offered: NFT[];
    requested: NFT[];
    deadline: bigint;
    active: boolean;
  } | null>(null);

  const ORANGE = "#FF8A2B";
  const CARD_GRADIENT = "linear-gradient(180deg,#2b0f2f 0%, #170a1b 100%)";

  const canAccept = useMemo(() => {
    if (!swap || !address) return false;
    if (!swap.active) return false;
    if (swap.counterparty !== "0x0000000000000000000000000000000000000000" && swap.counterparty.toLowerCase() !== address.toLowerCase()) {
      return false; // not the allowlisted counterparty
    }
    return true;
  }, [swap, address]);

  async function loadSwap() {
    if (!publicClient) return;
    const id = BigInt(swapIdInput);
    setLoading(true);
    try {
      const res = await publicClient.readContract({
        address: SWAP_CONTRACT,
        abi: NFT_SWAP_ABI,
        functionName: "getSwap",
        args: [id],
      });
      // getSwap returns: (initiator, counterparty, offered[], requested[], deadline, active)
      const [initiator, counterparty, offered, requested, deadline, active] = res as any;
      setSwap({
        initiator,
        counterparty,
        offered: (offered as any[]).map((x) => ({ token: x.token as Address, id: BigInt(x.id) })),
        requested: (requested as any[]).map((x) => ({ token: x.token as Address, id: BigInt(x.id) })),
        deadline: BigInt(deadline),
        active: Boolean(active),
      });
    } catch (e: any) {
      console.error(e);
      alert("Unable to load swap. Double-check the swapId.");
      setSwap(null);
    } finally {
      setLoading(false);
    }
  }

  async function accept() {
    if (!walletClient || !publicClient || !address) {
      alert("Connect your wallet first.");
      return;
    }
    if (!swap) return;

    try {
      // 1) Make sure this wallet approved the swap contract to move the requested NFTs
      const tokenContracts = Array.from(new Set(swap.requested.map((n) => n.token.toLowerCase()))) as Address[];
      await ensureOperatorApprovedFor721({
        owner: address as `0x${string}`,
        operator: SWAP_CONTRACT,
        tokenContracts,
        walletClient,
        publicClient,
      });

      // 2) Call acceptSwap with the flat fee as msg.value
      const id = BigInt(swapIdInput);
      const hash = await walletClient.writeContract({
        address: SWAP_CONTRACT,
        abi: NFT_SWAP_ABI,
        functionName: "acceptSwap",
        args: [id],
        value: SWAP_FLAT_FEE_WEI, // 0.1 MON
      });

      alert("Swap accepted! Tx hash:\n" + hash);
    } catch (e: any) {
      console.error(e);
      alert("Accept failed:\n" + (e?.shortMessage || e?.message || String(e)));
    }
  }

  return (
    <div className="swap-page" style={{ padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2 className="site-title" style={{ textAlign: "center" }}>Accept a Swap</h2>
        <p className="site-sub" style={{ textAlign: "center" }}>
          Enter a swap ID, review details, approve your NFTs, and pay the 0.1 MON fee to complete the swap.
        </p>

        <div
          style={{
            background: CARD_GRADIENT,
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              value={swapIdInput}
              onChange={(e) => setSwapIdInput(e.target.value)}
              placeholder="Enter swap ID (integer)"
              style={{
                flex: 1,
                height: 52,
                background: "rgba(0,0,0,0.25)",
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.12)",
                color: "#fff",
                padding: "0 14px",
                fontWeight: 700,
              }}
            />
            <button
              onClick={loadSwap}
              disabled={loading || !swapIdInput}
              style={{
                height: 52,
                padding: "0 20px",
                borderRadius: 14,
                fontWeight: 800,
                border: "none",
                background: loading || !swapIdInput ? "rgba(50,50,50,0.8)" : ORANGE,
                color: "#1B0E1E",
                cursor: loading || !swapIdInput ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>

          {swap && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: "#fff", fontWeight: 800, marginBottom: 6 }}>
                Status: {swap.active ? "Active" : "Inactive"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                Initiator: <span style={{ fontFamily: "monospace" }}>{swap.initiator}</span>
                <br />
                Counterparty: <span style={{ fontFamily: "monospace" }}>{swap.counterparty}</span>
                <br />
                Fee (MON): 0.1
              </div>

              <div style={{ marginTop: 12, color: "#a88ed6", fontSize: 20, fontWeight: 900 }}>You must send</div>
              <div style={{ color: "#fff", marginBottom: 12 }}>
                {swap.requested.length} NFT(s) to the initiator.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
                {swap.requested.map((n, idx) => (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 10, color: "#fff" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Requested</div>
                    <div style={{ fontFamily: "monospace", wordBreak: "break-all", fontSize: 12 }}>
                      {n.token}
                    </div>
                    <div style={{ fontWeight: 800, marginTop: 6 }}>Token #{n.id.toString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18, color: "#a88ed6", fontSize: 20, fontWeight: 900 }}>You will receive</div>
              <div style={{ color: "#fff", marginBottom: 12 }}>
                {swap.offered.length} NFT(s) from escrow.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
                {swap.offered.map((n, idx) => (
                  <div key={idx} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 10, color: "#fff" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Offered (escrow)</div>
                    <div style={{ fontFamily: "monospace", wordBreak: "break-all", fontSize: 12 }}>
                      {n.token}
                    </div>
                    <div style={{ fontWeight: 800, marginTop: 6 }}>Token #{n.id.toString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <button
                  onClick={canAccept ? accept : undefined}
                  disabled={!canAccept}
                  style={{
                    height: 56,
                    padding: "0 28px",
                    borderRadius: 28,
                    fontWeight: 800,
                    fontSize: 18,
                    background: canAccept ? ORANGE : "rgba(50,50,50,0.8)",
                    color: canAccept ? "#1B0E1E" : "rgba(255,255,255,0.7)",
                    cursor: canAccept ? "pointer" : "not-allowed",
                    border: "none",
                  }}
                >
                  Pay 0.1 MON & Accept
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
