"use client";

import { useQuery } from "@tanstack/react-query";
import DailyTotalsCard from "@/components/DailyTotalsCard";
import { supabase } from "@/lib/supabaseClient";

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10);
  const end = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().slice(0,10);
  return { start, end };
}

export default function DashboardPage() {
  const today = new Date().toISOString().slice(0,10);
  const { start, end } = monthBounds();

  const daysQuery = useQuery({
    queryKey: ["days", start, end],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("days")
        .select("*")
        .gte("date", start)
        .lte("date", end)
        .order("date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    }
  });

  const budgetQuery = useQuery({
    queryKey: ["budget", start],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_budgets")
        .select("*")
        .eq("month", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10))
        .maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const spendToDate = (daysQuery.data ?? []).reduce((sum: number, d: any) => sum + Number(d.spend_total || 0), 0);
  const caloriesAvg = (daysQuery.data ?? []).reduce((sum: number, d: any) => sum + Number(d.calories_total || 0), 0) / Math.max(1, (daysQuery.data ?? []).length);
  const exerciseDays = (daysQuery.data ?? []).filter((d: any) => Number(d.exercise_count || 0) > 0).length;
  const budget = Number(budgetQuery.data?.budget || 0);
  const percent = budget ? Math.min(100, Math.round((spendToDate / budget) * 100)) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Monthly Budget</div>
          <div className="text-sm text-gray-500 dark:text-neutral-400">Month-to-date</div>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 text-sm">
          ${spendToDate.toFixed(2)} / ${budget.toFixed(2)} ({percent}%)
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Avg Calories</div>
          <div className="kpi">{Math.round(caloriesAvg || 0)}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Exercise Days</div>
          <div className="kpi">{exerciseDays}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-500 dark:text-neutral-400">Days Logged</div>
          <div className="kpi">{(daysQuery.data ?? []).length}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">This Month</h2>
        <div className="grid gap-3">
          {(daysQuery.data ?? []).map((d: any) => (
            <DailyTotalsCard key={d.date} date={d.date} calories={d.calories_total || 0} exerciseCount={d.exercise_count || 0} exercisePrimaryType={d.exercise_primary_type} spend={Number(d.spend_total || 0)} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Quick Links</div>
            <div className="text-sm text-gray-500 dark:text-neutral-400">Jump to today to log entries</div>
          </div>
          <a href={`/day/${today}`} className="btn">Go to Today</a>
        </div>
      </div>
    </div>
  );
}
