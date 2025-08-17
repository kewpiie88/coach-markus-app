import AuthGate from "@/components/AuthGate";
import Card from "@/components/Card";
import { createServerClient } from "@/lib/supabase/server";

export default async function Videos() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("tier").eq("id", user?.id).maybeSingle();
  const tier = profile?.tier ?? "Free";
  const { data: videos } = await supabase.from("videos")
    .select("id,title,youtube_url,level,body_part, min_tier")
    .lte("min_tier", tier)
    .order("body_part");

  return (
    <AuthGate>
      <div className="grid md:grid-cols-2 gap-6">
        {videos?.map(v => (
          <Card key={v.id}>
            <h3 className="font-semibold">{v.title}</h3>
            <p className="text-sm text-zinc-400 mb-2">{v.body_part} • {v.level}</p>
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${extractId(v.youtube_url)}`} allowFullScreen />
            </div>
          </Card>
        )) || <p>No videos yet.</p>}
      </div>
    </AuthGate>
  );
}

function extractId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  return m ? m[1] : url;
}
