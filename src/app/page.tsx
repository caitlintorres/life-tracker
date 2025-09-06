import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Life Ledger</h1>
      <p>Track your daily calories, exercise, and spending with a monthly budget.</p>
      <div className="flex gap-3">
        <Link href="/dashboard" className="btn">Go to Dashboard</Link>
        <Link href={`/day/${new Date().toISOString().slice(0,10)}`} className="btn">Log Today</Link>
      </div>
    </div>
  );
}
