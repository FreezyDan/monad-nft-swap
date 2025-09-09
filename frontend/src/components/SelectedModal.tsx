// src/components/SelectedModal.tsx
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export default function SelectedModal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title ?? "Selected"}</h3>
          <button onClick={onClose} className="text-sm text-slate-600">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
