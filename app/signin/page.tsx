'use client';
import { createBrowserClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createBrowserClient();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
    if (!error) setSent(true);
    else alert(error.message);
  };
  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
      <p className="text-sm text-zinc-400 mb-4">Magic link will be sent to your email.</p>
      {sent ? <p>Check your email for the link.</p> : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded bg-zinc-900 border border-zinc-800 p-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="rounded bg-rose-600 px-4 py-2">Send link</button>
        </form>
      )}
    </div>
  );
}
