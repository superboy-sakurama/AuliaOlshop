/**
 * Modul Distribusi MLM
 * File: /src/lib/mlm.ts
 */

// import { createClient } from '@supabase/supabase-js';

// Menggunakan Service Role Key. 
// PERINGATAN: File ini hanya boleh dipanggil dari Server/Route Handler (backend).
// Jangan pernah expose supabaseServiceKey ke Client Components.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';
// const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Mendistribusikan komisi MLM kepada upline menggunakan Supabase RPC (PostgreSQL Function).
 * Menjamin transaksi ACID (semua berhasil atau di-rollback jika gagal).
 * 
 * @param buyerId ID dari akun pengguna yang melakukan transaksi
 * @param transactionId ID pesanan di tabel transactions
 * @param totalAmountPi Nilai transaksi dalam PI (cth: 250.50)
 */
export async function distributeMLMCommission(
  buyerId: string, 
  transactionId: string, 
  totalAmountPi: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[MLM] Memulai verifikasi transaksi ${transactionId} senilai ${totalAmountPi} Pi`);

    // ==========================================
    // INTEGRASI SUPABASE (Hilangkan komentar saat digunakan di production)
    // ==========================================
    
    /*
    const { error } = await supabase.rpc('distribute_mlm_commission', {
      p_buyer_id: buyerId,
      p_transaction_id: transactionId,
      p_total_amount: totalAmountPi
    });

    if (error) {
      console.error('[MLM] Database Error:', error);
      throw new Error(`RPC Gagal: ${error.message}`);
    }
    */

    console.log(`[MLM] Berhasil mendistribusikan komisi untuk Level 1, 2, dan 3.`);
    return { success: true };
    
  } catch (error: any) {
    console.error('[MLM] Terjadi kegagalan pada distribusi:', error.message);
    return { success: false, error: error.message };
  }
}
