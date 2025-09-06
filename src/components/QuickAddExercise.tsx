"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema } from "@/lib/validators";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

type Inputs = z.infer<typeof exerciseSchema>;

export default function QuickAddExercise({ date }: { date: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { type: "strength", count: 1, minutes: 0, date }
  });

  async function onSubmit(values: Inputs) {
    const { error } = await supabase.rpc("fn_add_exercise", { p_date: values.date, p_count: values.count, p_type: values.type, p_minutes: values.minutes ?? 0 });
    if (error) { alert(error.message); return; }
    reset({ type: values.type, count: 1, minutes: 0, date });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-2">
      <h3 className="font-medium">Add Exercise</h3>
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="label">Count</label>
          <input type="number" className="input" {...register("count")} />
          {errors.count && <p className="help">{errors.count.message}</p>}
        </div>
        <div>
          <label className="label">Type</label>
          <select className="select" {...register("type")}>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="yoga">Yoga</option>
          </select>
          {errors.type && <p className="help">{errors.type.message}</p>}
        </div>
        <div>
          <label className="label">Minutes</label>
          <input type="number" className="input" {...register("minutes")} />
        </div>
        <div className="flex items-end">
          <button className="btn w-full" disabled={isSubmitting}>Add</button>
        </div>
      </div>
    </form>
  );
}
