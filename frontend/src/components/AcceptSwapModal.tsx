import React from "react";

export default function AcceptSwapModal({
  onConfirm,
}: {
  onConfirm: (params: { swapId: string; targetNFT: string; targetTokenId: string }) => Promise<void> | void;
}) {
  const [open, setOpen] = React.useState(false);
  const [swapId, setSwapId] = React.useState("");
  const [targetNFT, setTargetNFT] = React.useState("");
  const [targetTokenId, setTargetTokenId] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm({
        swapId: swapId.trim(),
        targetNFT: targetNFT.trim(),
        targetTokenId: targetTokenId.trim(),
      });
      setOpen(false);
      setSwapId("");
      setTargetNFT("");
      setTargetTokenId("");
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white/5 hover:bg-white/7 text-white px-4 py-2 rounded-2xl shadow-sm"
      >
        Accept Swap
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setOpen(false)} />
          <div className="relative w-full max-w-md bg-[#071026] rounded-xl p-6 border border-white/6">
            <h3 className="text-lg font-semibold text-foxOrange mb-3">Accept a Swap</h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-white/70">Swap ID</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={swapId}
                  onChange={(e) => setSwapId(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Your NFT (contract address)</label>
                <input
                  className="w-full rounded-md px-3 py-2 bg-white/3 text-white"
                  value={targetNFT}
                  onChange={(e) => setTargetNFT(e.target.value)}
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-xs text-white/70">Your Token ID</label>
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
                {loading ? "Accepting..." : "Confirm Accept"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
