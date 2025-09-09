// src/pages/SwapPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SwapPage(): JSX.Element {
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foxOrange mb-6">Swap Dashboard</h2>
        <p className="text-foxGray mb-8">
          Initiate 1:1 NFT swaps with other verified collections. Pending swaps and swap history are
          placeholders for now.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Initiate Swap */}
          <button
            onClick={() => setShowInitiateModal(true)}
            className="px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:translate-y-[-2px] transition
                       bg-gradient-to-r from-foxOrange to-amber-400 text-black"
          >
            Initiate New Swap
          </button>

          {/* View Pending */}
          <button
            onClick={() => navigate("/pending")}
            className="px-8 py-4 rounded-full text-lg font-semibold shadow-xl transform hover:translate-y-[-2px] transition
                       bg-transparent border-2 border-foxOrange text-foxOrange"
          >
            View Pending Swaps
          </button>
        </div>

        {/* Optional small links below */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            className="text-sm text-foxGray hover:text-white underline"
            href="https://discord.com" target="_blank" rel="noreferrer"
          >
            Join our Discord
          </a>
          <a
            className="text-sm text-foxGray hover:text-white underline"
            href="/history"
          >
            My Swap History
          </a>
        </div>

        {/* Initiate Modal (placeholder) */}
        {showInitiateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowInitiateModal(false)}
            />
            <div className="relative bg-[#0f0d12] border border-foxPurple rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold text-foxOrange mb-3">Initiate Swap</h3>
              <p className="text-foxGray mb-6">
                This is a placeholder modal for initiating a swap. We'll wire the real flow next.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowInitiateModal(false)}
                  className="px-4 py-2 rounded-lg bg-foxPurple text-white font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // placeholder action — keep as no-op for now
                    alert("Swap initiate flow will be implemented here.");
                  }}
                  className="px-4 py-2 rounded-lg bg-foxOrange text-black font-semibold"
                >
                  Mock Initiate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
