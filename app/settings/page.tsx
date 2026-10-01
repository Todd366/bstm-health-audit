"use client";
import { useEffect, useState } from "react";
import PageNav from "@/components/PageNav";
import { getSettings, saveSettings, clearHistory, getHistory, LocalSettings } from "@/lib/localStore";

export default function SettingsPage() {
  const [s, setS] = useState<LocalSettings>({ autoExportElos: true, saveHistory: true });
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setS(getSettings());
    setCount(getHistory().length);
  }, []);

  function toggle(key: keyof LocalSettings) {
    const next = { ...s, [key]: !s[key] };
    setS(next);
    setMsg(saveSettings(next) ? "Saved." : "Could not save. Browser storage may be blocked.");
  }

  function wipe() {
    if (!window.confirm("Delete all saved audits on this device?")) return;
    clearHistory();
    setCount(0);
    setMsg("History cleared.");
  }

  const row = (key: keyof LocalSettings, title: string, desc: string) => (
    <label className="card rounded-2xl p-4 flex items-start gap-4 cursor-pointer">
      <input
        type="checkbox"
        checked={s[key]}
        onChange={() => toggle(key)}
        className="mt-1 h-5 w-5 accent-emerald-500"
      />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-gray-400">{desc}</span>
      </span>
    </label>
  );

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <PageNav active="/settings" />
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-3 mb-8">
        {row("autoExportElos", "Send results to ELOS", "Shares each completed audit with the BSTM ecosystem.")}
        {row("saveHistory", "Save audit history on this device", "Keeps your last 50 audits in this browser.")}
      </div>
      <div className="card rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Saved audits</div>
          <div className="text-sm text-gray-400">{count} on this device</div>
        </div>
        <button onClick={wipe} disabled={count === 0} className="text-sm text-red-400 disabled:opacity-40">
          Delete all
        </button>
      </div>
      {msg && <p className="text-sm text-emerald-400 mt-4">{msg}</p>}
    </main>
  );
}
