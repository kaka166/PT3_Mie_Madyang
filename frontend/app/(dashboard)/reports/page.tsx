'use client';

import React from 'react';

// --- Icons ---
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 cursor-pointer hover:text-gray-700">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

// --- DATA DUMMY NYA DISINI YA MAS MAS BACKEDN ---
const transactions = [
  { id: '#22398', name: 'Bills #1251251', time: '14/02/26 18:22:32', type: 'Masuk', amount: 'Rp. 215.000' },
  { id: '#22398', name: 'Stok Mingguan', time: '14 Februari 2026', type: 'Keluar', amount: 'Rp. 2.215.000' },
  { id: '#22398', name: 'Andrew', time: '14 Februari 2026', type: 'Dine-In', amount: 'Rp. 215.000' },
  { id: '#22398', name: 'Andrew', time: '14 Februari 2026', type: 'Dine-In', amount: 'Rp. 215.000' },
  { id: '#22398', name: 'Andrew', time: '14 Februari 2026', type: 'Dine-In', amount: 'Rp. 215.000' },
];

export default function ReportsPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Title --- */}
        <h1 className="text-4xl font-bold text-[#424242]">Reports</h1>

        {/* --- Tab Navigation --- */}
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-lg bg-white border border-red-200 text-gray-800 font-medium shadow-sm">
            Keuangan
          </button>
          <button className="px-6 py-2 rounded-lg bg-[#FF4C4C] text-white font-medium shadow-md">
            Penjualan
          </button>
          <button className="px-6 py-2 rounded-lg bg-[#FF4C4C] text-white font-medium shadow-md">
            Kas
          </button>
        </div>

        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Penjualan Bulan Ini', value: 'Rp. 50.000.000' },
            { label: 'Total Pengeluaran Bulan ini', value: 'Rp. 50.000.000' },
            { label: 'Total Keuntungan Bulan ini', value: 'Rp. 50.000.000' },
          ].map((card, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 min-h-[180px] flex flex-col justify-between">
              <p className="text-xl font-bold text-[#333] leading-tight">{card.label}</p>
              <p className="text-3xl font-extrabold text-[#333] tracking-tight">{card.value}</p>
            </div>
          ))}
        </div>

        {/* --- Transaction Table --- */}
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#333]">Laporan Transaksi Terakhir</h2>
            <button className="flex items-center bg-[#FF7067] text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-[#ff5c52] transition-all">
              <FileTextIcon />
              Lihat Laporan Lengkap
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 font-medium">
                  <th className="px-8 py-4 font-semibold">Nomor Transaksi</th>
                  <th className="px-8 py-4 font-semibold">Nama Transaksi</th>
                  <th className="px-8 py-4 font-semibold">Waktu Transaksi</th>
                  <th className="px-8 py-4 font-semibold text-center">Tipe</th>
                  <th className="px-8 py-4 font-semibold text-right">Nominal</th>
                  <th className="px-8 py-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-[#F9F9F9]' : 'bg-white'}>
                    <td className="px-8 py-5 text-gray-700 font-medium">{tx.id}</td>
                    <td className="px-8 py-5 text-gray-700 font-medium">{tx.name}</td>
                    <td className="px-8 py-5 text-gray-700 font-medium">{tx.time}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                        tx.type === 'Masuk' ? 'bg-[#C2FFD4] text-[#2D6A4F]' : 
                        tx.type === 'Keluar' ? 'bg-[#FFC2C2] text-[#A52A2A]' : 
                        'text-gray-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-gray-700">{tx.amount}</td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center">
                        <EyeIcon />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}