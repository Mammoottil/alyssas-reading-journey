import Link from "next/link";
import type { Book } from "@/lib/books";
import StarRating from "./StarRating";

export default function BookCard({ book }: { book: Book }) {
  const statusColors: Record<string, string> = {
    "read": "bg-sage-100 text-sage-600",
    "currently-reading": "bg-blush-100 text-blush-500",
    "want-to-read": "bg-amber-100 text-amber-700",
  };

  const statusLabels: Record<string, string> = {
    "read": "Read",
    "currently-reading": "Reading",
    "want-to-read": "Want to Read",
  };

  return (
    <Link href={`/books/${book.slug}`} className="block group">
      <div className="book-card bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm h-full flex flex-col">
        {/* Cover */}
        <div className="relative aspect-[2/3] overflow-hidden bg-cream-200">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sage-100 to-cream-200">
              <span className="text-5xl">📖</span>
            </div>
          )}
          {book.favorite && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow">
              ♥
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <div>
            <h3 className="font-serif font-bold text-ink-900 leading-snug line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-ink-600 mt-0.5">{book.author}</p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[book.status]}`}>
              {statusLabels[book.status]}
            </span>
            {book.rating > 0 && <StarRating rating={book.rating} />}
          </div>
        </div>
      </div>
    </Link>
  );
}
