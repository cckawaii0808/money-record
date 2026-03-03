-- ============================================================
-- Migration 002：新增 stocks 與 holdings 資料表
-- 適用於已建立 accounts / monthly_records 的既有 Supabase 專案
-- 在 Supabase SQL Editor 貼上並執行即可
-- ============================================================

-- ── 5. stocks（台股 / 美股清單，公開參考資料）────────────────────────────

create table if not exists public.stocks (
  symbol     text primary key,
  code       text not null,
  name       text not null,
  market     text not null,
  exch       text not null default '',
  updated_at timestamptz default now()
);

alter table public.stocks enable row level security;

-- 避免重複建立 policy 時報錯
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'stocks'
      and policyname = 'Stocks are viewable by authenticated users'
  ) then
    create policy "Stocks are viewable by authenticated users"
      on public.stocks for select
      to authenticated
      using (true);
  end if;
end
$$;

create index if not exists idx_stocks_market on public.stocks(market);
create index if not exists idx_stocks_code   on public.stocks(code);

-- ── 6. holdings（使用者投資組合部位）────────────────────────────────────

create table if not exists public.holdings (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  symbol        text not null,
  market        text not null,
  name          text not null default '',
  shares        numeric not null default 0,
  loaned_shares numeric not null default 0,
  cost_basis    numeric not null default 0,
  current_price numeric,
  currency      text not null check (currency in ('TWD', 'USD', 'JPY')),
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.holdings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'holdings'
      and policyname = 'Users can view their own holdings'
  ) then
    create policy "Users can view their own holdings"
      on public.holdings for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'holdings'
      and policyname = 'Users can insert their own holdings'
  ) then
    create policy "Users can insert their own holdings"
      on public.holdings for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'holdings'
      and policyname = 'Users can update their own holdings'
  ) then
    create policy "Users can update their own holdings"
      on public.holdings for update
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'holdings'
      and policyname = 'Users can delete their own holdings'
  ) then
    create policy "Users can delete their own holdings"
      on public.holdings for delete
      using (auth.uid() = user_id);
  end if;
end
$$;

-- updated_at 觸發器（複用已存在的 handle_updated_at function）
create trigger on_holdings_updated
  before update on public.holdings
  for each row execute procedure public.handle_updated_at();

create index if not exists idx_holdings_user_id on public.holdings(user_id);
create index if not exists idx_holdings_symbol  on public.holdings(symbol);
