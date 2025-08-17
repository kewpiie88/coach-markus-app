import Link from "next/link";

export function Button({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-block rounded-xl bg-rose-600 px-4 py-2 font-medium hover:bg-rose-500">
      {children}
    </Link>
  );
}
