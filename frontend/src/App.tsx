// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Swap from "./pages/Swap";
import SwapHistory from "./pages/SwapHistory";
import VerifiedCollections from "./pages/VerifiedCollections";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-foxDark text-white">
        <header className="bg-foxPurple p-4 flex justify-center items-center shadow-lg">
          <h1 className="text-2xl font-bold text-foxOrange tracking-wide">Monad NFT Swap</h1>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          <nav className="flex gap-4 justify-center mb-6">
            <Link to="/" className="px-4 py-2 rounded-md bg-foxPurple/60">Home</Link>
            <Link to="/swap" className="px-4 py-2 rounded-md bg-foxPurple/60">Swap</Link>
            <Link to="/verified" className="px-4 py-2 rounded-md bg-foxPurple/60">Verified</Link>
            <Link to="/history" className="px-4 py-2 rounded-md bg-foxPurple/60">History</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/verified" element={<VerifiedCollections />} />
            <Route path="/history" element={<SwapHistory />} />
            {/* Add other routes here */}
          </Routes>
        </main>

        <footer className="bg-foxPurple text-center p-4 text-foxGray">
          Powered by Monad · Built with ❤️
        </footer>
      </div>
    </BrowserRouter>
  );
}
