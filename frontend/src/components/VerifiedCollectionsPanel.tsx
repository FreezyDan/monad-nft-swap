// src/components/VerifiedCollectionsPanel.tsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Left-side menu with pill buttons matching the Famous Fox look.
 * Each menu entry is a big rounded pill with a small icon on the left.
 */

export default function VerifiedCollectionsPanel() {
  return (
    <div className="sticky top-24">
      <div className="p-4">
        <nav className="space-y-4">
          <Link to="/history" className="ff-menu-btn">
            <span className="ff-menu-icon">⏱</span>
            <span className="ff-menu-text">My Swap History</span>
          </Link>

          <Link to="/verified" className="ff-menu-btn">
            <span className="ff-menu-icon">★</span>
            <span className="ff-menu-text">Verified Collections</span>
          </Link>

          <Link to="/scams" className="ff-menu-btn">
            <span className="ff-menu-icon">⚠</span>
            <span className="ff-menu-text">Common Scams</span>
          </Link>

          <a href="#" onClick={(e) => e.preventDefault()} className="ff-menu-btn">
            <span className="ff-menu-icon">💬</span>
            <span className="ff-menu-text">Join our Discord</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
