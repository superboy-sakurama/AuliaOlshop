"use client";

import React, { useState } from 'react';
import { 
  Users, Store, CheckCircle, XCircle, ChevronRight, 
  ChevronDown, DollarSign, Activity, ShieldCheck, Award, Info, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

// === MOCK DATA ===
const MOCK_STATS = {
  totalTransactionsPi: 24500.5,
  totalCommissionPi: 612.5,
  activeStores: 142,
  newUsersToday: 28
};

const MOCK_PENDING_STORES = [
  { id: '1', storeName: 'Aulia Gadget Auth', owner: 'budi_pi', appliedAt: '2026-05-21 14:30', status: 'pending' },
  { id: '2', storeName: 'Fashion Nusantara', owner: 'siti_pi', appliedAt: '2026-05-22 09:15', status: 'pending' },
  { id: '3', storeName: 'Kopi Abah Pi', owner: 'abah_kopipi', appliedAt: '2026-05-22 10:05', status: 'pending' }
];

interface MLMNode {
  username: string;
  totalDownlines: number;
  totalSales?: number;
  children?: MLMNode[];
}

const MOCK_MLM_TREE: MLMNode[] = [
  {
    username: 'PhiNusantara',
    totalDownlines: 1560,
    totalSales: 8500,
    children: [
      {
        username: 'budi_pi',
        totalDownlines: 45,
        totalSales: 120,
        children: [
          { username: 'andi123', totalDownlines: 2, totalSales: 0 },
          { username: 'citra_k', totalDownlines: 10, totalSales: 45 }
        ]
      },
      {
        username: 'siti_pi',
        totalDownlines: 120,
        totalSales: 950,
        children: [
          { username: 'dewi_olshop', totalDownlines: 55, totalSales: 300 }
        ]
      }
    ]
  }
];

// Tree Node Component
const MLMTreeNode = ({ node, level = 0 }: { node: MLMNode, level?: number }) => {
  const [isOpen, setIsOpen] = useState(level < 2); // default open first two levels
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-2 sm:ml-4 first:ml-0">
      <div 
        className={`flex items-center py-1.5 px-2 my-1.5 rounded border border-transparent transition-colors ${hasChildren ? 'cursor-pointer hover:bg-purple-50 hover:border-purple-200' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${level * 1.0}rem` }}
      >
        <div className="w-6 flex justify-center mr-1">
          {hasChildren ? (
            isOpen ? <ChevronDown size={18} className="text-purple-600" /> : <ChevronRight size={18} className="text-purple-400" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          )}
        </div>
        <div className="flex-1 flex justify-between items-center bg-white border border-gray-100 rounded shadow-sm px-3 py-2 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${level === 0 ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
               <Users size={14} />
            </div>
            <span className={`text-sm ${level === 0 ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium'}`}>
              @{node.username}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-semibold bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Activity size={10} />
              {node.totalDownlines} Downline
            </div>
            {node.totalSales !== undefined && (
              <div className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full flex items-center hidden sm:flex">
                π {node.totalSales}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isOpen && hasChildren && (
        <div className="border-l-2 border-purple-100/50 ml-[23px] pl-1 mt-1 transition-all">
          {node.children!.map((child, idx) => (
            <MLMTreeNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'mlm'>('overview');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative font-sans">
      {/* Background Header - Merah Putih dengan Siluet Ungu */}
      <div className="absolute top-0 left-0 w-full h-[320px] overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-700 to-purple-900" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 text-shadow-purple">
              <ShieldCheck size={32} />
              Superadmin Portal
            </h1>
            <p className="text-purple-100 mt-1 font-medium">Marketplace Pi Network & MLM Tracker</p>
          </div>
          
          {/* Admin Navigation Pills */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-md self-start">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-purple-900 shadow-md' : 'text-white hover:bg-white/10'}`}
            >
              Ringkasan
            </button>
            <button 
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'verifications' ? 'bg-white text-purple-900 shadow-md' : 'text-white hover:bg-white/10'}`}
            >
              Verifikasi Toko
            </button>
            <button 
              onClick={() => setActiveTab('mlm')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mlm' ? 'bg-white text-purple-900 shadow-md' : 'text-white hover:bg-white/10'}`}
            >
              Jaringan MLM
            </button>
          </div>
        </div>

        {/* Info RLS Alert */}
        <div className="bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-lg p-3 mb-8 flex items-start gap-3">
           <Info className="text-white mt-0.5" size={18} />
           <p className="text-sm text-white font-medium leading-relaxed">
             Rute <code className="bg-black/20 px-1 rounded">/admin/dashboard</code> dilindungi. Hanya pengguna dengan <code className="bg-black/20 px-1 rounded">role = 'admin'</code> di Supabase yang memiliki akses ke modul ini melalui Middleware RLS.
           </p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-opacity duration-300 ${activeTab === 'overview' ? 'opacity-100' : 'hidden'}`}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-xl shadow-purple-900/5 border border-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <span className="font-bold text-lg">π</span>
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Transaksi</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{MOCK_STATS.totalTransactionsPi.toLocaleString()} Pi</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-xl shadow-purple-900/5 border border-purple-50 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-purple-glow">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+5.2%</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Komisi Terkumpul</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{MOCK_STATS.totalCommissionPi.toLocaleString()} Pi</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-xl shadow-purple-900/5 border border-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <Store size={20} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Toko Aktif</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{MOCK_STATS.activeStores}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-xl shadow-purple-900/5 border border-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Hari Ini</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Pengguna Baru</h3>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">+{MOCK_STATS.newUsersToday}</p>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Store Verification Section */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: activeTab === 'overview' || activeTab === 'verifications' ? 1 : 0 }} 
            className={`bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-purple-50 overflow-hidden ${activeTab === 'mlm' ? 'hidden' : 'block lg:col-span-1'}`}
          >
            <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Store className="text-red-600" size={20} />
                Verifikasi Toko Tertunda
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {MOCK_PENDING_STORES.map((store) => (
                <div key={store.id} className="p-6 transition-colors hover:bg-gray-50/50 group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{store.storeName}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Users size={14} className="text-purple-400"/> @{store.owner}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{store.appliedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors">
                        <CheckCircle size={16} />
                        <span className="hidden sm:inline">Setujui</span>
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors">
                        <XCircle size={16} />
                        <span className="hidden sm:inline">Tolak</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {MOCK_PENDING_STORES.length === 0 && (
                <div className="p-10 text-center text-gray-500">
                  Semua toko sudah terverifikasi.
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100">
               <button className="text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 w-full justify-center">
                 Lihat Seluruh Pengajuan <ArrowRight size={16} />
               </button>
            </div>
          </motion.div>

          {/* MLM Tree Viewer Section */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: activeTab === 'overview' || activeTab === 'mlm' ? 1 : 0 }} 
            className={`bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-purple-50 overflow-hidden ${activeTab === 'verifications' ? 'hidden' : 'block lg:col-span-1'}`}
          >
            <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Award className="text-purple-600" size={20} />
                  Visualisasi Pohon MLM
                </h2>
                <p className="text-xs text-gray-500 mt-1">Struktur Upline-Downline Global</p>
              </div>
            </div>
            <div className="p-6 h-[400px] overflow-y-auto">
              <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100/50">
                {MOCK_MLM_TREE.map((root, idx) => (
                  <MLMTreeNode key={idx} node={root} level={0} />
                ))}
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
