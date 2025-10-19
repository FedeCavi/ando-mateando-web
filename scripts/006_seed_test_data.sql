-- ===========================
-- SEED DATA: Test data for all tables
-- ===========================

-- Insert company data
INSERT INTO company (name, location, instagram, email, phone, seller_comision_min, seller_comision_may)
VALUES ('Ventas App Store', 'Buenos Aires, Argentina', '@ventasapp', 'contacto@ventasapp.com', '+54 11 1234-5678', 5.00, 7.50);

-- Insert clients
INSERT INTO client (full_name, phone, dni, email, details) VALUES
('Juan Pérez', '+54 11 2345-6789', '12345678', 'juan.perez@email.com', 'Cliente frecuente'),
('María González', '+54 11 3456-7890', '23456789', 'maria.gonzalez@email.com', 'Compra al por mayor'),
('Carlos Rodríguez', '+54 11 4567-8901', '34567890', 'carlos.rodriguez@email.com', 'Cliente nuevo'),
('Ana Martínez', '+54 11 5678-9012', '45678901', 'ana.martinez@email.com', 'Prefiere productos premium'),
('Luis Fernández', '+54 11 6789-0123', '56789012', 'luis.fernandez@email.com', 'Cliente corporativo');

-- Insert client tags
INSERT INTO client_tag (name) VALUES
('VIP'),
('Mayorista'),
('Minorista'),
('Corporativo'),
('Nuevo');

-- Insert suppliers
INSERT INTO supplier (name, details, email, phone) VALUES
('TechSupply SA', 'Proveedor de electrónica', 'ventas@techsupply.com', '+54 11 1111-2222'),
('ElectroMax', 'Importador de tecnología', 'info@electromax.com', '+54 11 2222-3333'),
('Digital World', 'Distribuidor mayorista', 'contacto@digitalworld.com', '+54 11 3333-4444'),
('Smart Devices', 'Proveedor de dispositivos inteligentes', 'ventas@smartdevices.com', '+54 11 4444-5555'),
('Home Tech', 'Especialista en hogar inteligente', 'info@hometech.com', '+54 11 5555-6666');

-- Insert products
INSERT INTO product (name, details, purchase_price, price_minorista, price_mayorista, stock) VALUES
('Smart TV 55" 4K', 'Disfruta de una experiencia visual inigualable con nuestro Smart TV 4K de 55 pulgadas. Colores vibrantes, detalles nítidos y acceso a tus aplicaciones favoritas en un solo lugar.', 500.00, 850.00, 700.00, 45),
('Auriculares Inalámbricos Pro', 'Sumérgete en un sonido cristalino con los Auriculares Inalámbricos Pro. Con cancelación de ruido activo y una batería de larga duración, son perfectos para música y llamadas.', 45.00, 90.00, 70.00, 150),
('Reloj Inteligente V2', 'Mantente conectado y en forma con el Reloj Inteligente V2. Monitorea tu salud, recibe notificaciones y controla tu música directamente desde tu muñeca.', 80.00, 150.00, 120.00, 80),
('Teclado Mecánico RGB', 'Eleva tu experiencia de juego con el Teclado Mecánico RGB. Switches táctiles y veloces, iluminación personalizable te ofrecen precisión y estilo.', 60.00, 120.00, 95.00, 120),
('Cámara Web Full HD', 'Captura cada momento con una claridad sorprendente gracias a nuestra Cámara Web Full HD. Perfecta para videollamadas, streaming y creación de contenido de alta calidad.', 20.00, 40.00, 30.00, 90);

-- Insert packs/combos
INSERT INTO pack (name, details, price) VALUES
('Combo Oficina Pro', 'Teclado Mecánico + Cámara Web', 140.00),
('Combo Entertainment', 'Smart TV + Auriculares', 900.00),
('Combo Fitness Tech', 'Reloj Inteligente + Auriculares', 220.00),
('Combo Gamer', 'Teclado Mecánico + Auriculares', 180.00),
('Combo Home Office', 'Cámara Web + Auriculares + Teclado', 220.00);

-- Link products to packs
INSERT INTO pack_product (pack_id, product_id, quantity)
SELECT 
  (SELECT id FROM pack WHERE name = 'Combo Oficina Pro'),
  id,
  1
FROM product WHERE name IN ('Teclado Mecánico RGB', 'Cámara Web Full HD');

INSERT INTO pack_product (pack_id, product_id, quantity)
SELECT 
  (SELECT id FROM pack WHERE name = 'Combo Entertainment'),
  id,
  1
FROM product WHERE name IN ('Smart TV 55" 4K', 'Auriculares Inalámbricos Pro');

-- Insert purchases
INSERT INTO purchase (supplier_id, details, purchase_date, deposit, total_price)
SELECT 
  (SELECT id FROM supplier WHERE name = 'TechSupply SA'),
  'Compra de TVs y auriculares',
  '2025-01-15',
  5000.00,
  10000.00;

INSERT INTO purchase (supplier_id, details, purchase_date, deposit, total_price)
SELECT 
  (SELECT id FROM supplier WHERE name = 'ElectroMax'),
  'Reposición de stock general',
  '2025-01-20',
  3000.00,
  8000.00;
