import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Coach Markus",
  description: "Online training with tiers, videos, and leaderboards."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full py-4">
          <nav className="mx-auto max-w-5xl flex items-center justify-between px-4">
            <Link href="/" className="text-xl font-semibold">Coach Markus</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/pricing">Pricing</Link>
              <Link href="/videos">Videos</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-12 text-sm text-zinc-400">
          © {new Date().getFullYear()} Coach Markus
        </footer>
      </body>
    </html>
  );
}
