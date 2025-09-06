"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { spendSchema } from "@/lib/validators";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

type Inputs = z.infer<typeof spendSchema>;

export default function QuickAddSpend({ date }: { date: string }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>({
    resolver: zodResolver(spendSchema),
    defaultValues: { category: "General", note: "", date }
  });

  async function onSubmit(values: Inputs) {
    const { error } = await supabase.rpc("fn_add_spend", { p_date: values.date, p_amount: values.amount, p_category: values.category ?? "General", p_note: values.note ?? "" });
    if (error) { alert(error.message); return; }
    reset({ amount: undefined, category: "General", note: "", date });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-2">
      <h3 className="font-medium">Add Spend</h3>
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-2">
          <label className="label">Amount</label>
          <input type="number" step="0.01" className="input" {...register("amount")} />
          {errors.amount && <p className="help">{errors.amount.message}</p>}
        </div>
        <div className="col-span-1">
          <label className="label">Category</label>
          <input type="text" className="input" {...register("category")} />
        </div>
        <div className="col-span-2">
          <label className="label">Note</label>
          <input type="text" className="input" {...register("note")} />
        </div>
      </div>
      <button className="btn" disabled={isSubmitting}>Add</button>
    </form>
  );
}
