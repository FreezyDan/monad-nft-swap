// src/components/NFTCard.tsx
import React from "react";

interface Props {
  contractAddress: string;
  name: string;
}

const NFTCard: React.FC<Props> = ({ contractAddress, name }) => {
  const onSelect = () => {
    // Dispatch a simple event with the collection selected
    window.dispatchEvent(new CustomEvent("monad:selectedCollection", { detail: { contractAddress, name } }));
  };

  return (
    <div className="bg-gradient-to-b from-white/2 to-white/1 p-4 rounded-lg flex flex-col items-center text-center">
      <div className="w-full aspect-square bg-white/5 mb-3 rounded flex items-center justify-center text-2xl">
        {/* placeholder image area */}
        <span className="text-foxGray">img</span>
      </div>
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-xs text-foxGray mb-3 truncate">{contractAddress}</div>
      <button onClick={onSelect} className="btn-fox mt-auto">
        Select
      </button>
    </div>
  );
};

export default NFTCard;
