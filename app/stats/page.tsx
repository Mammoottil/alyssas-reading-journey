import { getStats, getAllBooks, getReadingGoal } from "@/lib/books";
import GoalProgressBar from "@/components/GoalProgressBar";

export default function StatsPage() {
  const stats = getStats();
  const books = getAllBooks();
  const goal = getReadingGoal();
  const readBooks = books.filter((b) => b.status === "read");

  // Books by rating
  const ratingDist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  readBooks.forEach((b) => { if (b.rating) ratingDist[b.rating] = (ratingDist[b.rating] || 0) + 1; });

  // Books by month
  const monthlyData: Record<string, number> = {};
  readBooks.forEach((b) => {
    if (b.dateRead) {
      const key = b.dateRead.slice(0, 7);
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    }
  });
  const months = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b)).slice(-12);
  const maxMonthly = Math.max(1, ...months.map(([, v]) => v));

  // Genre breakdown
  const genreEntries = Object.entries(stats.genreCounts).sort((a, b) => b[1] - a[1]);
  const maxGenre = Math.max(1, ...genreEntries.map(([, v]) => v));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 fade-up space-y-10">
      <div>
        <h1 className="font-serif text-5xl font-black text-ink-900 mb-2">Reading Statistics</h1>
        <p className="text-ink-600">Your reading journey in numbers</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Books Read", value: stats.totalRead, icon: "📚", color: "bg-sage-50 border-sage-200" },
          { label: "Pages Turned", value: stats.totalPages.toLocaleString(), icon: "📄", color: "bg-amber-50 border-amber-200" },
          { label: "Avg Rating", value: `${stats.avgRating} ★`, icon: "⭐", color: "bg-cream-100 border-amber-100" },
          { label: "Top Genre", value: stats.topGenre, icon: "🏷", color: "bg-blush-100 border-blush-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-serif text-2xl font-bold text-ink-900">{s.value}</div>
            <div className="text-xs text-ink-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Goal */}
      <GoalProgressBar goal={goal} />

      {/* Monthly reading chart */}
      {months.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Books Read by Month</h2>
          <div className="flex items-end gap-2 h-40">
            {months.map(([month, count]) => {
              const pct = (count / maxMonthly) * 100;
              const label = new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              return (
                <div key={month} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                  <span className="text-xs text-ink-500">{count}</span>
                  <div className="w-full bg-sage-400 rounded-t-md transition-all" style={{ height: `${pct}%`, minHeight: "4px" }} />
                  <span className="text-xs text-ink-400 truncate w-full text-center">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating distribution */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
        <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((r) => {
            const count = ratingDist[r] || 0;
            const pct = stats.totalRead > 0 ? Math.round((count / stats.totalRead) * 100) : 0;
            return (
              <div key={r} className="flex items-center gap-3">
                <span className="text-sm text-ink-600 w-16 flex-shrink-0">{"★".repeat(r)}</span>
                <div className="flex-1 h-3 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cream-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-ink-400 w-10 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Genre breakdown */}
      {genreEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Genre Breakdown</h2>
          <div className="space-y-3">
            {genreEntries.map(([g, count]) => {
              const pct = Math.round((count / maxGenre) * 100);
              return (
                <div key={g} className="flex items-center gap-3">
                  <span className="text-sm text-ink-700 w-40 flex-shrink-0 font-medium truncate">{g}</span>
                  <div className="flex-1 h-3 bg-cream-200 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-ink-400 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All read books table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 overflow-x-auto">
        <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Reading Log</h2>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left border-b border-cream-200">
              <th className="pb-3 text-ink-400 font-medium">Title</th>
              <th className="pb-3 text-ink-400 font-medium">Author</th>
              <th className="pb-3 text-ink-400 font-medium">Pages</th>
              <th className="pb-3 text-ink-400 font-medium">Rating</th>
              <th className="pb-3 text-ink-400 font-medium">Date Read</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {readBooks.map((book) => (
              <tr key={book.slug} className="hover:bg-cream-50 transition-colors">
                <td className="py-3 font-serif font-medium text-ink-900 pr-4">{book.title}</td>
                <td className="py-3 text-ink-600 pr-4">{book.author}</td>
                <td className="py-3 text-ink-500">{book.pages}</td>
                <td className="py-3 text-amber-500">{"★".repeat(book.rating || 0)}</td>
                <td className="py-3 text-ink-400">
                  {book.dateRead ? new Date(book.dateRead).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
