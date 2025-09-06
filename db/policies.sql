-- Enable RLS (run after tables are created)
alter table days enable row level security;
alter table meal_entries enable row level security;
alter table exercise_entries enable row level security;
alter table spend_entries enable row level security;
alter table monthly_budgets enable row level security;
alter table profiles enable row level security;

-- Simple policies: user can CRUD their own rows
create policy "select own days" on days for select using (user_id = auth.uid());
create policy "insert own days" on days for insert with check (user_id = auth.uid());
create policy "update own days" on days for update using (user_id = auth.uid());
create policy "delete own days" on days for delete using (user_id = auth.uid());

create policy "select own meal" on meal_entries for select using (user_id = auth.uid());
create policy "insert own meal" on meal_entries for insert with check (user_id = auth.uid());
create policy "update own meal" on meal_entries for update using (user_id = auth.uid());
create policy "delete own meal" on meal_entries for delete using (user_id = auth.uid());

create policy "select own exercise" on exercise_entries for select using (user_id = auth.uid());
create policy "insert own exercise" on exercise_entries for insert with check (user_id = auth.uid());
create policy "update own exercise" on exercise_entries for update using (user_id = auth.uid());
create policy "delete own exercise" on exercise_entries for delete using (user_id = auth.uid());

create policy "select own spend" on spend_entries for select using (user_id = auth.uid());
create policy "insert own spend" on spend_entries for insert with check (user_id = auth.uid());
create policy "update own spend" on spend_entries for update using (user_id = auth.uid());
create policy "delete own spend" on spend_entries for delete using (user_id = auth.uid());

create policy "select own budget" on monthly_budgets for select using (user_id = auth.uid());
create policy "insert own budget" on monthly_budgets for insert with check (user_id = auth.uid());
create policy "update own budget" on monthly_budgets for update using (user_id = auth.uid());
create policy "delete own budget" on monthly_budgets for delete using (user_id = auth.uid());
