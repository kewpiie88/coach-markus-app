export default function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <div className={`card p-6 ${className}`}>{children}</div>;
}
