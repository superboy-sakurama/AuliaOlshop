import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Menerima Payload dari sisi klien (Frontend)
    const { paymentId, txid, orderId } = await request.json();

    if (!paymentId || !txid || !orderId) {
      return NextResponse.json(
        { error: 'paymentId, txid, dan orderId wajib dikirimkan dalam request body' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      console.warn("PI_API_KEY tidak ditemukan di environment variables");
      return NextResponse.json(
        { error: 'Konfigurasi PI_API_KEY belum diatur di server' },
        { status: 500 }
      );
    }

    // 2. Validasi ke Blockchain Pi secara aman
    const piResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid }) // Pi API mengharuskan parameter txid untuk finalisasi
    });

    // 3. Cek Status Panggilan Pi API
    if (!piResponse.ok) {
      const errorData = await piResponse.json().catch(() => ({}));
      console.error('Pi API Complete Error:', errorData);
      throw new Error(`Gagal menyelesaikan pembayaran Pi: ${errorData.message || piResponse.statusText}`);
    }

    const paymentData = await piResponse.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Kredensial Supabase (URL atau Service Role Key) tidak dikonfigurasi.");
    }

    // 4. Inisialisasi Admin Supabase dengan Service Role Key
    // Hal ini sangat penting untuk dapat mengeksekusi RPC yang memiliki bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 5. Tarik Pelatuk RPC "process_marketplace_escrow"
    const { error: rpcError } = await supabase.rpc('process_marketplace_escrow', {
      order_id_param: orderId
    });

    if (rpcError) {
      console.error('Supabase RPC Error (Process Escrow):', rpcError);
      throw new Error(`Gagal memproses escrow: ${rpcError.message}`);
    }

    // Mengupdate txid pesanan sebagai cadangan pelacakan tambahan
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ txid: txid })
      .eq('id', orderId);

    if (updateError) {
      console.warn('Gagal mengupdate txid di tabel transactions, namun dana seharusnya sudah aman tereksekusi RPC.', updateError);
    }

    // 6. Return 200 OK
    return NextResponse.json({ success: true, payment: paymentData });

  } catch (error: any) {
    // Error Handling komprehensif
    console.error('API Complete Exception:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem internal', details: error.message },
      { status: 500 }
    );
  }
}
