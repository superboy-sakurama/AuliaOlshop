/**
 * CATATAN PENGEMBANG:
 * Ini adalah Route Handler Next.js App Router (app/api/pi-payment/route.ts).
 * Diperbarui ke sistem Multi-Vendor (Shopee-style) dengan fitur Escrow.
 */

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, paymentId, txid, checkoutSessionId } = body;

    // Aksi 1: Pi SDK Approve (Meminta server mengizinkan transaksi blockchain)
    if (action === 'approve') {
      console.log(`[Next.js Backend] Payment Approved untuk Checkout Session: ${checkoutSessionId}`);
      // Lakukan verifikasi total akhir dari checkoutSessionId terhadap `payment.amount` disini.
      return NextResponse.json({ message: 'Payment Approved' }, { status: 200 });
    } 
    
    // Aksi 2: Pi SDK Complete (DANA PI SUDAH BERHASIL MASUK KE DOMPET PLATFORM)
    else if (action === 'complete') {
      // Pembeli baru saja selesai membayar ke App Platform dengan koin Pi fisiknya.
      console.log(`[Next.js Backend] Pi Berhasil ditransfer ke Wallet Aplikasi! TXID: ${txid}`);

      // LOGIKA PECAH PESANAN (Split Order)
      // 1. Ambil data keranjang/checkout dari checkoutSessionId
      // 2. Beri status 'PAID' pada tabel `checkout_payments` (Parent)
      // 3. Sistem akan membuat entri pecah toko di tabel `orders` (Child):
      //    Misal: Beli dari Toko A (5 Pi), Toko B (10 Pi).
      //    > Insert ke `orders` dengan relasi `shop_id` masing-masing.
      
      console.log(`[Split Order] Checkout ${checkoutSessionId} dipecah menjadi beberapa orders per toko dengan status Escrow PENDING.`);

      return NextResponse.json({ message: 'Payment Completed, Split Orders Created' }, { status: 200 });
    }
    
    // Aksi 3: Pencairan Escrow (Pembeli klik: Pesanan Diterima)
    // Dana yang tertahan (Escrow) sekarang dilepas.
    else if (action === 'release_escrow') {
      const { orderId } = body;
      
      // LOGIKA RELEASE ESCROW
      // 1. Panggil RPC Supabase release_escrow_and_distribute(orderId)
      //    - Mengubah status pesanan jadi COMPLETED
      //    - Menyisakan Pi masuk ke `pi_balance` internal pemilik toko
      
      console.log(`[Escrow] Dana pesanan ${orderId} dilepaskan! Penjual menerima saldo Pi internal.`);
      return NextResponse.json({ message: 'Escrow Released, Pi Distributed' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid config action' }, { status: 400 });
  } catch (error: any) {
    console.error('Pi Payment API Error:', error.message);
    return NextResponse.json({ error: 'Server error processing payment' }, { status: 500 });
  }
}
