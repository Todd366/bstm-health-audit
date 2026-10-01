import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ratingLabel } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data, error } = await supabase
    .from("audit_reports")
    .select("id, business, health_score, elos_status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const list: any[] = data ?? [];
  const latest = list[0];
  const avg = list.length
    ? Math.round(list.reduce((a, r) => a + Number(r.health_score), 0) / list.length)
    : null;

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs tracking-[0.3em] text-emerald-400 font-mono">BSTM · DASHBOARD</div>
          <p className="text-sm text-gray-400 mt-1">{user.email}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="text-sm text-gray-400 hover:text-white">Sign out</button>
        </form>
      </header>

      {error && (
        <p className="mb-6 text-sm text-red-400">
          Could not load reports: {error.message}. Check that the database migration has been applied.
        </p>
      )}

      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-xs text-gray-400">Latest</div>
          <div className="text-2xl font-bold">{latest ? Math.round(Number(latest.health_score)) : "–"}</div>
          {latest && <div className="text-xs text-emerald-400">{ratingLabel(Number(latest.health_score))}</div>}
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-xs text-gray-400">Average</div>
          <div className="text-2xl font-bold">{avg ?? "–"}</div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="text-xs text-gray-400">Audits</div>
          <div className="text-2xl font-bold">{list.length}</div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Audit history</h2>
        <Link href="/audit" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-xl">
          New audit
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-400">No saved audits yet. Run an audit while signed in and it will appear here.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.business?.name || "Unnamed business"}</div>
                <div className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{Math.round(Number(r.health_score))}</div>
                <div className="text-xs text-gray-400">ELOS: {r.elos_status}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
