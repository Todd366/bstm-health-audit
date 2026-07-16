export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[#0a0e14]">
      <div className="text-xs tracking-[0.3em] text-emerald-400 mb-6 font-mono">BSTM · FIELD INTELLIGENCE</div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
        How healthy is<br /><span className="text-gradient">your business?</span>
      </h1>
      <p className="mb-10 text-gray-400 max-w-sm">
        A free diagnostic scan across 7 core areas. Takes 4 minutes. No signup.
      </p>
      <a
        href="/audit"
        className="bg-emerald-500 hover:bg-emerald-400 transition-colors px-8 py-4 rounded-2xl font-semibold text-black glow-emerald"
      >
        Start Free Audit →
      </a>
      <div className="flex gap-6 mt-12 text-xs text-gray-500">
        <span>7 categories</span><span>·</span><span>Instant score</span><span>·</span><span>Real report</span>
      </div>
    </main>
  );
}
