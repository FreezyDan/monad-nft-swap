// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Swap from "./pages/Swap";
import NewSwap from "./pages/NewSwap";
import SelectNFT from "./pages/SelectNFT";
import BuildSwap from "./pages/BuildSwap";
import AcceptSwap from "./pages/AcceptSwap";
import SwapHistory from "./pages/SwapHistory";
import VerifiedCollections from "./pages/VerifiedCollections";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/swap/new" element={<NewSwap />} />
          <Route path="/swap/select" element={<SelectNFT />} />
          <Route path="/swap/build" element={<BuildSwap />} />
          <Route path="/swap/accept" element={<AcceptSwap />} />
          <Route path="/verified" element={<VerifiedCollections />} />
          <Route path="/history" element={<SwapHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
