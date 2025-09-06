import { z } from "zod";

export const caloriesSchema = z.object({
  calories: z.coerce.number().int().min(0).max(5000),
  note: z.string().max(140).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const exerciseSchema = z.object({
  count: z.coerce.number().int().min(1).max(10),
  type: z.enum(["strength", "cardio", "yoga"]),
  minutes: z.coerce.number().int().min(0).max(600).optional().default(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const spendSchema = z.object({
  amount: z.coerce.number().min(0).max(1000000),
  category: z.string().max(32).optional().default("General"),
  note: z.string().max(140).optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
