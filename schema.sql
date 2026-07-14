create extension if not exists pgcrypto;

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default '未分類',
  description text not null default '',
  tags text[] not null default '{}',
  prompt text not null,
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prompts enable row level security;

create policy "Users can read own prompts" on public.prompts
for select using (auth.uid() = user_id);

create policy "Users can insert own prompts" on public.prompts
for insert with check (auth.uid() = user_id);

create policy "Users can update own prompts" on public.prompts
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own prompts" on public.prompts
for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists prompts_set_updated_at on public.prompts;
create trigger prompts_set_updated_at
before update on public.prompts
for each row execute function public.set_updated_at();
