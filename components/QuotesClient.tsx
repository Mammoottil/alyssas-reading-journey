"use client";
import { useState, useMemo } from "react";
import type { Quote } from "@/lib/books";

const colors = [
  "bg-sage-50 border-sage-200",
  "bg-blush-100 border-blush-200",
  "bg-amber-50 border-amber-200",
  "bg-cream-100 border-amber-100",
];

export default function QuotesClient({ quotes }: { quotes: Quote[] }) {
  const [filter, setFilter] = useState("all");
  const books = useMemo(() => Array.from(new Set(quotes.map((q) => q.book))).sort(), [quotes]);

  const filtered = useMemo(() => {
    if (filter === "favorites") return quotes.filter((q) => q.favorite);
    if (filter === "all") return quotes;
    return quotes.filter((q) => q.book === filter);
  }, [quotes, filter]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 fade-up">
      <div className="mb-10">
        <h1 className="font-serif text-5xl font-black text-ink-900 mb-2">Favorite Quotes</h1>
        <p className="text-ink-600">{quotes.length} quotes collected</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-10">
        {[
          { value: "all", label: "All Quotes" },
          { value: "favorites", label: "❤ Favorites" },
          ...books.map((b) => ({ value: b, label: b })),
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === opt.value ? "bg-ink-900 text-cream-50" : "border border-amber-200 text-ink-600 hover:border-ink-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="columns-1 md:columns-2 gap-5 space-y-5">
        {filtered.map((quote, i) => (
          <div key={quote.slug} className={`break-inside-avoid rounded-2xl border p-6 ${colors[i % colors.length]}`}>
            <div className="font-serif text-4xl text-ink-400 leading-none mb-2">"</div>
            <blockquote className="font-serif text-lg italic text-ink-800 leading-relaxed mb-4">{quote.text}</blockquote>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink-700">{quote.author}</p>
                <p className="text-xs text-ink-400 italic">{quote.book}{quote.page ? `, p. ${quote.page}` : ""}</p>
              </div>
              {quote.favorite && <span className="text-blush-400 text-xl flex-shrink-0">♥</span>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-ink-400">
          <span className="text-5xl">💬</span>
          <p className="mt-4 font-serif text-xl">No quotes found</p>
        </div>
      )}
    </div>
  );
}
