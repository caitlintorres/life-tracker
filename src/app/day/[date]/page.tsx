"use client";

import DailyTotalsCard from "@/components/DailyTotalsCard";
import QuickAddCalories from "@/components/QuickAddCalories";
import QuickAddExercise from "@/components/QuickAddExercise";
import QuickAddSpend from "@/components/QuickAddSpend";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export default function DayPage() {
  const params = useParams<{ date: string }>();
  const date = params.date;

  const dayQuery = useQuery({
    queryKey: ["day", date],
    queryFn: async () => {
      // Ensure the day row exists (server will upsert via function)
      const { data, error } = await supabase.rpc("fn_upsert_day", { p_date: date });
      if (error) throw error;
      // Return day
      const { data: day, error: err2 } = await supabase.from("days").select("*").eq("date", date).maybeSingle();
      if (err2) throw err2;
      return day;
    }
  });

  const day = dayQuery.data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Daily Log — {date}</h1>

      <DailyTotalsCard
        date={date}
        calories={day?.calories_total || 0}
        exerciseCount={day?.exercise_count || 0}
        exercisePrimaryType={day?.exercise_primary_type}
        spend={Number(day?.spend_total || 0)}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <QuickAddCalories date={date} />
        <QuickAddExercise date={date} />
        <QuickAddSpend date={date} />
      </div>
    </div>
  );
}
