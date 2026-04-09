"use client";

import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package2,
  CreditCard,
  BarChart3,
  UtensilsCrossed,
  HelpCircle,
  LogOut,
} from "lucide-react";

import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

// ============================================================
// MEH GANTI PATH/URL GAMBAR DISINI MASS
const BANNER_SRC = "/assets/Logo_Mie_Ma-Dyang_RemovedBG.png";

const BANNER_ALT = "Logo Mie Ayam Ma-Dyang";

// GANTI UKURAN TAMPILAN GAMBAR (px)
const BANNER_WIDTH = 400;
const BANNER_HEIGHT = 100;
// ============================================================

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Admin", href: "/admin" },
    { icon: CreditCard, label: "Cashier", href: "/cashier" },
    { icon: Package2, label: "Menu", href: "/inventory" },
    { icon: UtensilsCrossed, label: "Kitchen", href: "/kitchen" },
    {
      icon: BarChart3,
      label: "Reports",
      href: "/reports",
      // Sub-menu langsung dideklarasikan di sini
      subItems: [
        { label: "Penjualan", href: "/reports/penjualan" },
        { label: "Pengeluaran", href: "/reports/pengeluaran" },
        { label: "HPP", href: "/reports/hpp" },
        { label: "Stock Bahan", href: "/reports/stock-bahan" },
      ],
    },
  ];

  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin mau keluar?",
      text: "Kamu harus login lagi untuk mengakses dashboard Ma-Dyang.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c93535", // Warna merah utama Ma-Dyang
      cancelButtonColor: "#6b7280", // Warna neutral gray
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      reverseButtons: true, // Biar tombol Batal di kiri, Keluar di kanan
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proses logout
        authService.logout();

        // Opsional: Tampilkan notif sukses sebentar
        await Swal.fire({
          title: "Logout Berhasil",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        router.push("/login");
      }
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-100 shadow-sm flex flex-col z-50">
      <div className="flex items-center px-6 py-4 border-b border-neutral-200 min-h-[57px]">
        <Image
          src={BANNER_SRC}
          alt={BANNER_ALT}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          className="object-contain"
          priority
        />
      </div>

      {/* Sub-judul */}
      <div className="px-6 pt-5 pb-3">
        <p className="text-xs text-neutral-500 font-medium">
          The Culinary Curator
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const hasSubItems = !!item.subItems;
          // Parent aktif jika path cocok ATAU salah satu sub-item-nya sedang aktif
          const isParentActive =
            pathname === item.href ||
            (hasSubItems &&
              item.subItems.some((sub) => pathname.startsWith(sub.href)));

          return (
            <div key={item.label} className="flex flex-col">
              {/* Parent Link */}
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-r-lg transform transition-all duration-200 ${
                  isParentActive
                    ? "bg-white text-primary scale-105 shadow-md border-l-4 border-primary font-bold"
                    : "text-neutral-500 hover:text-primary hover:bg-neutral-200"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>

              {/* Sub-Items dibawah reports aktif tanpa dropdown bolooo */}
              {hasSubItems && (
                <div className="flex flex-col gap-2 mt-2 ml-6 mr-2 mb-2">
                  {item.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        // Efek membesar pas dihover dan border disesuaikan
                        className={`flex items-center px-4 py-2 rounded-r-md transform transition-all duration-200 border-l-[5px] ${
                          isSubActive
                            ? "bg-neutral-200 border-neutral-600 text-neutral-800 font-bold scale-105 shadow-sm"
                            : "border-transparent text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800 hover:scale-105"
                        }`}
                      >
                        <span className="text-sm font-semibold">
                          {sub.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 border-t border-neutral-200 pt-4 pb-4">
        <Link
          href="#"
          className="flex items-center gap-3 text-neutral-500 px-4 py-3 hover:text-primary transition-colors hover:bg-neutral-200"
        >
          <HelpCircle size={20} />
          <span className="text-sm font-semibold">Help</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-neutral-500 px-4 py-3 hover:text-primary transition-colors hover:bg-neutral-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
