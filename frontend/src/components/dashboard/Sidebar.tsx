"use client";

import { useState } from "react";
import LinkNext from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package2,
  CreditCard,
  BarChart3,
  UtensilsCrossed,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { authService } from "@/services/authService";

// --- DUMMY DATA UNTUK HISTORY PENJUALAN ---
const dummyHistory = [
  {
    id: "#12125512",
    totalTagihan: "Rp. 82.100,00",
    items: [
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
    ]
  },
  {
    id: "#12125512",
    totalTagihan: "Rp. 82.100,00",
    items: [
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
    ]
  },
  {
    id: "#12125512",
    totalTagihan: "Rp. 82.100,00",
    items: [
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
      { qty: 2, nama: "Mie Yamin Asin", hargaSatuan: "Rp15.000", subtotal: "Rp30.000" },
    ]
  }
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Ambil roleId sekali saja saat inisialisasi state
  const [roleId] = useState<number | null>(() => authService.getRole());
  
  // State untuk mengontrol Modal Logout
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  // Daftar Menu dengan Aturan Akses Role ID
  // 1 = Owner, 2 = Kasir, 3 = Dapur
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Admin", 
      href: "/admin", 
      allowedRoles: [1] 
    },
    { 
      icon: CreditCard, 
      label: "Cashier", 
      href: "/cashier", 
      allowedRoles: [1, 2] 
    },
    { 
      icon: Package2, 
      label: "Menu", 
      href: "/inventory", 
      allowedRoles: [1] 
    },
    { 
      icon: UtensilsCrossed, 
      label: "Kitchen", 
      href: "/kitchen", 
      allowedRoles: [1, 2, 3],
      subItems: [
        { label: "Stock", href: "/kitchen/stock" },
      ],
    },
    {
      icon: BarChart3,
      label: "Reports",
      href: "/reports",
      allowedRoles: [1],
      subItems: [
        { label: "Penjualan", href: "/reports/penjualan" },
        { label: "Pengeluaran", href: "/reports/pengeluaran" },
        { label: "HPP", href: "/reports/hpp" },
        { label: "Stock Bahan", href: "/reports/stock-bahan" },
      ],
    },
  ];

  // Filter menu berdasarkan roleId user
  const filteredMenu = menuItems.filter((item) => 
    roleId !== null && item.allowedRoles.includes(roleId)
  );

  const handleLogoutClick = () => {
    closeSidebar();
    setIsLogoutModalOpen(true); // Buka modal rekapitulasi
  };

  const handleConfirmLogout = () => {
    authService.logout();
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false); // Tutup modal, lanjut shift
  };

  return (
    <>
      {/* OVERLAY SIDEBAR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100%-4rem)] w-64 
          bg-neutral-100 shadow-sm flex flex-col 
          z-40 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 border-r border-neutral-200
        `}
      >
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-neutral-200">
          <span className="font-bold text-primary italic">MA-DYANG POS</span>
          <button onClick={closeSidebar} className="text-neutral-400">
            <X size={20} />
          </button>
        </div>

        {/* ROLE INFO AREA */}
        <div className="px-6 pt-5 pb-3">
          <p className="font-medium text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
            The Culinary Curator
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-600">
              Role: {roleId ? authService.getRoleName(roleId) : "Unauthorized"}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => {
            const hasSubItems = !!item.subItems;
            const isParentActive = pathname.startsWith(item.href);

            return (
              <div key={item.label} className="flex flex-col">
                <LinkNext
                  href={item.href}
                  onClick={() => !hasSubItems && closeSidebar()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isParentActive
                      ? "bg-white text-primary shadow-sm border-l-4 border-primary font-bold"
                      : "text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </LinkNext>

                {/* SUBMENU LOGIC */}
                {hasSubItems && isParentActive && (
                  <div className="flex flex-col gap-1 mt-1 ml-6 mb-2">
                    {item.subItems.map((sub) => (
                      <LinkNext
                        key={sub.label}
                        href={sub.href}
                        onClick={closeSidebar}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                          pathname === sub.href
                            ? "text-neutral-900 font-bold bg-neutral-200 shadow-inner"
                            : "text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {sub.label}
                      </LinkNext>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-3 border-t border-neutral-200 py-4 space-y-1">
            <LinkNext
            href="#"
            className="flex items-center gap-3 text-neutral-500 px-4 py-3 hover:bg-neutral-200 rounded-xl transition-all"
          >
            <HelpCircle size={20} />
            <span className="text-sm font-semibold">Help Center</span>
          </LinkNext>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 text-red-500 px-4 py-3 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MODAL REKAPITULASI LOGOUT --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl flex w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Tombol Close (Opsional) */}
            <button 
              onClick={handleCancelLogout}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>

            {/* PANEL KIRI - Rekapitulasi */}
            <div className="w-[45%] p-10 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div>
                <h1 className="text-4xl font-extrabold text-black mb-1">Rekapitulasi Penjualan</h1>
                <p className="text-gray-500 font-semibold mb-8 text-lg">Laporan Rekapitulasi Penjualan</p>

                <div className="mb-6">
                  <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Nama Kasir</p>
                  <p className="text-2xl font-bold text-black">Kevin Jonson</p>
                </div>

                <div className="flex gap-8 mb-8">
                  <div>
                    <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Waktu Login</p>
                    <p className="text-xl font-bold text-black">08:00:02</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Waktu Logout</p>
                    <p className="text-xl font-bold text-black">17.00:12</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Lama Sesi</p>
                    <p className="text-xl font-bold text-black">09.00.15</p>
                  </div>
                </div>

                <div className="bg-[#f2f2f2] rounded-3xl p-6 w-56 mb-8 flex flex-col items-center justify-center relative">
                  <div className="bg-[#a83232] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-md mb-4 z-10">
                    72
                  </div>
                  <p className="text-[#a83232] font-bold text-lg text-center">Produk Terjual</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Hasil Penjualan Selama Shift</p>
                  <p className="text-2xl font-bold text-black">Rp. 926.000,00</p>
                </div>

                <div className="mb-8">
                  <p className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Penjualan Produk Terbanyak</p>
                  <p className="text-2xl font-bold text-black">Mie Yamin Asin Uhuy</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={handleConfirmLogout}
                  className="w-full bg-[#9b3a3a] hover:bg-[#852f2f] text-white font-bold text-xl py-4 rounded-2xl transition-colors shadow-md"
                >
                  Konfirmasi dan Logout
                </button>
                <button 
                  onClick={handleCancelLogout}
                  className="w-full text-gray-400 hover:text-gray-600 font-bold text-xl py-3 rounded-2xl transition-colors"
                >
                  Batalkan dan Lanjutkan Shift
                </button>
              </div>
            </div>

            {/* PANEL KANAN - History Penjualan */}
            <div className="w-[55%] p-10 border-l border-gray-200 flex flex-col bg-gray-50/50">
              <h2 className="text-3xl font-extrabold text-black mb-8 text-center pt-2">History Penjualan</h2>
              
              <div className="flex-1 overflow-y-auto pr-3 space-y-5 custom-scrollbar">
                {dummyHistory.map((tagihan, index) => (
                  <div key={index} className="bg-[#f5f5f5] rounded-3xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl font-bold text-black">Tagihan {tagihan.id}</h3>
                      <span className="text-[#a83232] font-bold text-xl">{tagihan.totalTagihan}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {tagihan.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-medium text-gray-700">
                          <div className="flex w-1/2">
                            <span className="w-8">{item.qty}</span>
                            <span>{item.nama}</span>
                          </div>
                          <div className="w-1/4 text-right text-gray-500">{item.hargaSatuan}</div>
                          <div className="w-1/4 text-right text-black">{item.subtotal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CSS Scrollbar Kustom */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
        }
      `}} />
    </>
  );
}