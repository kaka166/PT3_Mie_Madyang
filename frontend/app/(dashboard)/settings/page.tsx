"use client";

import React from "react";
import Link from "next/link";
import { QrCode, ArrowRight } from "lucide-react";

const settingsItems = [
  {
    icon: QrCode,
    label: "QRIS Settings",
    description: "Upload dan kelola QRIS untuk pembayaran",
    href: "/settings/qris",
  },
];

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-8 font-sans pb-24">
      <div className="max-w-1xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#F53E1B]">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Pengaturan sistem</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
            >
              <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                <item.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-neutral-800">{item.label}</p>
                <p className="text-xs text-neutral-400">{item.description}</p>
              </div>
              <ArrowRight size={18} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
