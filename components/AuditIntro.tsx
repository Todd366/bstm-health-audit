export default function AuditIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="card rounded-2xl p-8 max-w-md mx-auto text-center">
      <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
        7 Categories · ~5 Minutes
      </p>
      <h2 className="text-2xl font-bold mb-4">Let's assess your business</h2>
      <p className="text-gray-400 mb-8 text-sm leading-relaxed">
        You'll answer a few quick questions across Digital Presence, Marketing,
        Finance, Operations, Technology, Customer Experience, and Growth. At the
        end you'll get a health score, a clear diagnosis, and recommended next steps.
      </p>
      <button
        onClick={onStart}
        className="btn-primary w-full py-3 rounded-xl font-semibold text-white"
      >
        Begin Assessment
      </button>
    </div>
  );
}
