"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error")) {
      setStatus("error");
      setMsg("That sign-in link is invalid or expired. Request a new one.");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatus("error");
      setMsg("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    // Redirect URL stays exact (no query params) to match the Supabase allowlist;
    // the post-login destination travels in a short-lived cookie instead.
    document.cookie = `bstm_next=${encodeURIComponent(next)}; path=/; max-age=900; SameSite=Lax`;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus("error");
      const m = error.message.toLowerCase();
      setMsg(
        m.includes("rate") || m.includes("too many")
          ? "Too many requests. Wait a few minutes and try again."
          : "Could not send the link: " + error.message
      );
      return;
    }
    setStatus("sent");
    setMsg("Check your email for the sign-in link.");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0e14]">
      <div className="text-xs tracking-[0.3em] text-emerald-400 mb-6 font-mono">BSTM · SIGN IN</div>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-emerald-400"
        />
        <button
          disabled={status === "sending"}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 transition-colors px-4 py-3 rounded-xl font-semibold text-black"
        >
          {status === "sending" ? "Sending..." : "Email me a sign-in link"}
        </button>
        {msg && (
          <p className={`text-sm ${status === "sent" ? "text-emerald-400" : "text-red-400"}`}>{msg}</p>
        )}
      </form>
    </main>
  );
}
