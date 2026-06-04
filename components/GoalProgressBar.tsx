import type { ReadingGoal } from "@/lib/books";

export default function GoalProgressBar({ goal }: { goal: ReadingGoal }) {
  const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-serif font-bold text-ink-900 text-lg">{goal.year} Reading Goal</h2>
          <p className="text-sm text-ink-600">
            {goal.current} of {goal.target} books
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-serif font-bold text-sage-500">{pct}%</span>
        </div>
      </div>
      <div className="h-4 bg-cream-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full progress-fill"
          style={{ "--target-width": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <p className="text-xs text-ink-500 mt-2">
        {goal.target - goal.current > 0
          ? `${goal.target - goal.current} more to reach your goal 🎯`
          : "Goal achieved! 🎉"}
      </p>
    </div>
  );
}
