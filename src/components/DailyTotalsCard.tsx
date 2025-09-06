type Props = {
  date: string;
  calories: number;
  exerciseCount: number;
  exercisePrimaryType?: "strength" | "cardio" | "yoga" | null;
  spend: number;
};

export default function DailyTotalsCard({ date, calories, exerciseCount, exercisePrimaryType, spend }: Props) {
  const withinCal = calories <= 1200;
  return (
    <div className="card space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Totals — {date}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${withinCal ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}`}>
          {withinCal ? "Within 1200" : "Over 1200"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-gray-500 dark:text-neutral-400">Calories</div>
          <div className="kpi">{calories}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-neutral-400">Exercise</div>
          <div className="kpi">{exerciseCount}x{exercisePrimaryType ? ` • ${exercisePrimaryType}` : ""}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-neutral-400">Spend</div>
          <div className="kpi">${spend.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
