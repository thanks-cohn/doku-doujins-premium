create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','platform_operations_manager','senior_content_editor','content_editor','legacy','subscriber')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;
create policy user_roles_own_select on public.user_roles for select to authenticated using (user_id = auth.uid());
grant select on public.user_roles to authenticated;

create or replace function public.assign_default_subscriber_role() returns trigger
language plpgsql security definer set search_path = pg_catalog, public, auth as $$
begin
  insert into public.user_roles (user_id, role) values (new.id, 'subscriber')
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists assign_default_subscriber_role on auth.users;
create trigger assign_default_subscriber_role after insert on auth.users
for each row execute function public.assign_default_subscriber_role();

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  price_id text,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  grace_period_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy subscriptions_own_select on public.subscriptions for select to authenticated using (user_id = auth.uid());
grant select on public.subscriptions to authenticated;
revoke insert, update, delete on public.subscriptions from anon, authenticated;

create table public.stripe_webhook_events (
  event_id text primary key,
  processed_at timestamptz not null default now()
);
alter table public.stripe_webhook_events enable row level security;
revoke all on public.stripe_webhook_events from anon, authenticated;

-- Future staff invitation extension point: validate dynamic, expiring, single-use
-- codes in trusted server code, then assign only the predetermined role. No client
-- may choose a role, and Stripe webhook processing must never modify user_roles.
