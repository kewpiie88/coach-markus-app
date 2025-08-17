import AuthGate from "@/components/AuthGate";
import Card from "@/components/Card";
import { createServerClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).maybeSingle();
  const { data: streak } = await supabase.rpc("get_user_streak", { p_user_id: user?.id });

  return (
    <AuthGate>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-xl font-semibold">Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}</h2>
          <p className="text-zinc-400 text-sm mt-2">Tier: <b>{profile?.tier ?? "Free"}</b></p>
          <p className="text-zinc-400 text-sm mt-1">Streak: <b>{streak ?? 0}</b> days</p>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Quick links</h3>
          <ul className="list-disc ml-5 text-zinc-300 space-y-1">
            <li><a href="/checkin">Daily check-in</a></li>
            <li><a href="/videos">Form tips & videos</a></li>
            <li><a href="/leaderboard">Leaderboard</a></li>
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold mb-2">Upgrade</h3>
          <p className="text-sm text-zinc-400">Want a structured plan and priority support? Choose your tier.</p>
          <a className="inline-block mt-3 rounded bg-rose-600 px-4 py-2" href="/pricing">See pricing</a>
        </Card>
      </div>
    </AuthGate>
  );
}
