'use client';
import { createBrowserClient as createSB } from "@supabase/ssr";
export function createBrowserClient() {
  return createSB(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
