'use client';

import React, { useState } from 'react';

// --- Icon Components ---
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);


// Donut/Pie icon for Expense Breakdown header
const DonutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="9" stroke="#e0e0e0" strokeWidth="4" fill="none" />
    <circle cx="11" cy="11" r="9" stroke="#C0392B" strokeWidth="4" strokeDasharray="35 22" strokeDashoffset="0" fill="none" />
    <circle cx="11" cy="11" r="9" stroke="#888" strokeWidth="4" strokeDasharray="22 35" strokeDashoffset="-35" fill="none" />
  </svg>
);

// Faint background icons for summary cards
const FaintCameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -bottom-3 -right-3 opacity-[0.06] text-gray-800">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>
  </svg>
);
const FaintMonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -bottom-3 -right-3 opacity-[0.06] text-gray-800">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);
const FaintCoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="absolute -bottom-3 -right-3 opacity-[0.06] text-gray-800">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

// --- Transaction Data ---
const transactions = [
  { date: 'Oct 24, 14:20', id: '#MD-102456', status: 'SUCCESS', amount: 'Rp 45,500' },
  { date: 'Oct 24, 13:55', id: '#MD-102455', status: 'SUCCESS', amount: 'Rp 112,000' },
  { date: 'Oct 24, 13:30', id: '#MD-102454', status: 'REFUNDED', amount: '- Rp 32,000' },
  { date: 'Oct 24, 12:45', id: '#MD-102453', status: 'SUCCESS', amount: 'Rp 78,000' },
  { date: 'Oct 24, 12:15', id: '#MD-102452', status: 'SUCCESS', amount: 'Rp 245,000' },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50 min-h-screen font-sans">
      <div className="p-6 space-y-5 max-w-6xl mx-auto">
        {/* ── Title & Date ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-red-700 tracking-tight">Reports & Analytics</h1>
          <button className="flex items-center gap-2 text-sm text-gray-700 border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {/* TANGGALAN DISINI */}
            <span>Maret 1, 2026 – Mei 31, 2026</span>
          </button>
        </div>

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Monthly Performance Overview</h2>
            <p className="text-sm text-gray-500 mt-0.5">Detailed breakdown of your culinary business health.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-white rounded-lg px-4 py-2 hover:bg-red-50 transition-colors">
            <DownloadIcon />
            Download Report
          </button>
        </div>

        {/* ── 3 Summary Cards ── */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {/* Card: Total Sales */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-5 overflow-hidden border-l-4 border-l-red-600">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Total Sales</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">Rp 42.8M</span>
              <span className="text-sm font-semibold text-green-600 mb-0.5">↑12%</span>
            </div>
            <FaintCameraIcon />
          </div>

          {/* Card: Total Expenses */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-5 overflow-hidden border-l-4 border-l-gray-400">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Total Expenses</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">Rp 18.2M</span>
              <span className="text-sm font-semibold text-red-500 mb-0.5">↓4%</span>
            </div>
            <FaintMonitorIcon />
          </div>

          {/* Card: Estimated Profit */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-5 overflow-hidden border-l-4 border-l-green-500">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Estimated Profit</p>
            <div className="flex items-start justify-between">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">Rp 24.6M</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 border border-green-200 rounded-full px-2 py-0.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                New Record
              </span>
            </div>
            <FaintCoinIcon />
          </div>
        </div>

        {/* ── Bottom Section: Expense Breakdown + Recent Transactions ── */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
          {/* Expense Breakdown */}
          <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-2">
              <DonutIcon />
              <h3 className="font-bold text-gray-900 text-base">Expense Breakdown</h3>
            </div>

            {/* Raw Materials */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Raw Materials</span>
                <span className="font-bold text-red-600">Rp 12.4M (68%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: '68%' }} />
              </div>
              <p className="text-xs text-gray-400">Noodles, chicken, spices, and packaging.</p>
            </div>

            {/* Operational */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Operational</span>
                <span className="font-bold text-gray-600">Rp 5.8M (32%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-gray-500 transition-all" style={{ width: '32%' }} />
              </div>
              <p className="text-xs text-gray-400">Electricity, rent, gas, and cleaning supplies.</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-3 rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-red-600"><ListIcon /></span>
                <h3 className="font-bold text-gray-900 text-base">Recent Transactions</h3>
              </div>
              {/* Search */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-gray-50"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3 pr-4">Date</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3 pr-4">Transaction ID</th>
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3 pr-4">Status</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-gray-400 pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-3.5 pr-4 text-gray-600 text-sm whitespace-nowrap">{tx.date}</td>
                      <td className="py-3.5 pr-4 font-mono text-gray-700 text-sm">{tx.id}</td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            tx.status === 'SUCCESS'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3.5 text-right font-semibold text-sm ${tx.amount.startsWith('-') ? 'text-red-500' : 'text-gray-900'}`}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-gray-400">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-2 border-t border-gray-100">
              <button className="flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors mx-auto">
                View All Transactions
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}