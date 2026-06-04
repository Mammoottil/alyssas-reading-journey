"use client";
import { useState, useMemo } from "react";
import BookCard from "@/components/BookCard";
import type { Book } from "@/lib/books";

export default function BooksClient({ books }: { books: Book[] }) {
  const [status, setStatus] = useState<string>("all");
  const [genre, setGenre] = useState<string>("all");
  const [sort, setSort] = useState<string>("date");

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => b.genre?.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [books]);

  const filtered = useMemo(() => {
    let result = [...books];
    if (status !== "all") result = result.filter((b) => b.status === status);
    if (genre !== "all") result = result.filter((b) => b.genre?.includes(genre));
    if (sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    else result.sort((a, b) => {
      const da = a.dateRead || a.dateStarted || "";
      const db = b.dateRead || b.dateStarted || "";
      return db.localeCompare(da);
    });
    return result;
  }, [books, status, genre, sort]);

  const statuses = [
    { value: "all", label: "All Books" },
    { value: "read", label: "Read" },
    { value: "currently-reading", label: "Reading" },
    { value: "want-to-read", label: "Want to Read" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 fade-up">
      <div className="mb-10">
        <h1 className="font-serif text-5xl font-black text-ink-900 mb-2">The Library</h1>
        <p className="text-ink-600">{books.length} books catalogued</p>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 p-5 bg-white rounded-2xl border border-amber-100 shadow-sm">
        {[
          { id: "status", label: "Status", value: status, onChange: setStatus, options: statuses.map(s => ({ value: s.value, label: s.label })) },
          { id: "genre", label: "Genre", value: genre, onChange: setGenre, options: [{ value: "all", label: "All Genres" }, ...allGenres.map(g => ({ value: g, label: g }))] },
          { id: "sort", label: "Sort by", value: sort, onChange: setSort, options: [{ value: "date", label: "Date" }, { value: "rating", label: "Rating" }, { value: "title", label: "Title A–Z" }] },
        ].map((f) => (
          <div key={f.id} className="flex flex-col gap-1.5 flex-1 min-w-36">
            <label className="text-xs font-medium text-ink-500 uppercase tracking-wide">{f.label}</label>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="border border-amber-200 rounded-lg px-3 py-2 text-sm bg-cream-50 text-ink-900 focus:outline-none focus:ring-2 focus:ring-sage-300"
            >
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>
      <p className="text-sm text-ink-500 mb-5">Showing {filtered.length} {filtered.length === 1 ? "book" : "books"}</p>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((book) => <BookCard key={book.slug} book={book} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-ink-400">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 font-serif text-xl">No books found</p>
          <p className="text-sm mt-1">Try changing your filters</p>
        </div>
      )}
    </div>
  );
}
