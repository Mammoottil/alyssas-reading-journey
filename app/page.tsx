import Link from "next/link";
import { getAllBooks, getReadingGoal, getAllQuotes } from "@/lib/books";
import BookCard from "@/components/BookCard";
import GoalProgressBar from "@/components/GoalProgressBar";

export default function HomePage() {
  const books = getAllBooks();
  const goal = getReadingGoal();
  const quotes = getAllQuotes();
  const currentlyReading = books.filter((b) => b.status === "currently-reading");
  const recentlyRead = books.filter((b) => b.status === "read").slice(0, 4);
  const featuredQuote = quotes.find((q) => q.favorite);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 fade-up">
      {/* Hero */}
      <section className="text-center space-y-6 py-8">
        <div className="inline-block">
          <span className="font-mono text-xs tracking-widest text-sage-500 uppercase border border-sage-200 rounded-full px-4 py-1 bg-sage-50">
            A Personal Reading Journal
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-black text-ink-900 leading-tight">
          Alyssa's{" "}
          <span className="italic text-sage-500">Reading</span>
          <br />
          Journey
        </h1>
        <p className="text-ink-600 max-w-md mx-auto text-lg leading-relaxed">
          Tracking books, collecting quotes, and wandering through worlds built from words.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/books"
            className="bg-ink-900 text-cream-50 px-6 py-3 rounded-full font-medium hover:bg-ink-700 transition-colors"
          >
            Browse All Books
          </Link>
          <Link
            href="/quotes"
            className="border border-ink-900 text-ink-900 px-6 py-3 rounded-full font-medium hover:bg-cream-200 transition-colors"
          >
            Favorite Quotes
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: "Books Read", value: books.filter((b) => b.status === "read").length },
          { label: "Currently Reading", value: currentlyReading.length },
          { label: "Want to Read", value: books.filter((b) => b.status === "want-to-read").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-amber-100 shadow-sm py-6 px-4">
            <div className="font-serif text-4xl font-bold text-ink-900">{stat.value}</div>
            <div className="text-sm text-ink-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Reading Goal */}
      <section>
        <GoalProgressBar goal={goal} />
      </section>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-900 mb-6 flex items-center gap-3">
            <span>📖</span> Currently Reading
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentlyReading.map((book) => (
              <div key={book.slug} className="space-y-3">
                <BookCard book={book} />
                {book.pagesRead && book.pages && (
                  <div className="px-1">
                    <div className="flex justify-between text-xs text-ink-500 mb-1">
                      <span>Page {book.pagesRead}</span>
                      <span>{book.pages} total</span>
                    </div>
                    <div className="h-1.5 bg-cream-200 rounded-full">
                      <div
                        className="h-full bg-blush-400 rounded-full"
                        style={{ width: `${Math.round((book.pagesRead / book.pages) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Quote */}
      {featuredQuote && (
        <section className="bg-ink-900 text-cream-100 rounded-3xl p-10 text-center space-y-4">
          <span className="font-serif text-6xl text-sage-400 leading-none">"</span>
          <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed max-w-2xl mx-auto">
            {featuredQuote.text}
          </blockquote>
          <p className="text-cream-300 text-sm">
            — {featuredQuote.author}, <span className="italic">{featuredQuote.book}</span>
          </p>
          <Link href="/quotes" className="inline-block mt-2 text-sage-300 text-sm hover:text-sage-200 underline">
            More quotes →
          </Link>
        </section>
      )}

      {/* Recently Read */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-3xl font-bold text-ink-900 flex items-center gap-3">
            <span>✨</span> Recently Read
          </h2>
          <Link href="/books" className="text-sage-500 text-sm font-medium hover:text-sage-700">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {recentlyRead.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
