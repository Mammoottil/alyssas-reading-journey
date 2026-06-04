import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const booksDir = path.join(process.cwd(), "content/books");
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
  synopsis: string;
  review?: string;
  favorite: boolean;
  contentHtml?: string;
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

export function getAllBooks(): Book[] {
  if (!fs.existsSync(booksDir)) return [];
  const files = fs.readdirSync(booksDir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(booksDir, file), "utf8");
      const { data } = matter(raw);
      return { slug, ...data } as Book;
    })
    .sort((a, b) => {
      if (a.dateRead && b.dateRead) return b.dateRead.localeCompare(a.dateRead);
      return 0;
    });
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const filePath = path.join(booksDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return { slug, ...data, contentHtml: processed.toString() } as Book;
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
