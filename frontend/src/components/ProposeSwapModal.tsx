import React from "react";

export type ProposePayload = {
  proposerNFT: string;
  proposerTokenId: string;
  targetNFT: string;
  targetTokenId: string;
};

export default function ProposeSwapModal({
  onConfirm,
}: {
  onConfirm: (payload: ProposePayload) => Promise<void> | void;
}) {
  const [open, setOpen] = React.useState(false);
  const [proposerNFT, setProposerNFT] = React.useState("");
  const [proposerTokenId, setProposerTokenId] = React.useState("");
  const [targetNFT, setTargetNFT] = React.useState("");
  const [targetTokenId, setTargetTokenId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm({
        proposerNFT: proposerNFT.trim(),
        proposerTokenId: proposerTokenId.trim(),
        targetNFT: targetNFT.trim(),
        targetTokenId: targetTokenId.trim(),
      });
      setOpen(false);
      setProposerTokenId("");
      setTargetTokenId("");
      // keep addresses if you want
    } catch (err) {
      console.error("Propose error:", err);
      // optionally show user-facing error
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-foxOrange hover:bg-orange-500 text-black px-4 py-2 rounded-2xl shadow-md"
      >
        Propose Swap
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !loading && setOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#071026] rounded-xl p-6 border border-white/6">
            <h3 className="text-xl font-semibold text-foxOrange mb-4">Propose NFT Swap</h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-white/70">Your NFT (contract address)</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={proposerNFT}
                  onChange={(e) => setProposerNFT(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Your Token ID</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={proposerTokenId}
                  onChange={(e) => setProposerTokenId(e.target.value)}
                  placeholder="1234"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Target NFT (contract address)</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={targetNFT}
                  onChange={(e) => setTargetNFT(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Target Token ID</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={targetTokenId}
                  onChange={(e) => setTargetTokenId(e.target.value)}
                  placeholder="5678"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md border border-white/10 text-white/80"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-md bg-foxOrange text-black font-semibold"
                disabled={loading}
              >
                {loading ? "Proposing..." : "Confirm Propose"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
