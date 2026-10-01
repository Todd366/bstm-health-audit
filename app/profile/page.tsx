"use client";
import { useEffect, useState } from "react";
import PageNav from "@/components/PageNav";
import { getProfile, saveProfile, LocalProfile } from "@/lib/localStore";

export default function ProfilePage() {
  const [form, setForm] = useState<LocalProfile>({ name: "", industry: "", location: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setForm(getProfile());
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(saveProfile(form) ? "Saved on this device." : "Could not save. Browser storage may be blocked.");
  }

  const field = (key: keyof LocalProfile, label: string) => (
    <div>
      <label className="text-xs text-gray-500 font-mono block mb-1.5">{label}</label>
      <input
        className="w-full p-3.5 rounded-xl card focus:outline-none focus:ring-1 focus:ring-emerald-500"
        value={form[key]}
        maxLength={200}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <main className="min-h-screen p-6 max-w-xl mx-auto">
      <PageNav active="/profile" />
      <h1 className="text-2xl font-bold mb-2">Business profile</h1>
      <p className="text-sm text-gray-400 mb-6">Pre-fills your audits. Stored on this device only.</p>
      <form onSubmit={submit} className="space-y-5">
        {field("name", "BUSINESS NAME")}
        {field("industry", "INDUSTRY")}
        {field("location", "LOCATION")}
        <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3.5 rounded-xl">
          Save profile
        </button>
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
      </form>
    </main>
  );
}
