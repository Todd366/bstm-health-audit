"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageNav from "@/components/PageNav";
import { HistoryEntry, getHistory, deleteHistory } from "@/lib/localStore";
import { ratingLabel } from "@/lib/scoring";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  function remove(id: string) {
    deleteHistory(id);
    setItems(getHistory());
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <PageNav active="/history" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Audit history</h1>
        <Link href="/audit" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-xl">
          New audit
        </Link>
      </div>

      {items === null ? null : items.length === 0 ? (
        <p className="text-sm text-gray-400">
          No saved audits on this device yet. Complete an audit and it will appear here.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((e, i) => {
            const prev = items[i + 1];
            const delta = prev ? e.overall - prev.overall : null;
            return (
              <li key={e.id} className="card rounded-2xl p-4">
                <details>
                  <summary className="cursor-pointer list-none flex items-center justify-between">
                    <div>
                      <div className="font-medium">{e.business?.name || "Unnamed business"}</div>
                      <div className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{Math.round(e.overall)}</div>
                      <div className="text-xs text-emerald-400">
                        {ratingLabel(e.overall)}
                        {delta !== null && delta !== 0 && (
                          <span className={delta > 0 ? "text-emerald-400" : "text-red-400"}>
                            {" "}
                            {delta > 0 ? "+" : ""}
                            {Math.round(delta)}
                          </span>
                        )}
                      </div>
                    </div>
                  </summary>
                  <div className="mt-4 space-y-2">
                    {Object.entries(e.categories).map(([name, score]) => (
                      <div key={name} className="flex justify-between text-sm">
                        <span className="text-gray-300">{name}</span>
                        <span className="font-mono">{Math.round(score as number)}</span>
                      </div>
                    ))}
                    {e.diagnosis.weaknesses.length > 0 && (
                      <p className="text-sm text-gray-400 pt-2">
                        Focus areas: {e.diagnosis.weaknesses.join(", ")}
                      </p>
                    )}
                    <button onClick={() => remove(e.id)} className="text-xs text-red-400 pt-2">
                      Delete this audit
                    </button>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
