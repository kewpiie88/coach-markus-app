import Card from "@/components/Card";
import { createServerClient } from "@/lib/supabase/server";

export default async function Leaderboard() {
  const supabase = createServerClient();
  const { data: rows } = await supabase.from("leaderboard_weekly").select("*").order("points", { ascending: false }).limit(25);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Leaderboard (This Week)</h1>
      <Card>
        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr>
              <th className="text-left py-2">Rank</th>
              <th className="text-left">Name</th>
              <th className="text-left">Tier</th>
              <th className="text-left">Points</th>
              <th className="text-left">Streak</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((r, i) => (
              <tr key={r.user_id} className="border-t border-zinc-800">
                <td className="py-2">{i+1}</td>
                <td>{r.display_name || r.email}</td>
                <td>{r.tier}</td>
                <td>{r.points}</td>
                <td>{r.streak}</td>
              </tr>
            )) || <tr><td>No entries yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
