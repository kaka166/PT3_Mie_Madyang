'use client';

import React from 'react'; 
import { 
  Search, 
  Calendar, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// Mock Data untuk tabel pesanan
const pesananData = [
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Fishhhh', items: 10, harga: 'Rp. 500.000', kondisi: 'Makan Disini', status: 'Antri' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Kevin', items: 10, harga: 'Rp. 500.000', kondisi: 'Bungkus', status: 'Dimasak' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Jonson', items: 10, harga: 'Rp. 500.000', kondisi: 'Bungkus', status: 'Ready' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Andika', items: 10, harga: 'Rp. 500.000', kondisi: 'Makan Disini', status: 'Ready' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Rifki', items: 10, harga: 'Rp. 500.000', kondisi: 'Bungkus', status: 'Ready' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Pratama', items: 10, harga: 'Rp. 500.000', kondisi: 'Makan Disini', status: 'Ready' },
  { id: '#443245', waktu: '14-02-26 18:22:32', customer: 'Move it', items: 10, harga: 'Rp. 500.000', kondisi: 'Bungkus', status: 'Ready' },
];

// Fungsi bantuan untuk menentukan warna badge status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Antri':
      return 'bg-gray-300 text-gray-600';
    case 'Dimasak':
      return 'bg-yellow-400 text-yellow-800';
    case 'Ready':
      return 'bg-green-300 text-green-800';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

export default function KitchenDashboardPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-1">Kitchen Dashboard</h1>
        <p className="text-gray-400 text-sm font-medium">Real Time, Track Pesanan</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar Card */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-900">Pesanan</h2>

          <div className="flex gap-3">
            
            {/* Filter Tanggal Bawaan Browser */}
            <div className="relative flex items-center">
              <input 
                type="date" 
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-44 cursor-pointer"
              />
            </div>

            {/* Input Pencarian */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Cari Pesanan (ID)" 
                className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
              />
            </div>

          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-400 border-b bg-white">
              <tr>
                <th className="py-4 px-4 font-medium">Order ID</th>
                <th className="py-4 px-4 font-medium">Waktu</th>
                <th className="py-4 px-4 font-medium">Customer</th>
                <th className="py-4 px-4 font-medium">Total Item</th>
                <th className="py-4 px-4 font-medium">Total Harga</th>
                <th className="py-4 px-4 font-medium">Kondisi</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesananData.map((item, index) => (
                <tr 
                  key={index} 
                  className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-gray-800">{item.id}</td>
                  <td className="py-4 px-4 text-gray-700">
                    <div>{item.waktu.split(' ')[0]}</div>
                    <div>{item.waktu.split(' ')[1]}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">{item.customer}</td>
                  <td className="py-4 px-4 font-medium">{item.items}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">{item.harga}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">{item.kondisi}</td>
                  <td className="py-4 px-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block w-24 text-center ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 flex justify-center items-center h-full">
                    <button className="hover:text-gray-800 p-1">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
          <span className="font-medium text-gray-500">Showing 1-9 of 2810 Transaction</span>
          <div className="flex gap-1.5 font-bold">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-500 hover:bg-red-600 text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-500 hover:bg-red-600 text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}