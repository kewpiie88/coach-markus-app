import Card from "@/components/Card";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Train like a champion. Stay consistent.</h1>
          <p className="text-zinc-400">Join the squad that actually shows up. Programs by Coach Markus, short video guides, weekly challenges, and a live leaderboard.</p>
          <div className="flex gap-3">
            <Button href="/pricing">Choose your tier</Button>
            <Button href="/signin">Sign in</Button>
          </div>
        </div>
        <Card>
          <h3 className="text-xl font-semibold mb-2">This week’s challenge</h3>
          <ul className="list-disc ml-5 text-zinc-300">
            <li>Complete 4 sessions</li>
            <li>Hold your streak</li>
            <li>Watch 2 form tips</li>
          </ul>
          <p className="text-zinc-400 mt-4 text-sm">Get points for every check-in. Top 5 appear on the leaderboard.</p>
        </Card>
      </section>
    </div>
  );
}
