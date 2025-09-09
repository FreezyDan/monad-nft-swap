// src/pages/SwapHistory.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function SwapHistory(): JSX.Element {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-xl">
        <h2 className="text-3xl font-bold text-foxOrange mb-4">My Swap History (Placeholder)</h2>
        <p className="text-foxGray mb-6">
          Swap history will show your initiated and accepted swaps. This is a placeholder so we can
          continue UI polish — it will be populated from the contract later.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/swap" className="px-6 py-2 rounded-2xl bg-foxPurple">
            Back to Swap
          </Link>
        </div>
      </div>
    </section>
  );
}
