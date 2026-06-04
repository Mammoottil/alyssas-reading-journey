import { getAllBooks } from "@/lib/books";
import BooksClient from "@/components/BooksClient";

export default function BooksPage() {
  const books = getAllBooks();
  return <BooksClient books={books} />;
}
