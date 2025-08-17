import Card from "@/components/Card";
import { createServerClient } from "@/lib/supabase/server";

export default async function Admin() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user?.id).maybeSingle();
  const isAdmin = profile?.role === "admin";
  if (!isAdmin) return <div>Not authorized.</div>;

  const { data: videos } = await supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(20);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <Card>
        <h3 className="font-semibold mb-2">Add Video</h3>
        <form action={addVideo} className="grid md:grid-cols-2 gap-3">
          <input name="title" placeholder="Title" className="rounded bg-zinc-900 border border-zinc-800 p-2" />
          <input name="youtube_url" placeholder="YouTube URL" className="rounded bg-zinc-900 border border-zinc-800 p-2" />
          <input name="body_part" placeholder="Body Part (e.g., legs, push, pull)" className="rounded bg-zinc-900 border border-zinc-800 p-2" />
          <select name="level" className="rounded bg-zinc-900 border border-zinc-800 p-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>PRO</option>
          </select>
          <select name="min_tier" className="rounded bg-zinc-900 border border-zinc-800 p-2">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>PRO</option>
          </select>
          <button className="rounded bg-rose-600 px-4 py-2">Save</button>
        </form>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Recent Videos</h3>
        <ul className="text-sm text-zinc-300 space-y-1">
          {videos?.map(v => <li key={v.id}>{v.title} — {v.level} • {v.body_part}</li>) || <li>None</li>}
        </ul>
      </Card>
    </div>
  );
}

async function addVideo(formData: FormData) {
  "use server";
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return;

  const title = String(formData.get("title") || "");
  const youtube_url = String(formData.get("youtube_url") || "");
  const body_part = String(formData.get("body_part") || "");
  const level = String(formData.get("level") || "Beginner");
  const min_tier = String(formData.get("min_tier") || "Beginner");

  await supabase.from("videos").insert({ title, youtube_url, body_part, level, min_tier });
}
