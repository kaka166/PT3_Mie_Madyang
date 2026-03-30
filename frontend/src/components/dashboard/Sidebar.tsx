"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package2,
  CreditCard,
  BarChart3,
  UtensilsCrossed,
  Plus,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Admin", href: "/admin" },
    { icon: CreditCard, label: "Cashier", href: "/cashier" },
    { icon: Package2, label: "Inventory", href: "/inventory" },
    { icon: BarChart3, label: "Reports", href: "#" },
    { icon: UtensilsCrossed, label: "Kitchen", href: "/kitchen" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-neutral-100 white shadow-sm flex flex-col py-6 space-y-2 pt-20 z-30">
      <div className="px-6 mb-8">
        <h2 className="text-lg font-black text-primary uppercase">
          Ma-Dyang POS
        </h2>
        <p className="text-xs text-neutral-500 font-medium">
          The Culinary Curator
        </p>
      </div>

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
