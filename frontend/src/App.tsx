// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Swap from "./pages/Swap";
import NewSwap from "./pages/NewSwap";                // <-- NEW PAGE
import SwapHistory from "./pages/SwapHistory";
import VerifiedCollections from "./pages/VerifiedCollections";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Layout>
        {/* simple page nav */}
        <nav className="flex gap-4 justify-center mb-6">
          <NavLink to="/" className="px-4 py-2 rounded-md bg-foxPurple/60">Home</NavLink>
          <NavLink to="/swap" className="px-4 py-2 rounded-md bg-foxPurple/60">Swap</NavLink>
          <NavLink to="/verified" className="px-4 py-2 rounded-md bg-foxPurple/60">Verified</NavLink>
          <NavLink to="/history" className="px-4 py-2 rounded-md bg-foxPurple/60">History</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/swap/new" element={<NewSwap />} />   {/* <-- NEW ROUTE */}
          <Route path="/verified" element={<VerifiedCollections />} />
          <Route path="/history" element={<SwapHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
