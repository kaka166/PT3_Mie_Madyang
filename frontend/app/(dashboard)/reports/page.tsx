"use client";

import React, { useState, useEffect } from "react";
import { getLabaRugi } from "@/services/laporanService";
import { getStockList } from "@/services/stockService";
import { formatRupiah } from "@/utils/formatRupiah";
import { API_BASE_URL } from "@/config";

interface ReportsRingkasan {
  total_penjualan: number;
  total_pengeluaran: number;
  laba_bersih: number;
}

interface ReportsStockItem {
  id: number;
  nama: string;
  jumlah: string;
  stock_limit: number;
  status: string;
}

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

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function ReportsAnalyticsPage() {
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<{ ringkasan: ReportsRingkasan | null; stock: ReportsStockItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labaRugiRes, stock] = await Promise.all([
          getLabaRugi(),
          getStockList().catch(() => []),
        ]);
        setData({
          ringkasan: labaRugiRes.success ? labaRugiRes.data.ringkasan : null,
          stock,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ringkasan = data?.ringkasan;
  const stockList = data?.stock || [];
  const kritisCount = stockList.filter((s: ReportsStockItem) => s.status === "Kritis").length;
  const stockPct = stockList.length > 0
    ? Math.round(((stockList.length - kritisCount) / stockList.length) * 100)
    : 0;

  const statCards = ringkasan
    ? [
        { icon: <SalesIcon />, label: "TOTAL PENJUALAN", value: formatRupiah(ringkasan.total_penjualan) },
        { icon: <ExpenseIcon />, label: "PENGELUARAN", value: formatRupiah(ringkasan.total_pengeluaran) },
        { icon: <HppIcon />, label: "LABA RUGI", value: formatRupiah(ringkasan.laba_bersih) },
        { icon: <StockIcon />, label: "STOK BAHAN AMAN", value: `${stockPct}%` },
      ]
    : [];

  const handleDownloadEvidence = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/laporan/download-evidence?type=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Tidak ada evidence untuk periode ini"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evidence.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* --- Header Title --- */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#F53E1B]">
            Reports &amp; Analytics
          </h1>
          <button onClick={handleDownloadEvidence} disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
            <DownloadIcon /> {downloading ? "Mengunduh..." : "Download Evidence"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[140px]">
                  <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-28"></div>
                </div>
              ))}
            </div>
          </div>
        ) : ringkasan ? (
          <>
            {/* --- Ringkasan Keuntungan Card --- */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#333]">
                  Ringkasan Keuntungan
                </h2>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                LABA BERSIH
              </p>
              <div className="flex items-baseline gap-3">
                <span className={`text-5xl font-extrabold tracking-tight ${ringkasan.laba_bersih >= 0 ? "text-[#FF7067]" : "text-red-600"}`}>
                  {formatRupiah(ringkasan.laba_bersih)}
                </span>
              </div>
            </div>

            {/* --- Stat Cards Grid --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-5 flex flex-col justify-between min-h-[140px] transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-gray-50 rounded-xl">{card.icon}</div>
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
          </>
        ) : (
          <div className="text-center py-20 text-neutral-400">Belum ada data</div>
        )}
      </div>
    </div>
  );
}
