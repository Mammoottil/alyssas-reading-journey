import { getAllBooks, getBookBySlug } from "@/lib/books";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  return { title: book ? `${book.title} — Alyssa's Reading Journey` : "Book Not Found" };
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  "read": { label: "Finished", color: "bg-sage-100 text-sage-700 border-sage-200", icon: "✓" },
  "currently-reading": { label: "Currently Reading", color: "bg-blush-100 text-blush-500 border-blush-200", icon: "📖" },
  "want-to-read": { label: "Want to Read", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "☆" },
};

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) notFound();

  const sc = statusConfig[book.status];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 fade-up">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors">
        ← Back to Library
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        {/* Left: Cover + meta */}
        <div className="space-y-5">
          <div className="rounded-2xl overflow-hidden shadow-xl bg-cream-200 aspect-[2/3]">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">📖</span>
              </div>
            )}
          </div>

          {/* Meta card */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${sc.color}`}>
                {sc.icon} {sc.label}
              </span>
              {book.favorite && <span className="text-blush-400 text-lg">♥</span>}
            </div>

            {book.rating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-ink-500">Rating</span>
                <StarRating rating={book.rating} />
              </div>
            )}

            <div className="space-y-2 pt-1 border-t border-cream-200">
              {[
                { label: "Author", value: book.author },
                { label: "Pages", value: book.pages?.toLocaleString() },
                { label: "Date Read", value: book.dateRead ? new Date(book.dateRead).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null },
              ]
                .filter((item) => item.value)
                .map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-ink-400">{label}</span>
                    <span className="text-ink-700 font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
            </div>

            {book.genre && book.genre.length > 0 && (
              <div className="pt-1 border-t border-cream-200">
                <p className="text-ink-400 mb-2">Genre</p>
                <div className="flex flex-wrap gap-1.5">
                  {book.genre.map((g) => (
                    <span key={g} className="text-xs bg-cream-200 text-ink-600 rounded-full px-2.5 py-0.5">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress for currently reading */}
          {book.status === "currently-reading" && book.pagesRead && book.pages && (
            <div className="bg-blush-100 rounded-2xl border border-blush-200 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blush-600 font-medium">Progress</span>
                <span className="text-blush-500">{Math.round((book.pagesRead / book.pages) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full">
                <div
                  className="h-full bg-blush-400 rounded-full"
                  style={{ width: `${Math.round((book.pagesRead / book.pages) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-blush-500 mt-1.5">Page {book.pagesRead} of {book.pages}</p>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-black text-ink-900 leading-tight mb-2">{book.title}</h1>
            <p className="text-ink-500 text-lg">by {book.author}</p>
          </div>

          {book.synopsis && (
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-3">Synopsis</h2>
              <p className="text-ink-700 leading-relaxed">{book.synopsis}</p>
            </div>
          )}

          {book.review && (
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-3">My Review</h2>
              <div className="pull-quote">
                <p className="text-ink-700 leading-relaxed italic">{book.review}</p>
              </div>
            </div>
          )}

          {book.contentHtml && (
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-3">Notes</h2>
              <div
                className="prose prose-stone max-w-none text-ink-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: book.contentHtml }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
