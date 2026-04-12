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
  Edit,
  X 
} from 'lucide-react';

// Mockup Data untuk Stock List
const stockListData = [
  { id: 1, nama: 'Mie Mentah', jumlah: '10kg', status: 'Aman' },
  { id: 2, nama: 'Ayam Mentok', jumlah: '7kg', status: 'Aman' },
  { id: 3, nama: 'Sayur Cesim', jumlah: '13 ikat', status: 'Aman' },
  { id: 4, nama: 'Minyak Goreng', jumlah: '1.5 L', status: 'Kritis' },
  { id: 5, nama: 'Kulit Pangsit', jumlah: '4 pack', status: 'Aman' },
  { id: 6, nama: 'Bakso', jumlah: '10 pack', status: 'Aman' },
  { id: 7, nama: 'Daun Bawang', jumlah: '10 ikat', status: 'Aman' },
];

// Mockup Data untuk Riwayat Perubahan Stock
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

  // --- STATE  ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isBahanBaru, setIsBahanBaru] = useState(true); // untuk tombol Ya/Tidak

  // Mock Data untuk Riwayat di dalam Pop-up (Menampilkan 5 data)
  const riwayatModalData = [
    { alasan: 'Rusak', qty: '- 25', unit: 'Kg', pembuat: 'Hafizh', waktu: '14-02-26 18:22:32', type: 'minus' },
    { alasan: 'Kadaluwarsa', qty: '- 2.3', unit: 'Kg', pembuat: 'Hafizh', waktu: '14-02-26 18:22:32', type: 'minus' },
    { alasan: 'Salah Hitung', qty: '- 2.3', unit: 'Kg', pembuat: 'Hafizh', waktu: '14-02-26 18:22:32', type: 'minus' },
    { alasan: 'Sisa', qty: '- 1', unit: 'Kg', pembuat: 'Hafizh', waktu: '14-02-26 18:22:32', type: 'minus' },
  ];

  // Mock Data untuk Keranjang Restock
  const keranjangData = [
    { nama: 'Daging Ayam Segar', qty: '25', unit: 'Kg', pembuat: 'Staff Kasir Wirman', waktu: '14-02-26 18:22:32' },
    { nama: 'Kaldu Jamur totole', qty: '1', unit: 'Pack', pembuat: 'Staff Kasir Wirman', waktu: '14-02-26 18:22:32' },
    { nama: 'Minyak Bimoli', qty: '10', unit: 'L', pembuat: 'Staff Kasir Wirman', waktu: '14-02-26 18:22:32' },
    { nama: 'Minyak apalahh', qty: '800', unit: 'ml', pembuat: 'Staff Kasir Wirman', waktu: '14-02-26 18:22:32' },
  ];
  
  return (
    // Ditambahkan overflow-y-auto, w-full, dan pb-12 di div paling luar ini
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stock Bahan</h1>
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

      {/* Action Buttons & Filter */}
      <div className="flex justify-between items-end mb-6">
        <div className="flex gap-3">
          <button 
            onClick={() => setIsRestockModalOpen(true)} // <-- Tambahkan baris ini
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PackagePlus size={16} /> Laporkan Restock
          </button>
          <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <RefreshCw size={16} /> Laporkan Produksi
          </button>
          <button 
            onClick={() => setIsModalOpen(true)} // <-- Tambahkan ini
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
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
                <th className="py-3 px-4 font-medium textrr">Item ID</th>
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
      {/* --- MODAL POP-UP PENYESUAIAN STOCK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            
            {/* Bagian Kiri: Form Input */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Penyesuaian Stock</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Nama Barang</label>
                <select className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none">
                  <option>Nama barang...</option>
                  <option>Ayam Potong</option>
                  <option>Mie Mentah</option>
                </select>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Jumlah Sekarang</label>
                  <div className="text-lg font-bold">15 Kg</div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Jumlah perubahan stock</label>
                  <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                    <input type="number" placeholder="Jumlah" className="w-full bg-transparent p-2 text-sm outline-none" />
                    <select className="bg-gray-200 border-l px-2 text-sm outline-none font-medium">
                      <option>Kg</option>
                      <option>G</option>
                      <option>L</option>
                      <option>Ml</option>
                      <option>Pack</option>
                      <option>Ikat</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Alasan Perubahan Stock</label>
                <div className="flex flex-wrap gap-3">
                  {['Rusak', 'Hilang', 'Kadaluwarsa', 'Salah Hitung', 'Sisa', 'Penjualan'].map((alasan) => (
                    <button key={alasan} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors">
                      {alasan}
                    </button>
                  ))}
                </div>
              </div>

              <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">
                Simpan
              </button>
            </div>

            {/* Bagian Kanan: Info & Riwayat Scrollable */}
            <div className="flex-1 bg-gray-100 p-6 relative flex flex-col h-full">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-red-200 text-gray-700 hover:bg-red-300 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>

              {/* Info Card */}
              <div className="bg-white p-4 rounded-xl shadow-sm mb-6 mt-6 md:mt-0">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-bold text-gray-800">Daging Ayam</h3>
                  <span className="text-xs text-gray-400">#443245</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Alasan perubahan</div>
                    <div className="font-medium text-gray-700">Rusak</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Perubahan Stok Terakhir</div>
                    <div className="font-medium text-gray-700">14-02-26 18:22:32</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Jumlah Sekarang</div>
                    <div className="font-medium text-gray-700">15 Kg</div>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Riwayat Perubahan Stock</h3>
              
              {/* List Riwayat - Dibuat Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-4">
                {riwayatModalData.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-xl shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Daging Ayam</span>
                      <span className={`font-bold text-lg ${item.type === 'plus' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.qty} <span className="text-sm text-gray-800">{item.unit}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{item.pembuat}</span>
                      <span className={`font-medium ${item.type === 'plus' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.alasan}
                      </span>
                      <span className="text-gray-500">{item.waktu}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL POP-UP LAPORAN RESTOCK --- */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh]">
            
            {/* Bagian Kiri: Form Input Laporan Restock */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Laporan Restock</h2>
              
              {/* Toggle Penambahan Bahan Baru */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Penambahan Bahan Baru?</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsBahanBaru(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${isBahanBaru ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Ya
                  </button>
                  <button 
                    onClick={() => setIsBahanBaru(false)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!isBahanBaru ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Tidak
                  </button>
                </div>
              </div>

              {/* Input Nama Barang */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Nama Barang</label>
                <select className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none appearance-none">
                  <option>Nama barang...</option>
                  <option>Ayam Potong</option>
                  <option>Mie Mentah</option>
                </select>
              </div>

              {/* Jumlah Sekarang & Jumlah Baru */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Jumlah Sekarang</label>
                  <div className="text-lg font-bold">15 Kg</div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-2">Jumlah Baru</label>
                  <div className="flex border rounded-lg overflow-hidden bg-gray-100">
                    <input type="number" placeholder="Jumlah" className="w-full bg-transparent p-2 text-sm outline-none" />
                    <select className="bg-gray-200 border-l px-2 text-sm outline-none font-medium">
                      <option>Kg</option>
                      <option>L</option>
                      <option>Pack</option>
                      <option>ml</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Harga per Satuan */}
              <div className="mb-6 w-1/2 pr-2">
                <label className="block text-sm font-semibold mb-2">Harga per satuan</label>
                <input 
                  type="number" 
                  placeholder="Harga" 
                  className="w-full bg-gray-100 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">
                Tambahkan ke keranjang
              </button>
            </div>

            {/* Bagian Kanan: Keranjang (Scrollable) */}
            <div className="flex-1 bg-gray-100 p-6 relative flex flex-col h-full border-l border-gray-200">
              <button 
                onClick={() => setIsRestockModalOpen(false)}
                className="absolute top-4 right-4 bg-red-200 text-gray-700 hover:bg-red-300 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="font-bold text-xl mb-6 text-gray-900 mt-2 md:mt-0">Keranjang</h3>
              
              {/* List Keranjang */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-6">
                {keranjangData.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 text-base">{item.nama}</span>
                      <span className="font-bold text-xl text-red-600">
                        {item.qty} <span className="text-sm text-gray-900">{item.unit}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-gray-400 font-medium">{item.pembuat}</span>
                      <span className="text-gray-500">{item.waktu}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-auto w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                Simpan Data Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}