// src/components/VerifiedCollectionsPanel.tsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Left-side panel: keeps menu links only.
 * The verified collections listing was intentionally removed from here per your request.
 */

export default function VerifiedCollectionsPanel() {
  return (
    <div className="sticky top-24">
      <div className="rounded-2xl bg-gradient-to-b from-[#2a1530] to-[#1a0816] border border-white/6 p-6 shadow-lg">
        <div className="space-y-3 mb-6">
          <Link to="/history" className="block w-full text-left px-4 py-3 rounded-full bg-[#3a2442] hover:bg-[#46304f] text-gray-200 font-medium">
            ⏱ My Swap History
          </Link>
          <Link to="/verified" className="block w-full text-left px-4 py-3 rounded-full bg-[#3a2442] hover:bg-[#46304f] text-gray-200 font-medium">
            ★ Verified Collections
          </Link>
          <Link to="/scams" className="block w-full text-left px-4 py-3 rounded-full bg-[#3a2442] hover:bg-[#46304f] text-gray-200 font-medium">
            ⚠ Common Scams
          </Link>
          <a href="#" className="block w-full text-left px-4 py-3 rounded-full bg-[#3a2442] hover:bg-[#46304f] text-gray-200 font-medium">💬 Join our Discord</a>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <a href="#" onClick={(e) => e.preventDefault()} className="underline">How verification works</a>
        </div>
      </div>
    </div>
  );
}
