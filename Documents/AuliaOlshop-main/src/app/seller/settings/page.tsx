'use client';

import { Save, AlertCircle, Upload, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface SettingsForm {
  shopName: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  minOrder: number;
  shippingDays: number;
  responseTime: number;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export default function SellerSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showBankAccount, setShowBankAccount] = useState(false);

  const [formData, setFormData] = useState<SettingsForm>({
    shopName: 'Toko Saya',
    description: 'Kami menjual berbagai macam produk berkualitas tinggi untuk memenuhi kebutuhan gaya hidup Anda.',
    address: 'Jl. Jendral Sudirman Kav. 21, Jakarta Selatan 12920',
    email: 'toko@example.com',
    phone: '+62812345678',
    bankName: 'Bank Mandiri',
    bankAccount: '1234567890123456',
    accountHolder: 'Nama Pemilik Toko',
    minOrder: 0,
    shippingDays: 2,
    responseTime: 1,
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field as keyof typeof prev.notifications]
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulasi penyimpanan ke server
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="fade-in-container space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 border-l-4 border-red-600 pl-4">
          Pengaturan Toko
        </h1>
        <p className="text-slate-600 pl-4 text-sm mt-2">
          Kelola profil, kontak, dan preferensi operasional toko Anda
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">Pengaturan toko berhasil disimpan!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: INFORMASI DASAR TOKO */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">📋 Informasi Dasar Toko</h2>
            <p className="text-slate-600 text-sm mt-2">Kelola nama, deskripsi, dan alamat toko Anda</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Nama Toko <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                placeholder="Nama toko Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">Nama yang ditampilkan di profil toko</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Deskripsi Toko
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Jelaskan tentang toko Anda, produk unggulan, atau visi misi toko..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">Maksimal 500 karakter</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Alamat Lengkap <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                placeholder="Jalan, Nomor, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">Alamat akan ditampilkan untuk verifikasi toko</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: KONTAK & KOMUNIKASI */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">📱 Kontak & Komunikasi</h2>
            <p className="text-slate-600 text-sm mt-2">Informasi kontak toko untuk pelanggan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Email Toko
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="toko@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Nomor WhatsApp/Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+62812345678"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: INFORMASI BANK (UNTUK PENARIKAN) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">🏦 Informasi Rekening Bank</h2>
            <p className="text-slate-600 text-sm mt-2">Untuk proses penarikan saldo penjualan Anda</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Nama Bank <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all bg-white"
                >
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="BCA">BCA</option>
                  <option value="BNI">BNI</option>
                  <option value="Bank Rakyat Indonesia">Bank Rakyat Indonesia</option>
                  <option value="OVO">OVO</option>
                  <option value="GCash">GCash (Filipina)</option>
                  <option value="PayMaya">PayMaya (Filipina)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Nomor Rekening <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showBankAccount ? 'text' : 'password'}
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    placeholder="Nomor rekening"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBankAccount(!showBankAccount)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showBankAccount ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Nama Pemilik Rekening <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.accountHolder}
                onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                placeholder="Nama yang terdaftar di rekening"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> Pastikan nama sesuai dengan KTP untuk verifikasi
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: PREFERENSI OPERASIONAL */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">⚙️ Preferensi Operasional</h2>
            <p className="text-slate-600 text-sm mt-2">Atur Kebijakan operasional toko Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Pembelian Minimum (Pi)
              </label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => handleInputChange('minOrder', Number(e.target.value))}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">Minimal pembelian untuk satu transaksi</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Waktu Pengiriman (Hari)
              </label>
              <input
                type="number"
                value={formData.shippingDays}
                onChange={(e) => handleInputChange('shippingDays', Number(e.target.value))}
                min="1"
                max="30"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">Durasi rata-rata pengiriman</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Waktu Respons Target (Jam)
              </label>
              <input
                type="number"
                value={formData.responseTime}
                onChange={(e) => handleInputChange('responseTime', Number(e.target.value))}
                min="1"
                max="24"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">Target untuk membalas chat pembeli</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: NOTIFIKASI */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">🔔 Preferensi Notifikasi</h2>
            <p className="text-slate-600 text-sm mt-2">Pilih cara Anda menerima notifikasi penting</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-bold text-slate-900">Email</h3>
                <p className="text-sm text-slate-500">Terima notifikasi di email toko</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationChange('email')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  formData.notifications.email ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.notifications.email ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-bold text-slate-900">SMS</h3>
                <p className="text-sm text-slate-500">Terima notifikasi lewat SMS</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationChange('sms')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  formData.notifications.sms ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.notifications.sms ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
              <div>
                <h3 className="font-bold text-slate-900">Push Notification</h3>
                <p className="text-sm text-slate-500">Notifikasi real-time di aplikasi</p>
              </div>
              <button
                type="button"
                onClick={() => handleNotificationChange('push')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  formData.notifications.push ? 'bg-red-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.notifications.push ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-8 py-3 rounded-xl border border-slate-200 text-slate-900 font-bold hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="
              inline-flex items-center gap-2 px-8 py-3
              bg-gradient-to-r from-red-600 to-rose-600
              hover:from-red-700 hover:to-rose-700
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white rounded-xl font-bold
              shadow-[0_0_20px_rgba(168,85,247,0.3)]
              hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]
              transition-all duration-300
              transform hover:scale-105 active:scale-95
            "
          >
            <Save size={18} />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
