import { createServerClient as createSB } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerClient() {
  const cookieStore = cookies();
  return createSB(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options}); },
      remove(name: string, options: any) { cookieStore.set({ name, value: "", ...options}); }
    }
  });
}
