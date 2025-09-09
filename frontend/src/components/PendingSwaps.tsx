// src/pages/PendingSwaps.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function PendingSwaps(): JSX.Element {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-xl">
        <h2 className="text-3xl font-bold text-foxOrange mb-4">Pending Swaps (Placeholder)</h2>
        <p className="text-foxGray mb-6">
          Pending swaps functionality will be available soon. For now this is a placeholder page so
          we can finish the UI and integration next.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/swap" className="px-6 py-2 rounded-2xl bg-foxPurple">
            Back to Swap
          </Link>
          <a
            className="px-6 py-2 rounded-2xl border border-foxOrange text-foxOrange"
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
          >
            Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}
