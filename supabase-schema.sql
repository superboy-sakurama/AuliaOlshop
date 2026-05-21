-- =================================================================================
-- SKEMA DATABASE (SUPABASE / POSTGRESQL) UNTUK AULIA OLSHOP (MULTI-VENDOR)
-- =================================================================================

-- 1. TABEL USERS (Profil dan Dompet Pi)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  pi_balance NUMERIC(18, 6) DEFAULT 0.0, -- Saldo internal Pi (untuk pencairan ke dompet asli nanti)
  referral_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL SHOPS (Entri Toko untuk Marketplace)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL PRODUCTS (Katalog Multi-Vendor)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_pi NUMERIC(18, 6) NOT NULL,
  image_url TEXT,
  rating NUMERIC(2, 1) DEFAULT 0,
  sold INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL MLM_NETWORK (Hierarki Jaringan)
CREATE TABLE mlm_network (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  upline_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL CHECKOUT_PAYMENTS (Induk Pembayaran Keranjang - Blockchain Pi Network)
-- Menampung 1 transaksi fisik Pi yang dikirim pengguna ke dompet Platform (App Wallet)
CREATE TABLE checkout_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id),
  total_amount NUMERIC(18, 6) NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID
  tx_id TEXT, -- Transaction ID Blockchain Pi (txid)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL ORDERS (Pesanan Di-Split Per Toko)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES checkout_payments(id),
  buyer_id UUID REFERENCES users(id),
  shop_id UUID REFERENCES shops(id),
  total_pi NUMERIC(18, 6) NOT NULL,
  status TEXT DEFAULT 'PAID', -- PAID, SHIPPED, COMPLETED (Escrow dilepas)
  escrow_released_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABEL ORDER_ITEMS (Rincian Produk dalam Pesanan)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price_pi NUMERIC(18, 6) NOT NULL
);

-- 8. TABEL COMMISSIONS (Riwayat Komisi MLM)
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES users(id),
  buyer_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC(18, 6) NOT NULL,
  level_from_buyer INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- =================================================================================

-- Aktifkan RLS di tabel
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 1. Policy untuk Shops: Pemilik hanya bisa mengubah tokonya sendiri
CREATE POLICY "Users can manage their own shop"
  ON shops FOR ALL
  USING (auth.uid() = owner_id);

-- Semua orang bisa melihat data toko
CREATE POLICY "Anyone can view shops"
  ON shops FOR SELECT
  USING (true);

-- 2. Policy untuk Products: Penjual hanya bisa mengelola produk tokonya sendiri
CREATE POLICY "Sellers can manage products in their shop"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM shops 
      WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
    )
  );

-- Semua orang bisa melihat katalog produk
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- 9. TABEL REVIEWS (Ulasan Produk)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, order_id, product_id) -- Supaya 1 order hanya bisa review 1 kali per produk
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa melihat ulasan
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- Hanya pembeli yang telah menyelesaikan pesanan (berstatus COMPLETED) yang dapat memberikan ulasan,
-- dan produk tersebut harus ada di dalam order_items pesanan tersebut.
CREATE POLICY "Only verified buyers can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = reviews.order_id 
        AND o.buyer_id = auth.uid() 
        AND o.status = 'COMPLETED'
        AND oi.product_id = reviews.product_id
    )
  );

-- Pembeli hanya bisa mengubah ulasannya sendiri
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- =================================================================================
-- SUPABASE RPC: LOGIKA ESCROW & RELIABILITAS PEMBAGIAN MLM PI NETWORK
-- =================================================================================

-- Fungsi ini dijalankan KETIKA PESANAN SELESAI (Pembeli klik "Pesanan Diterima")
CREATE OR REPLACE FUNCTION release_escrow_and_distribute(
  p_order_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_shop_owner_id UUID;
  v_current_upline UUID;
  v_level INT := 1;
  v_mlm_commission NUMERIC;
  v_platform_fee NUMERIC;
  v_seller_revenue NUMERIC;
  v_total_mlm_distributed NUMERIC := 0.0;
  v_percentage NUMERIC;
BEGIN
  -- 1. Ambil data Order
  SELECT * INTO v_order FROM orders WHERE id = p_order_id;
  IF v_order.status = 'COMPLETED' THEN
    RAISE EXCEPTION 'Order escrow already released';
  END IF;

  -- 2. Dapatkan ID Pemilik Toko (Penjual)
  SELECT owner_id INTO v_shop_owner_id FROM shops WHERE id = v_order.shop_id;

  -- 3. Hitung Potongan Platform & Potongan MLM dari total pesanan ini
  -- Misal Platform Fee = 2%
  v_platform_fee := v_order.total_pi * 0.02;
  -- Alokasi Pool MLM Total (5% + 3% + 1% = 9%)
  -- Kita distribusikan secara bertahap
  
  -- === DISTRIBUSI MLM ===
  SELECT upline_id INTO v_current_upline FROM mlm_network WHERE user_id = v_order.buyer_id;

  WHILE v_current_upline IS NOT NULL AND v_level <= 3 LOOP
    IF v_level = 1 THEN v_percentage := 0.05;
    ELSIF v_level = 2 THEN v_percentage := 0.03;
    ELSIF v_level = 3 THEN v_percentage := 0.01;
    END IF;

    v_mlm_commission := v_order.total_pi * v_percentage;
    v_total_mlm_distributed := v_total_mlm_distributed + v_mlm_commission;

    -- Tambah Pi ke Upline
    UPDATE users SET pi_balance = pi_balance + v_mlm_commission WHERE id = v_current_upline;
    -- Catat riwayat
    INSERT INTO commissions (recipient_id, buyer_id, order_id, amount, level_from_buyer)
    VALUES (v_current_upline, v_order.buyer_id, p_order_id, v_mlm_commission, v_level);

    -- Lanjut ke Upline berikutnya
    SELECT upline_id INTO v_current_upline FROM mlm_network WHERE user_id = v_current_upline;
    v_level := v_level + 1;
  END LOOP;

  -- 4. CAIRKAN SISA PI KE DOMPET PENJUAL (SELLER REVENUE)
  v_seller_revenue := v_order.total_pi - v_platform_fee - v_total_mlm_distributed;
  UPDATE users SET pi_balance = pi_balance + v_seller_revenue WHERE id = v_shop_owner_id;

  -- 5. TANDAI ORDER SEBAGAI COMPLETED
  UPDATE orders SET status = 'COMPLETED', escrow_released_at = NOW() WHERE id = p_order_id;
END;
$$;
