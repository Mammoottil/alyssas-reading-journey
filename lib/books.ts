import fs from "fs";
import path from "path";
import matter from "gray-matter";

const booksFile = path.join(process.cwd(), "content/books.json");
const quotesDir = path.join(process.cwd(), "content/quotes");

export interface Book {
  slug: string;
  title: string;
  author: string;
  cover: string;
  genre: string[];
  status: "read" | "currently-reading" | "want-to-read";
  rating: number;
  dateRead?: string;
  dateStarted?: string;
  pages: number;
  pagesRead?: number;
  review?: string;
  quote?: string;
  favorite: boolean;
}

interface BookJsonEntry {
  slug: string;
  title: string;
  author: string;
  status: Book["status"];
  rating: number;
  dateRead?: string;
  dateStarted?: string;
  genre: string | string[];
  review?: string;
  pages: number;
  pagesRead?: number;
  quote?: string;
  favorite: boolean;
  cover?: string;
}

function normalizeBook(entry: BookJsonEntry): Book {
  const genre = Array.isArray(entry.genre) ? entry.genre : [entry.genre];
  return {
    slug: entry.slug,
    title: entry.title,
    author: entry.author,
    cover: entry.cover ?? "",
    genre,
    status: entry.status,
    rating: entry.rating,
    dateRead: entry.dateRead || undefined,
    dateStarted: entry.dateStarted || undefined,
    pages: entry.pages,
    pagesRead: entry.pagesRead,
    review: entry.review || undefined,
    quote: entry.quote || undefined,
    favorite: entry.favorite,
  };
}

function loadBooks(): Book[] {
  if (!fs.existsSync(booksFile)) return [];
  const raw = fs.readFileSync(booksFile, "utf8");
  const entries = JSON.parse(raw) as BookJsonEntry[];
  return entries.map(normalizeBook);
}

export function getAllBooks(): Book[] {
  return loadBooks().sort((a, b) => {
    if (a.dateRead && b.dateRead) return b.dateRead.localeCompare(a.dateRead);
    return 0;
  });
}

export function getBookBySlug(slug: string): Book | null {
  return getAllBooks().find((book) => book.slug === slug) ?? null;
}

export interface Quote {
  slug: string;
  text: string;
  book: string;
  author: string;
  page?: number;
  favorite: boolean;
}

export interface ReadingGoal {
  year: number;
  target: number;
  current: number;
}

export function getAllQuotes(): Quote[] {
  if (!fs.existsSync(quotesDir)) return [];
  const files = fs.readdirSync(quotesDir).filter((f) => f.endsWith(".md"));
  return files.flatMap((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(quotesDir, file), "utf8");
    const { data } = matter(raw);
    const quotes: Quote[] = (data.quotes || []).map(
      (q: Omit<Quote, "slug" | "author">, i: number) => ({
        slug: `${slug}-${i}`,
        author: data.author,
        ...q,
      })
    );
    return quotes;
  });
}

export function getReadingGoal(): ReadingGoal {
  const books = getAllBooks();
  const year = new Date().getFullYear();
  const read = books.filter(
    (b) => b.status === "read" && b.dateRead?.startsWith(String(year))
  ).length;
  return { year, target: 24, current: read };
}

export function getStats() {
  const books = getAllBooks();
  const read = books.filter((b) => b.status === "read");
  const totalPages = read.reduce((s, b) => s + (b.pages || 0), 0);
  const avgRating =
    read.length > 0
      ? (read.reduce((s, b) => s + (b.rating || 0), 0) / read.length).toFixed(1)
      : "0.0";
  const genreCounts: Record<string, number> = {};
  read.forEach((b) =>
    (b.genre || []).forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    })
  );
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  return {
    totalRead: read.length,
    totalPages,
    avgRating,
    topGenre: topGenre?.[0] || "—",
    genreCounts,
  };
}
