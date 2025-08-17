import AuthGate from "@/components/AuthGate";
import Card from "@/components/Card";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function Checkin() {
  return (
    <AuthGate>
      <Card>
        <h2 className="text-xl font-semibold mb-3">Daily Check-in</h2>
        <form action={saveCheckin} className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-zinc-300">Workout Type</label>
            <select name="workout_type" className="w-full rounded bg-zinc-900 border border-zinc-800 p-2">
              <option>Strength</option>
              <option>Cardio</option>
              <option>Mobility</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300">RPE (1-10)</label>
            <input name="rpe" type="number" min="1" max="10" className="w-full rounded bg-zinc-900 border border-zinc-800 p-2" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300">Reps (optional)</label>
            <input name="reps" type="number" className="w-full rounded bg-zinc-900 border border-zinc-800 p-2" />
          </div>
          <button className="rounded bg-rose-600 px-4 py-2 mt-2 md:mt-6">Submit</button>
        </form>
      </Card>
    </AuthGate>
  );
}

async function saveCheckin(formData: FormData) {
  "use server";
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const workout_type = String(formData.get("workout_type") || "Strength");
  const rpe = Number(formData.get("rpe") || 6);
  const reps = Number(formData.get("reps") || 0);

  // Fetch tier for points
  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  const tier = profile?.tier || "Free";
  const basePoints = tier === "Beginner" ? 5 : tier === "Intermediate" ? 8 : tier === "Advanced" ? 10 : tier === "PRO" ? 12 : 2;
  const points = basePoints + (rpe >= 8 ? 2 : 0);

  await supabase.from("checkins").insert({
    user_id: user.id,
    workout_type,
    rpe,
    reps,
    points_awarded: points
  });

  // Update streak in a simple RPC (see schema.sql)
  await supabase.rpc("touch_streak", { p_user_id: user.id });
  revalidatePath("/leaderboard");
}
