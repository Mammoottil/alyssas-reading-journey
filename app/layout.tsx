import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Alyssa's Reading Journey",
  description: "A personal reading journal — books, quotes, and literary adventures.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-content min-h-screen flex flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-amber-200 py-8 text-center">
            <p className="font-serif italic text-ink-600 text-sm opacity-60">
              "A reader lives a thousand lives before he dies." — George R.R. Martin
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
