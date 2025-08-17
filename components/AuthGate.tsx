'use client';
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/signin");
      else setReady(true);
    });
  }, [router]);
  if (!ready) return <div className="text-sm text-zinc-400">Loading…</div>;
  return <>{children}</>;
}
