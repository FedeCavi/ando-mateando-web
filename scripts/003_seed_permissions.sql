-- Seed default permissions
insert into public.permission (name, description) values
  ('view_dashboard', 'Can view dashboard metrics'),
  ('manage_products', 'Can create, edit, and delete products'),
  ('manage_combos', 'Can create, edit, and delete combos'),
  ('manage_sales', 'Can create and view sales'),
  ('manage_clients', 'Can create, edit, and delete clients'),
  ('view_reports', 'Can view reports and analytics'),
  ('manage_users', 'Can manage user accounts and permissions')
on conflict (name) do nothing;
