"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caloriesSchema } from "@/lib/validators";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

type Inputs = z.infer<typeof caloriesSchema>;

export default function QuickAddCalories({ date }: { date: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>({
    resolver: zodResolver(caloriesSchema),
    defaultValues: { date }
  });

  async function onSubmit(values: Inputs) {
    // Calls Postgres function to add calories and update totals atomically
    const { error } = await supabase.rpc("fn_add_calories", { p_date: values.date, p_calories: values.calories, p_note: values.note ?? "" });
    if (error) { alert(error.message); return; }
    reset({ calories: undefined, note: "", date });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-2">
      <h3 className="font-medium">Add Calories</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="label">Calories</label>
          <input type="number" className="input" placeholder="e.g. 420" {...register("calories")} />
          {errors.calories && <p className="help">{errors.calories.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="label">Note (optional)</label>
          <input type="text" className="input" placeholder="Meal or snack" {...register("note")} />
        </div>
      </div>
      <button className="btn" disabled={isSubmitting}>Add</button>
    </form>
  );
}
