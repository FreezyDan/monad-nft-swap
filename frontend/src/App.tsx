// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Swap from "./pages/Swap";
import NewSwap from "./pages/NewSwap";
import SelectNFT from "./pages/SelectNFT";
import BuildSwap from "./pages/BuildSwap";
import SwapHistory from "./pages/SwapHistory";
import VerifiedCollections from "./pages/VerifiedCollections";

export default function App(): JSX.Element {
  const enableAnalytics = import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === "true";

  return (
    <BrowserRouter>
      <Layout>
        {/* {enableAnalytics ? <Analytics /> : null} */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/swap/new" element={<NewSwap />} />
          <Route path="/swap/select" element={<SelectNFT />} />
          <Route path="/swap/build" element={<BuildSwap />} />
          <Route path="/verified" element={<VerifiedCollections />} />
          <Route path="/history" element={<SwapHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
