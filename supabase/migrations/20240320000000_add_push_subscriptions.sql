create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_id uuid references auth.users(id) on delete cascade,
  unique(endpoint)
); 