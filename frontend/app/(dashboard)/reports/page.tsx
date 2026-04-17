"use client";

import React from "react";

// --- Icons ---
const SalesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FF7067"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </svg>
);

const ExpenseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4A90D9"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const HppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E67E22"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const StockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9B59B6"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// --- Badge komponen untuk perubahan persen ---
const ChangeBadge = ({ value }: { value: string }) => {
  const isPositive = value.startsWith("+");
  const isNegative = value.startsWith("-");
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: isPositive
          ? "#C2FFD4"
          : isNegative
            ? "#FFC2C2"
            : "#E9E9E9",
        color: isPositive ? "#2D6A4F" : isNegative ? "#A52A2A" : "#555",
      }}>
      {value}
    </span>
  );
};

// --- DATA ---
const summaryData = {
  title: "Ringkasan Keuntungan",
  period: "April 1 - April 30, 2026",
  profitLabel: "KEUNTUNGAN",
  profit: "Rp 21.750.500",
  change: "+12.4%",
};

const statCards = [
  {
    icon: <SalesIcon />,
    label: "TOTAL PENJUALAN",
    value: "Rp 4.450.000",
    change: "+8.2%",
  },
  {
    icon: <ExpenseIcon />,
    label: "PENGELUARAN",
    value: "Rp 3.000.000",
    change: null,
  },
  {
    icon: <HppIcon />,
    label: "Laba Rugi",
    value: "Rp 1.890.000",
    change: "-2.1%",
  },
  {
    icon: <StockIcon />,
    label: "STOCK BAHAN",
    value: "33.4%",
    change: "+3.4%",
  },
];

export default function ReportsAnalyticsPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans">
      <div className="max-w-1xl mx-auto space-y-4">
        {/* --- Header Title --- */}
        <h1 className="text-3xl font-bold text-[#F53E1B]">
          Reports &amp; Analytics
        </h1>

        {/* --- Ringkasan Keuntungan Card --- */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#333]">
              {summaryData.title}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Periode: {summaryData.period}
            </p>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {summaryData.profitLabel}
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-[#FF7067] tracking-tight">
              {summaryData.profit}
            </span>
            <ChangeBadge value={summaryData.change} />
          </div>
        </div>

        {/* --- Stat Cards Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex flex-col justify-between min-h-[140px]">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-gray-50 rounded-xl">{card.icon}</div>
                {card.change && <ChangeBadge value={card.change} />}
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {card.label}
                </p>
                <p className="text-xl font-extrabold text-[#333] leading-tight">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
