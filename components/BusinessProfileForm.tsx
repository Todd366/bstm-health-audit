"use client";
import { useState } from "react";

export default function BusinessProfileForm({ onNext }: { onNext: (profile: any) => void }) {
  const [form, setForm] = useState({ name: "", industry: "", location: "" });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onNext(form); }}
      className="space-y-5"
    >
      <div>
        <label className="text-xs text-gray-500 font-mono block mb-1.5">BUSINESS NAME</label>
        <input
          required
          className="w-full p-3.5 rounded-xl card focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-shadow"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-mono block mb-1.5">INDUSTRY</label>
        <input
          required
          className="w-full p-3.5 rounded-xl card focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-shadow"
          value={form.industry}
          onChange={(e) => setForm({ ...form, industry: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs text-gray-500 font-mono block mb-1.5">LOCATION</label>
        <input
          required
          className="w-full p-3.5 rounded-xl card focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-shadow"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <button className="w-full bg-emerald-500 hover:bg-emerald-400 transition-colors text-black font-semibold py-3.5 rounded-xl mt-2">
        Begin Audit
      </button>
    </form>
  );
}
