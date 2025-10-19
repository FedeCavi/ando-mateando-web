-- ===========================
-- SCHEMA: Complete database for sales system
-- ===========================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS sale_pack CASCADE;
DROP TABLE IF EXISTS sale_product CASCADE;
DROP TABLE IF EXISTS sale CASCADE;
DROP TABLE IF EXISTS purchase_item CASCADE;
DROP TABLE IF EXISTS purchase CASCADE;
DROP TABLE IF EXISTS pack_product CASCADE;
DROP TABLE IF EXISTS pack CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS client_tag_relation CASCADE;
DROP TABLE IF EXISTS client_tag CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS company CASCADE;

-- CLIENTE
CREATE TABLE client (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text,
  dni text,
  email text,
  details text,
  created_at timestamp with time zone DEFAULT now()
);

-- ETIQUETA DE CLIENTE
CREATE TABLE client_tag (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- RELACIÓN CLIENTE ↔ ETIQUETA (muchos a muchos)
CREATE TABLE client_tag_relation (
  client_id uuid REFERENCES client(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES client_tag(id) ON DELETE CASCADE,
  PRIMARY KEY (client_id, tag_id)
);

-- PROVEEDOR
CREATE TABLE supplier (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);

-- PRODUCTO
CREATE TABLE product (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text,
  purchase_price numeric(12,2) DEFAULT 0,
  price_minorista numeric(12,2) NOT NULL,
  price_mayorista numeric(12,2) NOT NULL,
  stock int NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- PACK/COMBO
CREATE TABLE pack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text,
  price numeric(12,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RELACIÓN PACK ↔ PRODUCTO (muchos a muchos con cantidades)
CREATE TABLE pack_product (
  pack_id uuid REFERENCES pack(id) ON DELETE CASCADE,
  product_id uuid REFERENCES product(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 1,
  PRIMARY KEY (pack_id, product_id)
);

-- COMPRA
CREATE TABLE purchase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES supplier(id) ON DELETE SET NULL,
  details text,
  purchase_date date NOT NULL,
  deposit numeric(12,2) DEFAULT 0,
  total_price numeric(12,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- DETALLE DE COMPRA
CREATE TABLE purchase_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchase(id) ON DELETE CASCADE,
  product_id uuid REFERENCES product(id),
  unit_cost numeric(12,2) NOT NULL,
  quantity int NOT NULL
);

-- VENTA
CREATE TABLE sale (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES client(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  sale_date timestamp with time zone DEFAULT now(),
  deposit numeric(12,2) DEFAULT 0,
  dispatched boolean DEFAULT false,
  recorded boolean DEFAULT false,
  total_price numeric(12,2),
  created_at timestamp with time zone DEFAULT now()
);

-- DETALLE DE VENTA (productos individuales)
CREATE TABLE sale_product (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sale(id) ON DELETE CASCADE,
  product_id uuid REFERENCES product(id),
  quantity int NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  is_mayorista boolean DEFAULT false,
  discount numeric(12,2) DEFAULT 0
);

-- DETALLE DE VENTA (packs)
CREATE TABLE sale_pack (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sale(id) ON DELETE CASCADE,
  pack_id uuid REFERENCES pack(id),
  quantity int NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  discount numeric(12,2) DEFAULT 0
);

-- COMPANY (datos generales de la empresa)
CREATE TABLE company (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  location text,
  instagram text,
  email text,
  phone text,
  seller_comision_min numeric(5,2),
  seller_comision_may numeric(5,2),
  created_at timestamp with time zone DEFAULT now()
);

-- ===========================
-- INDICES
-- ===========================
CREATE INDEX idx_client_name ON client(full_name);
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_sale_date ON sale(sale_date);
CREATE INDEX idx_purchase_date ON purchase(purchase_date);

-- ===========================
-- RLS POLICIES
-- ===========================

-- Enable RLS on all tables
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tag_relation ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack ENABLE ROW LEVEL SECURITY;
ALTER TABLE pack_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_pack ENABLE ROW LEVEL SECURITY;
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all data
CREATE POLICY "Authenticated users can view clients" ON client FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view products" ON product FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view packs" ON pack FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view sales" ON sale FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view suppliers" ON supplier FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view purchases" ON purchase FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can view company" ON company FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow admins to manage all data
CREATE POLICY "Admins can manage clients" ON client FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage products" ON product FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage packs" ON pack FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage suppliers" ON supplier FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage purchases" ON purchase FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage company" ON company FOR ALL USING (is_admin());

-- Allow sellers to create sales
CREATE POLICY "Sellers can create sales" ON sale FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Sellers can manage their sales" ON sale FOR UPDATE USING (seller_id = auth.uid());
