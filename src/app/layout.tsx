import "./globals.css";
import Providers from "./providers";
import Link from "next/link";

export const metadata = {
  title: "Life Ledger",
  description: "Track calories, exercise, and spend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="border-b border-gray-200 dark:border-neutral-800">
            <div className="container py-4 flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold">Life Ledger</Link>
              <nav className="flex gap-4 text-sm">
                <Link href="/dashboard">Dashboard</Link>
                <Link href={`/day/${new Date().toISOString().slice(0,10)}`}>Today</Link>
              </nav>
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
