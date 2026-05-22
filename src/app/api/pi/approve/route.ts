import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId wajib dikirimkan' }, { status: 400 });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      console.warn("PI_API_KEY tidak ditemukan di environment variables");
      // Membantu proses pengembangan di mode lokal / testnet
      return NextResponse.json({ error: 'Konfigurasi PI_API_KEY belum diatur di server' }, { status: 500 });
    }

    // Melakukan konfirmasi ke Server Pi Blockchain (Approve)
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Pi API Approve Error:', errorData);
      return NextResponse.json({ error: 'Gagal menyetujui (approve) pembayaran di Jaringan Pi' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Approve Exception:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal', details: error.message }, { status: 500 });
  }
}
