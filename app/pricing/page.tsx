import Card from "@/components/Card";

const TIERS = [
  { name: "Beginner", priceId: process.env.NEXT_PUBLIC_PRICE_BEGINNER, price: 7, perks: ["Light, easy workouts","Weekly check-ins","Motivation group","Live stream notifications"] },
  { name: "Intermediate", priceId: process.env.NEXT_PUBLIC_PRICE_INTERMEDIATE, price: 10, perks: ["Structured programming","Progress tracking","Motivation group","Live stream notifications"] },
  { name: "Advanced", priceId: process.env.NEXT_PUBLIC_PRICE_ADVANCED, price: 15, perks: ["Strength & hypertrophy splits","Weekly check-ins","Custom meal plan","Motivation group"] },
  { name: "PRO", priceId: process.env.NEXT_PUBLIC_PRICE_PRO, price: 20, perks: ["Pro-level programming","Recovery focus","Mindset coaching","Priority DM access"] },
];

export default function Pricing() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {TIERS.map(t => (
        <Card key={t.name}>
          <h3 className="text-xl font-semibold">{t.name}</h3>
          <p className="text-3xl font-bold my-2">${t.price}<span className="text-base text-zinc-400">/mo</span></p>
          <ul className="text-sm text-zinc-300 list-disc ml-5 space-y-1">
            {t.perks.map(p => <li key={p}>{p}</li>)}
          </ul>
          <form action="/api/checkout" method="POST" className="mt-4">
            <input type="hidden" name="priceId" value={t.priceId || ""} />
            <button className="rounded bg-rose-600 px-4 py-2">Join {t.name}</button>
          </form>
        </Card>
      ))}
    </div>
  );
}
