-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS on user_profiles
alter table public.user_profiles enable row level security;

-- RLS policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create permission table
create table if not exists public.permission (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS on permission
alter table public.permission enable row level security;

-- All authenticated users can view permissions
create policy "Authenticated users can view permissions"
  on public.permission for select
  using (auth.role() = 'authenticated');

-- Only admins can manage permissions
create policy "Admins can manage permissions"
  on public.permission for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Create user_permission junction table
create table if not exists public.user_permission (
  user_id uuid references public.user_profiles(id) on delete cascade,
  permission_id uuid references public.permission(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, permission_id)
);

-- Enable RLS on user_permission
alter table public.user_permission enable row level security;

-- Users can view their own permissions
create policy "Users can view their own permissions"
  on public.user_permission for select
  using (auth.uid() = user_id);

-- Admins can manage all user permissions
create policy "Admins can manage user permissions"
  on public.user_permission for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and is_admin = true
    )
  );
