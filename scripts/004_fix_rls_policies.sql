-- Drop the problematic policies that cause infinite recursion
drop policy if exists "Admins can view all profiles" on public.user_profiles;
drop policy if exists "Admins can manage permissions" on public.permission;
drop policy if exists "Admins can manage user permissions" on public.user_permission;

-- Create a security definer function to check admin status (bypasses RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
    and is_admin = true
  );
$$;

-- Recreate admin policies using the security definer function
create policy "Admins can view all profiles"
  on public.user_profiles for select
  using (public.is_admin());

create policy "Admins can manage permissions"
  on public.permission for all
  using (public.is_admin());

create policy "Admins can manage user permissions"
  on public.user_permission for all
  using (public.is_admin());

-- Add policy to allow users to insert their own profile (needed for registration)
create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);
