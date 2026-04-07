"use client";

import Image from "next/image";
import Link from "next/link";
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
    { icon: LayoutDashboard, label: "Admin",     href: "/admin" },
    { icon: CreditCard,      label: "Cashier",   href: "/cashier" },
    { icon: Package2,        label: "Menu", href: "/inventory" },
    { icon: BarChart3,       label: "Reports",   href: "/reports" },
    { icon: UtensilsCrossed, label: "Kitchen",   href: "/kitchen" },
  ];

  return (
    // top-0 agar tembus sampai atas, z-50 lebih tinggi dari navbar (z-40)
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
        <p className="text-xs text-neutral-500 font-medium">The Culinary Curator</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-lg transform transition-all duration-200 ${
                isActive
                  ? "bg-white text-primary scale-105 shadow-md border-l-4 border-primary font-bold"
                  : "text-neutral-500 hover:text-primary hover:bg-neutral-200"
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 border-t border-neutral-200 pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 text-neutral-500 px-4 py-3 hover:text-primary transition-colors"
        >
          <HelpCircle size={20} />
          <span className="text-sm font-semibold">Help</span>
        </Link>
        <button className="w-full flex items-center gap-3 text-neutral-500 px-4 py-3 hover:text-primary transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>

    </aside>
  );
}