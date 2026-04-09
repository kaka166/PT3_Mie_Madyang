"use client";

import { useState } from "react";
import Navbar from "../../src/components/dashboard/navbar";
import Sidebar from "../../src/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Tambahkan h-screen dan overflow-hidden di sini agar scroll hanya di area konten
    <div className="h-screen flex flex-col bg-[#f9f9f9] overflow-hidden">
      
      {/* 1. Navbar: Naikkan z-index ke 100 agar mutlak di atas */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-16">
        <Navbar onMenuClick={() => setIsOpen(!isOpen)} />
      </div>

      {/* 2. Wrapper Utama: Beri pt-16 agar konten tidak terpotong Navbar */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* 3. Area Konten: Hilangkan padding p-6 md:p-8 KHUSUS untuk halaman POS */}
        {/* Agar halaman POS bisa full sampai pinggir dan mengontrol scroll sendiri */}
        <main className="flex-1 overflow-hidden lg:ml-64 relative">
          {children}
        </main>
      </div>
    </div>
  );
}