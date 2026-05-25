"use client";

import { useState } from "react";
import LinkNext from "next/link";
import Swal from "sweetalert2";
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
  Clock,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { authService } from "@/services/authService";
import { getActiveSession } from "@/services/sessionService";
import { formatRupiah } from "@/utils/formatRupiah";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [roleId] = useState<number | null>(() => authService.getRole());
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const closeSidebar = () => setIsOpen(false);

  const toggleExpanded = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Admin",
      href: "/admin",
      allowedRoles: [1],
    },
    {
      icon: CreditCard,
      label: "Kasir",
      href: "/cashier",
      allowedRoles: [1, 2],
    },
    {
      icon: Package2,
      label: "Inventory",
      href: "/menu",
      allowedRoles: [1],
    },
    {
      icon: UtensilsCrossed,
      label: "Kitchen",
      href: "/kitchen",
      allowedRoles: [1, 2, 3],
      subItems: [
        { label: "Pesanan Masuk", href: "/kitchen" },
        { label: "Stok Bahan", href: "/kitchen/stock" },
      ],
    },
    {
      icon: Clock,
      label: "Absensi",
      href: "/absensi",
      allowedRoles: [1, 2, 3],
    },
    {
      icon: BarChart3,
      label: "Laporan",
      href: "/reports",
      allowedRoles: [1],
      subItems: [
        { label: "Ringkasan", href: "/reports" },
        { label: "Penjualan", href: "/reports/penjualan" },
        { label: "Pengeluaran", href: "/reports/pengeluaran" },
        { label: "Laba Rugi", href: "/reports/laba-rugi" },
        { label: "HPP", href: "/reports/hpp" },
        { label: "Stock Bahan", href: "/reports/stock-bahan" },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings/qris",
      allowedRoles: [1],
      subItems: [
        { label: "QRIS", href: "/settings/qris" },
        { label: "Landing Page", href: "/settings/landing-page" },
      ],
    },
  ];

  const filteredMenu = menuItems.filter(
    (item) => roleId !== null && item.allowedRoles.includes(roleId)
  );

  const handleLogout = async () => {
    closeSidebar();
    try {
      const session = await getActiveSession();
      if (session?.data?.id) {
        await Swal.fire({
          title: "Sesi masih aktif!",
          text: "Tutup sesi terlebih dahulu sebelum logout.",
          icon: "error",
        });
        return;
      }

      let recapHtml = "";
      if (roleId !== 3) {
        try {
          const recapData = localStorage.getItem("lastSessionRecap");
          if (recapData) {
            const d = JSON.parse(recapData);
            recapHtml = `
              <div style="text-align:left;background:#f9f9f9;border-radius:16px;padding:16px;margin:12px 0;">
                <p style="font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Rekap Sesi Terakhir</p>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
                  <span style="font-weight:600;color:#555;">Uang Awal</span>
                  <span style="font-weight:800;color:#333;">${formatRupiah(d.opening_cash)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
                  <span style="font-weight:600;color:#555;">Penjualan</span>
                  <span style="font-weight:800;color:#16a34a;">+${formatRupiah(d.total_pemasukan)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
                  <span style="font-weight:600;color:#555;">Pengeluaran</span>
                  <span style="font-weight:800;color:#dc2626;">-${formatRupiah(d.total_pengeluaran)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;">
                  <span style="font-weight:600;color:#555;">Uang Akhir</span>
                  <span style="font-weight:800;color:#333;">${formatRupiah(d.closing_cash)}</span>
                </div>
              </div>
            `;
          }
        } catch (err) {
          console.error("Gagal parse rekap:", err);
        }
      }

      const result = await Swal.fire({
        title: "Yakin mau keluar?",
        html: recapHtml,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b93b3b",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        authService.logout();
        router.push("/login");
      }
    } catch (error) {
      console.error("Gagal cek session:", error);
    }
  };

  return (
    <>
      {/* OVERLAY (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64
          bg-[#1a1a2e] flex flex-col
          z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#b93b3b] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/30">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">Ma-Dyang</p>
            <p className="text-white/30 text-[10px] font-medium uppercase tracking-widest">POS System</p>
          </div>
          <button
            onClick={closeSidebar}
            className="ml-auto lg:hidden text-white/40 hover:text-white/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ROLE BADGE */}
        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-white/50 text-xs font-semibold">
              {roleId ? authService.getRoleName(roleId) : "Unauthorized"}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto sidebar-scrollbar space-y-0.5">
          <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-2 mt-1">
            Menu Utama
          </p>

          {filteredMenu.map((item) => {
            const hasSubItems = !!item.subItems;
            const isParentActive = pathname.startsWith(item.href);
            const isExpanded = expandedMenus.includes(item.label) || isParentActive;

            return (
              <div key={item.label}>
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isParentActive
                        ? "bg-[#b93b3b] text-white shadow-lg shadow-red-900/20"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className="text-sm font-semibold flex-1 text-left">{item.label}</span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="opacity-60" />
                    ) : (
                      <ChevronRight size={14} className="opacity-60" />
                    )}
                  </button>
                ) : (
                  <LinkNext
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isParentActive
                        ? "bg-[#b93b3b] text-white shadow-lg shadow-red-900/20"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </LinkNext>
                )}

                {/* SUBMENU */}
                {hasSubItems && isExpanded && (
                  <div className="mt-0.5 ml-4 pl-4 border-l border-white/10 space-y-0.5 pb-1">
                    {item.subItems!.map((sub) => {
                        const isSubActive = sub.href === item.href
                          ? pathname === sub.href
                          : pathname.startsWith(sub.href);
                        return (
                          <LinkNext
                            key={sub.label}
                            href={sub.href}
                            onClick={closeSidebar}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                              isSubActive
                                ? "text-white font-bold bg-white/10"
                                : "text-white/40 hover:text-white/70 hover:bg-white/5 font-medium"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${isSubActive ? 'bg-[#b93b3b]' : 'bg-white/20'}`} />
                            {sub.label}
                          </LinkNext>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="px-3 pb-4 pt-3 border-t border-white/5 space-y-0.5 flex-shrink-0">
          <LinkNext
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-white/40 hover:text-white/70 hover:bg-white/5 rounded-xl transition-all"
          >
            <HelpCircle size={18} />
            <span className="text-sm font-semibold">Bantuan</span>
          </LinkNext>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400/70 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
