"use client";

import React, { useState } from 'react';
import { usePiAuth } from './providers/PiAuthProvider';

interface CheckoutButtonProps {
  amount: number;
  orderId: string;
  itemCount: number;
  onSuccess?: () => void;
}

// Global declaration for Pi SDK as requested
declare global {
  interface Window {
    Pi: any;
  }
}

export default function CheckoutButton({ amount, orderId, itemCount, onSuccess }: CheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  
  const { isAuthenticated, loginPiUser } = usePiAuth();

  const handlePiCheckout = async () => {
    if (amount <= 0) return;

    if (!isAuthenticated) {
      await loginPiUser();
    }

    if (typeof window === 'undefined' || !window.Pi) {
      showToast('error', 'Pi SDK belum termuat atau Anda tidak berada di Pi Browser.');
      return;
    }

    setIsProcessing(true);

    try {
      window.Pi.createPayment({
        amount: amount,
        memo: 'Pembayaran Pesanan Toko Aulia',
        metadata: { order_id: orderId }
      }, {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log('onReadyForServerApproval called with paymentId:', paymentId);
          // Kirim ke API internal untuk verifikasi server
          try {
            const res = await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
            if (!res.ok) {
              console.error('Server gagal menyetujui pembayaran.');
            }
          } catch (err) {
            console.error('API Error:', err);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log('onReadyForServerCompletion called with paymentId:', paymentId, 'txid:', txid);
          // Kirim ke API internal untuk penyelesaian
          try {
            const res = await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            if (!res.ok) {
              console.error('Server gagal memproses penyelesaian pembayaran.');
            } else {
              setIsProcessing(false);
              showToast('success', `Pembayaran Berhasil! Tx ID: ${txid}`);
              if (onSuccess) onSuccess();
            }
          } catch (err) {
            console.error('API Error:', err);
            setIsProcessing(false);
          }
        },
        onCancel: (paymentId: string) => {
          console.log('Pembayaran dibatalkan. paymentId:', paymentId);
          setIsProcessing(false);
          showToast('error', 'Pembayaran Dibatalkan');
        },
        onError: (error: Error, payment?: any) => {
          console.error('Error saat pembayaran', error, payment);
          setIsProcessing(false);
          showToast('error', error.message || 'Terjadi kesalahan saat memproses pembayaran');
        }
      });
    } catch (err: any) {
      setIsProcessing(false);
      showToast('error', err.message || 'Terjadi kesalahan internal SDK');
    }
  };

  const showToast = (type: 'error' | 'success', message: string) => {
    setToastMsg({ type, message });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  return (
    <>
      <button 
        disabled={itemCount === 0 || isProcessing}
        onClick={handlePiCheckout}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all shadow-purple-glow ${
          itemCount === 0 || isProcessing
            ? 'bg-gray-300 cursor-not-allowed shadow-none' 
            : 'bg-brand-red hover:bg-rose-700 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">Memproses <span className="animate-pulse">...</span></span>
        ) : (
          <span>Bayar dengan Pi ({itemCount})</span>
        )}
      </button>

      {/* Floating Status Toast */}
      {toastMsg && (
        <div className={`fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border-l-4 ${toastMsg.type === 'error' ? 'border-red-500' : 'border-green-500'} rounded-lg shadow-2xl p-4 border border-gray-100 flex items-start gap-3 animate-bounce-subtle`}>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">
              {toastMsg.type === 'error' ? 'Gagal' : 'Sukses'}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toastMsg.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
