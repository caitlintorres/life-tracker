-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- Users profile (optional; link to auth.users)
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null,
  created_at timestamptz default now()
);

-- Core daily rollups
create table if not exists days (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  date date not null,
  calories_total int not null default 0,
  exercise_count int not null default 0,
  exercise_primary_type text check (exercise_primary_type in ('strength','cardio','yoga')),
  spend_total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

-- Optional detailed logs
create table if not exists meal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  day_date date not null,
  name text,
  calories int not null check (calories >= 0),
  note text,
  created_at timestamptz default now()
);

create table if not exists exercise_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  day_date date not null,
  type text not null check (type in ('strength','cardio','yoga')),
  count int not null check (count >= 1),
  minutes int not null default 0,
  created_at timestamptz default now()
);

create table if not exists spend_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  day_date date not null,
  amount numeric(12,2) not null check (amount >= 0),
  category text,
  note text,
  created_at timestamptz default now()
);

create table if not exists monthly_budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  month date not null, -- first of month
  budget numeric(12,2) not null check (budget >= 0),
  unique (user_id, month)
);

-- Helper: current authenticated user id
create or replace function auth_user_id() returns uuid
language sql stable as $$
  select auth.uid();
$$;

-- Upsert a day row for the current user
create or replace function fn_upsert_day(p_date date)
returns void language plpgsql as $$
begin
  insert into days (user_id, date)
  values (auth_user_id(), p_date)
  on conflict (user_id, date) do nothing;
end;
$$;

-- Add calories detail and bump totals atomically
create or replace function fn_add_calories(p_date date, p_calories int, p_note text default '')
returns void language plpgsql as $$
begin
  perform fn_upsert_day(p_date);
  insert into meal_entries (user_id, day_date, calories, note)
  values (auth_user_id(), p_date, p_calories, coalesce(p_note,''));
  update days
    set calories_total = calories_total + p_calories
  where user_id = auth_user_id() and date = p_date;
end;
$$;

-- Add exercise and bump totals + primary type (most recent wins)
create or replace function fn_add_exercise(p_date date, p_count int, p_type text, p_minutes int default 0)
returns void language plpgsql as $$
begin
  perform fn_upsert_day(p_date);
  insert into exercise_entries (user_id, day_date, type, count, minutes)
  values (auth_user_id(), p_date, p_type, p_count, p_minutes);
  update days
     set exercise_count = exercise_count + p_count,
         exercise_primary_type = p_type
   where user_id = auth_user_id() and date = p_date;
end;
$$;

-- Add spend and bump totals
create or replace function fn_add_spend(p_date date, p_amount numeric, p_category text default 'General', p_note text default '')
returns void language plpgsql as $$
begin
  perform fn_upsert_day(p_date);
  insert into spend_entries (user_id, day_date, amount, category, note)
  values (auth_user_id(), p_date, p_amount, p_category, p_note);
  update days
     set spend_total = spend_total + p_amount
   where user_id = auth_user_id() and date = p_date;
end;
$$;

-- Indexes
create index if not exists idx_days_user_date on days(user_id, date);
create index if not exists idx_entries_meal on meal_entries(user_id, day_date);
create index if not exists idx_entries_exercise on exercise_entries(user_id, day_date);
create index if not exists idx_entries_spend on spend_entries(user_id, day_date);
create index if not exists idx_monthly_budgets_user_month on monthly_budgets(user_id, month);
