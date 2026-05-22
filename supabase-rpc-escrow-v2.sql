-- ==============================================================================
-- SKEMA: wallet_history
-- Tujuan: Mencatat riwayat mutasi saldo (audit trail) untuk pengguna dan toko.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS wallet_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Bisa NULL jika mutasi milik toko (bukan user reguler)
    shop_id UUID, -- Bisa NULL jika mutasi milik user
    amount NUMERIC(18, 6) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- Contoh: 'Penjualan', 'Komisi MLM Lvl 1'
    reference_order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- FUNGSI RPC: process_marketplace_escrow
-- Tujuan: Mengeksekusi penyelesaian pesanan, pemotongan platform fee,
--         pembagian komisi MLM secara dinamis, dan merekam audit trail mutasi.
--         Dilindungi dengan Row-Level Locking (ACID) dan COALESCE untuk keamanan.
-- ==============================================================================
CREATE OR REPLACE FUNCTION process_marketplace_escrow(order_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Eksekusi dengan hak admin agar mem-bypass batasan RLS default
AS $$
DECLARE
    v_transaction RECORD;
    v_buyer_id UUID;
    v_shop_id UUID;
    v_total_payment NUMERIC(18, 6);
    
    v_upline1_id UUID;
    v_upline2_id UUID;
    v_upline3_id UUID;
    
    v_comm_lvl1 NUMERIC(18, 6);
    v_comm_lvl2 NUMERIC(18, 6);
    v_comm_lvl3 NUMERIC(18, 6);
    v_seller_net NUMERIC(18, 6);
BEGIN
    -- 1. Mengunci baris (Row-Level Locking) pada tabel transactions
    -- Mencegah terjadinya Race Condition akibat request bersamaan
    SELECT * INTO v_transaction 
    FROM transactions 
    WHERE id = order_id_param 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaksi dengan ID % tidak ditemukan.', order_id_param;
    END IF;

    IF v_transaction.status = 'Selesai' THEN
        RAISE EXCEPTION 'Transaksi sudah pernah diproses pada order_id: %', order_id_param;
    END IF;

    -- Mengambil parameter transaksi dasar
    v_buyer_id := v_transaction.user_id; 
    v_shop_id := v_transaction.shop_id;
    v_total_payment := v_transaction.amount;

    -- 2. Menghitung distribusi dana
    -- - 90% Dana Bersih Penjual
    -- - 10% Platform Fee Maksimum
    --   - L1 = 5%, L2 = 3%, L3 = 2% (Sisa fee platform yang tidak terdistribusi otomatis hangus/milik platform)
    v_seller_net := v_total_payment * 0.90;
    v_comm_lvl1 := v_total_payment * 0.05;
    v_comm_lvl2 := v_total_payment * 0.03;
    v_comm_lvl3 := v_total_payment * 0.02;

    -- 3. Mencari Upline Hirarkis (Tabel mlm_network)
    SELECT upline_id INTO v_upline1_id 
    FROM mlm_network 
    WHERE downline_id = v_buyer_id 
    LIMIT 1;

    IF v_upline1_id IS NOT NULL THEN
        SELECT upline_id INTO v_upline2_id 
        FROM mlm_network 
        WHERE downline_id = v_upline1_id 
        LIMIT 1;
    END IF;

    IF v_upline2_id IS NOT NULL THEN
        SELECT upline_id INTO v_upline3_id 
        FROM mlm_network 
        WHERE downline_id = v_upline2_id 
        LIMIT 1;
    END IF;

    -- 4. Distribusi Saldo (Tabel users & shops) & Audit Trail (Tabel wallet_history)
    
    -- Pencairan komponen Net 90% milik Toko (COALESCE melindung saldo NULL)
    UPDATE shops 
    SET balance = COALESCE(balance, 0) + v_seller_net 
    WHERE id = v_shop_id;
    
    -- Catat riwayat audit pencairan Toko
    INSERT INTO wallet_history (shop_id, amount, transaction_type, reference_order_id)
    VALUES (v_shop_id, v_seller_net, 'Penjualan', order_id_param);

    -- Eksekusi Komisi Lvl 1 (bila ada)
    IF v_upline1_id IS NOT NULL THEN
        UPDATE users SET pi_balance = COALESCE(pi_balance, 0) + v_comm_lvl1 WHERE id = v_upline1_id;
        
        INSERT INTO wallet_history (user_id, amount, transaction_type, reference_order_id)
        VALUES (v_upline1_id, v_comm_lvl1, 'Komisi MLM Lvl 1', order_id_param);
    END IF;
    
    -- Eksekusi Komisi Lvl 2 (bila ada)
    IF v_upline2_id IS NOT NULL THEN
        UPDATE users SET pi_balance = COALESCE(pi_balance, 0) + v_comm_lvl2 WHERE id = v_upline2_id;
        
        INSERT INTO wallet_history (user_id, amount, transaction_type, reference_order_id)
        VALUES (v_upline2_id, v_comm_lvl2, 'Komisi MLM Lvl 2', order_id_param);
    END IF;

    -- Eksekusi Komisi Lvl 3 (bila ada)
    IF v_upline3_id IS NOT NULL THEN
        UPDATE users SET pi_balance = COALESCE(pi_balance, 0) + v_comm_lvl3 WHERE id = v_upline3_id;
        
        INSERT INTO wallet_history (user_id, amount, transaction_type, reference_order_id)
        VALUES (v_upline3_id, v_comm_lvl3, 'Komisi MLM Lvl 3', order_id_param);
    END IF;

    -- 5. Perubahan Status Akhir
    UPDATE transactions 
    SET status = 'Selesai', updated_at = NOW() 
    WHERE id = order_id_param;

EXCEPTION
    WHEN OTHERS THEN
        -- Apabila ada kegagalan SQL maka state dikembalikan ke semula (Automatic Rollback)
        RAISE EXCEPTION 'Gagal memproses platform fee escrow & MLM: %', SQLERRM;
END;
$$;
