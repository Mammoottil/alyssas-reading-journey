import { getAllQuotes } from "@/lib/books";
import QuotesClient from "@/components/QuotesClient";

export default function QuotesPage() {
  const quotes = getAllQuotes();
  return <QuotesClient quotes={quotes} />;
}
