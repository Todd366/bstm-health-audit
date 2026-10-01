import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = "/dashboard";
  const raw = request.cookies.get("bstm_next")?.value;
  if (raw) {
    try {
      const d = decodeURIComponent(raw);
      if (d.startsWith("/") && !d.startsWith("//")) next = d;
    } catch {}
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const res = NextResponse.redirect(`${origin}${next}`);
      res.cookies.delete("bstm_next");
      return res;
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
