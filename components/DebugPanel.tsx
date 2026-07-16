"use client";
import { useState } from "react";

export default function DebugPanel({ state }: { state: Record<string, any> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 bg-black/70 border border-white/20 text-xs px-3 py-2 rounded-full z-50"
      >
        🐛 Debug
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 w-80 max-h-[60vh] overflow-auto bg-black/90 border border-white/20 rounded-xl p-4 text-xs z-50">
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
