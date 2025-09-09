// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home(): JSX.Element {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-bold text-foxOrange">Swap Your NFTs Instantly</h2>
        <p className="text-foxGray max-w-2xl mx-auto">
          Connect your wallet and swap NFTs securely on Monad Testnet. Verified collections will
          appear on the Verified Collections page.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            to="/swap"
            className="px-8 py-3 rounded-3xl font-semibold bg-gradient-to-r from-foxOrange to-yellow-400 text-black shadow-lg"
          >
            Go to Swap
          </Link>
        </div>
      </div>
    </section>
  );
}
