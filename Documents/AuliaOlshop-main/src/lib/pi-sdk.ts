/**
 * Pi Network SDK Integration (Client-Side)
 * 
 * Penggunaan di Next.js:
 * Anda bisa memanggil `loadPiSdk()` di dalam `useEffect` di komponen Checkout/Cart,
 * atau meletakkan script tag `<script src="https://sdk.pi.network/pi.js"></script>` 
 * di layout.tsx.
 */

declare global {
  interface Window {
    Pi: any;
  }
}

// 1. Memuat Script Pi SDK secara dinamis
export const loadPiSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Pi) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.pi.network/pi.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat Pi SDK'));
    document.body.appendChild(script);
  });
};

// 2. Autentikasi User Pi
export const authenticatePiUser = async () => {
  try {
    if (!window.Pi) throw new Error('Pi SDK belum dimuat');
    
    // Inisialisasi Pi SDK (ganti dengan versi yang relevan dan sesuaikan environment sandbox/production)
    window.Pi.init({ version: "2.0", sandbox: true }); 

    const scopes = ['username', 'payments']; // Izin yang diminta dari user
    
    // Proses Autentikasi
    const authResult = await window.Pi.authenticate(scopes, (onIncompletePaymentFound: any) => {
       // Callback jika ada pembayaran yang belum selesai (pending/unresolved transaction)
       console.log("Temuan pembayaran yang belum selesai:", onIncompletePaymentFound);
    });

    return authResult; // Payload: { user: { username: 'Nama' }, accessToken: '...' }
  } catch (error) {
    console.error('Error authenticating with Pi:', error);
    throw error;
  }
};

// 3. Membuat Pembayaran
export const createPiPayment = async (amount: number, memo: string, orderId: string) => {
  try {
    if (!window.Pi) throw new Error('Pi SDK belum dimuat');

    const paymentData = {
      amount: amount,
      memo: memo, // Deskripsi transaksi untuk user (misal: "Pembayaran Aulia Olshop INV-001")
      metadata: { orderId: orderId }, // Data internal yang akan dikirim bolak-balik ke backend
    };

    const paymentCallbacks = {
      // Dipanggil ketika user telah mengotorisasi pembayaran di Pi Browser
      onReadyForServerApproval: (paymentId: string) => {
        console.log('Payment Ready for Approval:', paymentId);
        // Memanggil Next.js Route Handler untuk menyetujui transaksi (Server to Server)
        fetch('/api/pi-payment', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ action: 'approve', paymentId, orderId })
        });
      },
      
      // Dipanggil ketika blockchain sudah mencatatkan transaksi
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log('Payment Ready for Completion:', paymentId, 'TXID:', txid);
        // Memanggil Next.js Route Handler untuk menyelesaikan pesanan
        fetch('/api/pi-payment', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ action: 'complete', paymentId, txid, orderId })
        });
      },
      
      onCancel: (paymentId: string) => {
        console.log('Pembayaran dibatalkan oleh pengguna:', paymentId);
      },
      
      onError: (error: Error, payment: any) => {
        console.error('Terjadi kesalahan pembayaran:', error, payment);
      },
    };

    // Trigger form pembayaran Pi Network SDK
    const payment = await window.Pi.createPayment(paymentData, paymentCallbacks);
    return payment;
  } catch (error) {
    console.error('Error creating Pi payment:', error);
    throw error;
  }
};
