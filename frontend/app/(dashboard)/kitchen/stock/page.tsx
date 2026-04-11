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

// Mock Data
const stockListData = [
  { id: 1, nama: 'Mie Mentah', jumlah: '10kg', status: 'Aman' },
  { id: 2, nama: 'Ayam Mentok', jumlah: '7kg', status: 'Aman' },
  { id: 3, nama: 'Sayur Cesim', jumlah: '13 ikat', status: 'Aman' },
  { id: 4, nama: 'Minyak Goreng', jumlah: '1.5 L', status: 'Kritis' },
  { id: 5, nama: 'Kulit Pangsit', jumlah: '4 pack', status: 'Aman' },
  { id: 6, nama: 'Bakso', jumlah: '10 pack', status: 'Aman' },
  { id: 7, nama: 'Daun Bawang', jumlah: '10 ikat', status: 'Aman' },
];

const riwayatData = [
  { id: '#443245', itemId: 1, nama: 'Mie Mentah', tipe: 'Produksi', alasan: '-', kuantiti: '10kg', waktu: '14-02-26 18:22:32', pembuat: 'Hafizh' },
  { id: '#443245', itemId: 2, nama: 'Ayam Mentok', tipe: 'Re-stock', alasan: '-', kuantiti: '7kg', waktu: '14-02-26 18:22:32', pembuat: 'Haikal' },
  { id: '#443245', itemId: 3, nama: 'Sayur Cesim', tipe: 'Penyesuaian', alasan: 'Rusak', kuantiti: '13 ikat', waktu: '14-02-26 18:22:32', pembuat: 'Haikal' },
  { id: '#443245', itemId: 4, nama: 'Minyak Goreng', tipe: 'Re-stock', alasan: '-', kuantiti: '1.5 L', waktu: '14-02-26 18:22:32', pembuat: 'Haikal' },
  { id: '#443245', itemId: 5, nama: 'Kulit Pangsit', tipe: 'Penyesuaian', alasan: 'Kadaluwarsa', kuantiti: '4 pack', waktu: '14-02-26 18:22:32', pembuat: 'Hafizh' },
  { id: '#443245', itemId: 6, nama: 'Bakso', tipe: 'Penyesuaian', alasan: 'Penyesuaian', kuantiti: '10 pack', waktu: '14-02-26 18:22:32', pembuat: 'Hafizh' },
  { id: '#443245', itemId: 7, nama: 'Daun Bawang', tipe: 'Re-stock', alasan: '-', kuantiti: '13 ikat', waktu: '14-02-26 18:22:32', pembuat: 'Hafizh' },
];

export default function StockBahanPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');

  const filterOptions = ['Penyesuaian', 'Re Stock', 'Produksi'];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Bahan</h1>
        <p className="text-gray-500 text-sm">Real-time Finance Tracking</p>
      </div>

      {/* Perubahan Terakhir Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Perubahan Terakhir</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Pembelian</span>
              <span className="text-xs text-gray-400">Staff Kitchen</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">+ Daging Ayam Segar</span>
              <span className="text-red-500 font-semibold text-sm">2 Kg</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Produksi</span>
              <span className="text-xs text-gray-400">Staff Kitchen</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">+ Mie Mentah</span>
              <span className="text-red-500 font-semibold text-sm">1 Kg</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm">Operasional</span>
              <span className="text-xs text-gray-400">Staff Kitchen</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">- Tisue Meja</span>
              <span className="text-red-500 font-semibold text-sm">2 Bungkus</span>
            </div>
          </div>
        </div>
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

      {/* Action Buttons & Filter */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex gap-3">
          <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <PackagePlus size={16} /> Laporkan Restock
          </button>
          <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <RefreshCw size={16} /> Laporkan Produksi
          </button>
          <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Edit size={16} /> Laporkan Penyesuaian
          </button>
        </div>

        {/* Custom Dropdown Filter */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Filter size={16} />
            {selectedFilter || 'Filter'}
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedFilter(option);
                    setIsFilterOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-500"
                >
                  {option}
                </button>
              ))}
              {selectedFilter && (
                <button
                  onClick={() => {
                    setSelectedFilter('');
                    setIsFilterOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 border-t mt-1"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Riwayat Perubahan Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold">Riwayat Perubahan</h2>
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
                <th className="py-3 px-4 font-medium">Item ID</th>
                <th className="py-3 px-4 font-medium text-left">Nama Barang</th>
                <th className="py-3 px-4 font-medium text-left">Tipe</th>
                <th className="py-3 px-4 font-medium">Alasan</th>
                <th className="py-3 px-4 font-medium">Kuantiti</th>
                <th className="py-3 px-4 font-medium">Perubahan Terakhir</th>
                <th className="py-3 px-4 font-medium">Dibuat Oleh</th>
              </tr>
            </thead>
            <tbody>
              {riwayatData.map((item, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-left font-medium text-gray-700">{item.id}</td>
                  <td className="py-3 px-4">{item.itemId}</td>
                  <td className="py-3 px-4 text-left font-medium">{item.nama}</td>
                  <td className="py-3 px-4 text-left">{item.tipe}</td>
                  <td className="py-3 px-4">{item.alasan}</td>
                  <td className="py-3 px-4">{item.kuantiti}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {item.waktu.split(' ')[0]} <br/> {item.waktu.split(' ')[1]}
                  </td>
                  <td className="py-3 px-4">{item.pembuat}</td>
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