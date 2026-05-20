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

  // Ambil roleId sekali saja saat inisialisasi state
  const [roleId] = useState<number | null>(() => authService.getRole());

  const closeSidebar = () => setIsOpen(false);

  // Daftar Menu dengan Aturan Akses Role ID
  // 1 = Owner, 2 = Kasir, 3 = Dapur
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Admin",
      href: "/admin",
      allowedRoles: [1],
    },
    {
      icon: CreditCard,
      label: "Cashier",
      href: "/cashier",
      allowedRoles: [1, 2],
    },
    {
      icon: Package2,
      label: "Menu",
      href: "/menu",
      allowedRoles: [1],
    },
    {
      icon: UtensilsCrossed,
      label: "Kitchen",
      href: "/kitchen",
      allowedRoles: [1, 2, 3],
      subItems: [{ label: "Stock", href: "/kitchen/stock" }],
    },
    {
      icon: Clock,
      label: "Absensi",
      href: "/absensi",
      allowedRoles: [1, 2, 3],
    },
    {
      icon: BarChart3,
      label: "Reports",
      href: "/reports",
      allowedRoles: [1],
      subItems: [
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
      ],
    },
  ];

  // Filter menu berdasarkan roleId user
  const filteredMenu = menuItems.filter(
    (item) => roleId !== null && item.allowedRoles.includes(roleId),
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

      // Dapur (role 3) tidak perlu rekap
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
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
                  <span style="font-weight:600;color:#555;">Uang Akhir</span>
                  <span style="font-weight:800;color:#333;">${formatRupiah(d.closing_cash)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;">
                  <span style="font-weight:600;color:#555;">Selisih</span>
                  <span style="font-weight:800;color:${(d.selisih ?? 0) < 0 ? '#dc2626' : '#16a34a'};">${formatRupiah(d.selisih ?? 0)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px dashed #ddd;margin-top:8px;">
                  <span style="font-weight:600;color:#555;">Seharusnya</span>
                  <span style="font-weight:800;color:#333;">${formatRupiah(d.expected_cash)}</span>
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
        confirmButtonColor: "#c93535",
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
      {/* OVERLAY */}
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
        `}>
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
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {filteredMenu.map((item) => {
            const hasSubItems = !!item.subItems;
            const isParentActive = pathname.startsWith(item.href);

            return (
              <div key={item.label} className="flex flex-col">
                <LinkNext
                  href={item.href}
                  onClick={() => !hasSubItems && closeSidebar()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isParentActive
                      ? "bg-white text-primary shadow-sm border-l-4 border-primary font-bold"
                      : "text-neutral-500 hover:bg-neutral-200"
                    }`}>
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
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${pathname === sub.href
                            ? "text-neutral-900 font-bold bg-neutral-200 shadow-inner"
                            : "text-neutral-600 hover:bg-neutral-200"
                          }`}>
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
        <div className="px-3 border-t border-neutral-200 py-4  space-y-1">
          <LinkNext
            href="#"
            className="flex items-center gap-3 text-neutral-500 px-4 py-3 hover:bg-neutral-200 rounded-xl transition-all">
            <HelpCircle size={20} />
            <span className="text-sm font-semibold">Help Center</span>
          </LinkNext>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-500 px-4 py-3 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
