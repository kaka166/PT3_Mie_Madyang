'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  PackagePlus,
  RefreshCw,
  Edit
} from 'lucide-react';

// Mockup Data
const stockListData = [
  { id: 1, nama: 'Mie Mentah', jumlah: '10kg', status: 'Aman' },
  { id: 2, nama: 'Ayam Mentok', jumlah: '7kg', status: 'Aman' },
  { id: 3, nama: 'Sayur Cesim', jumlah: '13 ikat', status: 'Aman' },
  { id: 4, nama: 'Minyak Goreng', jumlah: '1.5 L', status: 'Kritis' },
  { id: 5, nama: 'Kulit Pangsit', jumlah: '4 pack', status: 'Aman' },
  { id: 6, nama: 'Bakso', jumlah: '10 pack', status: 'Aman' },
  { id: 7, nama: 'Daun Bawang', jumlah: '10 ikat', status: 'Aman' },
];


export default function StockBahanPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');

  const filterOptions = ['Penyesuaian', 'Re Stock', 'Produksi'];

  return (
    <div className="min-h-screen bg-neutral-0 p-8 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Laporan Stock Bahan</h1>
        <p className="text-gray-500 text-sm">Real-time Finance Tracking</p>
      </div>

      <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 mb-6 transition-colors">
        <Download size={16} />
        Download Report
      </button>

      {/* Stock List Section */}
      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Stock List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 px-4 font-medium text-left">ID</th>
                <th className="py-3 px-4 font-medium text-left">Nama Barang</th>
                <th className="py-3 px-4 font-medium">Jumlah Stock</th>
                <th className="py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stockListData.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-left">{item.id}</td>
                  <td className="py-3 px-4 text-left">{item.nama}</td>
                  <td className="py-3 px-4">{item.jumlah}</td>
                  <td className="py-3 px-4 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Aman' ? 'bg-green-200 text-green-700' : 'bg-red-400 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Dummy */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>Showing 1-9 of 2810 Transaction</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200">5</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
