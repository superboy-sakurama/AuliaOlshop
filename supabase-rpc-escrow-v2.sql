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
-- Tujuan: Mengeksekusi penyelesaian pesanan, pemotongan platform fee (2%),
--         dan merekam audit trail mutasi.
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
    -- - 98% Dana Bersih Penjual
    -- - 2% Platform Fee
    v_seller_net := v_total_payment * 0.98;

    -- 3. Distribusi Saldo (Tabel shops) & Audit Trail (Tabel wallet_history)
    
    -- Pencairan komponen Net 98% milik Toko (COALESCE melindung saldo NULL)
    UPDATE shops 
    SET balance = COALESCE(balance, 0) + v_seller_net 
    WHERE id = v_shop_id;
    
    -- Catat riwayat audit pencairan Toko
    INSERT INTO wallet_history (shop_id, amount, transaction_type, reference_order_id)
    VALUES (v_shop_id, v_seller_net, 'Penjualan', order_id_param);

    -- 4. Perubahan Status Akhir
    UPDATE transactions 
    SET status = 'Selesai', updated_at = NOW() 
    WHERE id = order_id_param;

EXCEPTION
    WHEN OTHERS THEN
        -- Apabila ada kegagalan SQL maka state dikembalikan ke semula (Automatic Rollback)
        RAISE EXCEPTION 'Gagal memproses platform fee escrow: %', SQLERRM;
END;
$$;
