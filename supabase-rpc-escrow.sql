-- ==============================================================================
-- FUNGSI RPC: process_marketplace_escrow
-- Tujuan: Menangani penyelesaian transaksi, pembagian komisi MLM 3 Level, 
--         serta pencairan dana langsung ke Dompet Toko dalam 1 Blok ACID (Aman).
-- ==============================================================================

CREATE OR REPLACE FUNCTION process_marketplace_escrow(order_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Menjalankan fungsi dengan hak setara admin (Bypass RLS)
AS $$
DECLARE
    v_transaction RECORD;
    v_buyer_id UUID;
    v_shop_id UUID;
    v_total_payment NUMERIC(18, 6);
    
    v_upline1_id UUID;
    v_upline2_id UUID;
    v_upline3_id UUID;
    
    -- Konfigurasi persentase komisi MLM
    -- Pembagian Total: Level 1 (5%), Level 2 (3%), Level 3 (2%)
    v_comm_lvl1 NUMERIC(18, 6);
    v_comm_lvl2 NUMERIC(18, 6);
    v_comm_lvl3 NUMERIC(18, 6);
    
    v_seller_net NUMERIC(18, 6);
BEGIN
    -- 1. Mengunci data transaksi (Row-level Locking) agar tidak ada eksekusi ganda (Race Condition)
    SELECT * INTO v_transaction 
    FROM transactions 
    WHERE id = order_id_param 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaksi dengan ID % tidak ditemukan.', order_id_param;
    END IF;

    IF v_transaction.status = 'Selesai' THEN
        RAISE EXCEPTION 'Transaksi sudah pernah diproses!';
    END IF;

    -- Menyimpan detail transaksi ke dalam variabel lokal
    v_buyer_id := v_transaction.user_id; -- Asumsi kolom yang merujuk pada pembeli adalah user_id
    v_shop_id := v_transaction.shop_id;
    v_total_payment := v_transaction.amount;

    -- Menghitung potensi komisi
    v_comm_lvl1 := v_total_payment * 0.05;
    v_comm_lvl2 := v_total_payment * 0.03;
    v_comm_lvl3 := v_total_payment * 0.02;

    -- 2. Mencari data upline hirarkis dari tabel mlm_network
    -- Upline Level 1
    SELECT upline_id INTO v_upline1_id 
    FROM mlm_network 
    WHERE downline_id = v_buyer_id 
    LIMIT 1;

    -- Upline Level 2
    IF v_upline1_id IS NOT NULL THEN
        SELECT upline_id INTO v_upline2_id 
        FROM mlm_network 
        WHERE downline_id = v_upline1_id 
        LIMIT 1;
    END IF;

    -- Upline Level 3
    IF v_upline2_id IS NOT NULL THEN
        SELECT upline_id INTO v_upline3_id 
        FROM mlm_network 
        WHERE downline_id = v_upline2_id 
        LIMIT 1;
    END IF;

    -- Menghapus alokasi komisi jika upline tidak ditemukan
    IF v_upline1_id IS NULL THEN v_comm_lvl1 := 0; END IF;
    IF v_upline2_id IS NULL THEN v_comm_lvl2 := 0; END IF;
    IF v_upline3_id IS NULL THEN v_comm_lvl3 := 0; END IF;

    -- Menghitung total bersih untuk penjual
    v_seller_net := v_total_payment - (v_comm_lvl1 + v_comm_lvl2 + v_comm_lvl3);

    -- 3. Mendistribusikan saldo perlahan
    
    -- Distribusi Upline Level 1
    IF v_comm_lvl1 > 0 THEN
        UPDATE users SET pi_balance = pi_balance + v_comm_lvl1 WHERE id = v_upline1_id;
    END IF;
    
    -- Distribusi Upline Level 2
    IF v_comm_lvl2 > 0 THEN
        UPDATE users SET pi_balance = pi_balance + v_comm_lvl2 WHERE id = v_upline2_id;
    END IF;

    -- Distribusi Upline Level 3
    IF v_comm_lvl3 > 0 THEN
        UPDATE users SET pi_balance = pi_balance + v_comm_lvl3 WHERE id = v_upline3_id;
    END IF;

    -- 4. Pencairan saldo bersih (Net) ke dompet Toko Penjual
    UPDATE shops 
    SET balance = balance + v_seller_net 
    WHERE id = v_shop_id;  -- Asumsi ada kolom 'balance' di tabel shops

    -- 5. Finalisasi: Mengubah Status Pesanan menjadi Selesai
    UPDATE transactions 
    SET status = 'Selesai', updated_at = NOW() 
    WHERE id = order_id_param;

    -- Proses berhasil, seluruh operasi DB di-commit otomatis jika tidak ada error (ACID).

EXCEPTION
    WHEN OTHERS THEN
        -- EXCEPTION menangkap error apapun dan MEMBATALKAN (ROLLBACK) SEMUA transaksi SQL di atas.
        -- Tidak akan ada saldo yang bertambah maupun berkurang.
        RAISE EXCEPTION 'Gagal memproses escrow dan bonus MLM: %', SQLERRM;
END;
$$;
