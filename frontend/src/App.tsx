// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Swap from "./pages/Swap";
import SwapHistory from "./pages/SwapHistory";
import VerifiedCollections from "./pages/VerifiedCollections";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      {/* Use Layout so the header + ConnectButton shows on all pages */}
      <Layout>
        {/* your page nav */}
        <nav className="flex gap-4 justify-center mb-6">
          <Link to="/" className="px-4 py-2 rounded-md bg-foxPurple/60">
            Home
          </Link>
          <Link to="/swap" className="px-4 py-2 rounded-md bg-foxPurple/60">
            Swap
          </Link>
          <Link to="/verified" className="px-4 py-2 rounded-md bg-foxPurple/60">
            Verified
          </Link>
          <Link to="/history" className="px-4 py-2 rounded-md bg-foxPurple/60">
            History
          </Link>
        </nav>

        {/* routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/verified" element={<VerifiedCollections />} />
          <Route path="/history" element={<SwapHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
