import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { paymentId, txid } = await request.json();

    if (!paymentId || !txid) {
      return NextResponse.json({ error: 'paymentId dan txid wajib dikirimkan' }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      console.warn("PI_API_KEY tidak ditemukan di environment variables");
      return NextResponse.json({ error: 'Konfigurasi PI_API_KEY belum diatur di server' }, { status: 500 });
    }

    // Menginformasikan penyelesaian transaksi ke jaringan Pi
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Pi API Complete Error:', errorData);
      return NextResponse.json({ error: 'Gagal menyelesaikan pembayaran di Jaringan Pi' }, { status: response.status });
    }

    const paymentData = await response.json();
    
    // Pi Network mengembalikan struktur data pembayaran yang berisi metadata
    // yang sudah kita sertakan pada Frontend (CheckoutButton.tsx)
    const orderId = paymentData?.metadata?.order_id;
    
    if (orderId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        // Menginisialisasi Supabase Client dengan Service Role Key 
        // yang secara aman berjalan di backend dan memotong batasan RLS
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // a. Mengubah status pesanan di tabel "transactions" menjadi "Selesai"
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'Selesai', 
            txid: txid 
          })
          .eq('order_id', orderId);

        if (updateError) {
          console.error('Supabase Update Error (transactions):', updateError);
        }

        // b. Memanggil RPC Supabase untuk membagikan bonus/komisi MLM (Logic otomatis dari database PostgreSQL)
        const { error: rpcError } = await supabase.rpc('distribute_mlm_commission', {
          p_order_id: orderId
        });

        if (rpcError) {
          console.error('Supabase RPC Error (MLM Commission):', rpcError);
        }
      } else {
        console.warn('Lewati integrasi Database Supabase: SUPABASE_SERVICE_ROLE_KEY atau URL tidak ditemukan.');
      }
    } else {
      console.warn(`Pembayaran dengan paymentId ${paymentId} tidak menyertakan order_id di metadata.`);
    }

    return NextResponse.json({ success: true, payment: paymentData });
  } catch (error: any) {
    console.error('API Complete Exception:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal', details: error.message }, { status: 500 });
  }
}
