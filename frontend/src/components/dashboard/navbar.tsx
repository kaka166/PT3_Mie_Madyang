"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Bell,
  Settings,
  X,
  User as UserIcon,
  Mail,
  Shield,
  Save,
} from "lucide-react";

// Definisi Interface agar tidak menggunakan 'any'
interface UserData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: number | string; // Bisa number dari DB atau string jika sudah terformat
}

const BANNER_SRC = "/assets/Logo_Mie_Ma-Dyang_RemovedBG.png";

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper untuk mendapatkan Nama Role
  const getRoleName = (roleId: number | string | undefined): string => {
    const id = Number(roleId);
    const roles: Record<number, string> = {
      1: "Owner",
      2: "Kasir",
      3: "Dapur",
    };
    return roles[id] || "Staff";
  };

  // State User dengan Type UserData
  const [user] = useState<UserData | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      try {
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.error("Failed to parse user data", error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isModalOpen]);

  return (
    <>
      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 border-b border-neutral-100">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>

          <div className="relative lg:w-[120px] w-[90px] h-[40px]">
            <Image
              src={BANNER_SRC}
              alt="Logo Ma-Dyang"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-sm font-bold text-neutral-800 capitalize">
              {user?.name || "Guest"}
            </p>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">
              {getRoleName(user?.role)}
            </p>
          </div>

          <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full relative transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full active:scale-90 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* MODAL EDIT PROFILE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* MODAL BOX */}
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            
            {/* HEADER */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <h2 className="text-2xl font-black text-neutral-800">
                Profile Settings
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={24} className="text-neutral-400" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-8 pt-2 space-y-6">
              
              {/* AVATAR SECTION */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-neutral-50 flex items-center justify-center border-4 border-white shadow-md">
                    <UserIcon size={40} className="text-neutral-200" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                </div>
                <p className="text-xs font-bold text-neutral-400">ID Member: #{user?.id || '0'}</p>
              </div>

              {/* FORM FIELDS */}
              <div className="space-y-4">
                {/* NAME */}
                <div className="group">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1 block">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-800 transition-colors" />
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-100 bg-neutral-50 focus:bg-white focus:ring-4 focus:ring-neutral-100 focus:border-neutral-300 outline-none text-sm font-bold transition-all"
                      placeholder="Masukkan nama..."
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1 block">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-100 bg-neutral-100/50 text-neutral-400 text-sm cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* ROLE */}
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1 mb-1 block">
                    Hak Akses / Role
                  </label>
                  <div className="relative">
                    <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                    <div className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-neutral-100 bg-neutral-100/50 text-neutral-500 text-sm font-black uppercase tracking-wider">
                      {getRoleName(user?.role)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-8 pt-0 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-4 rounded-2xl font-black text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all text-sm uppercase"
              >
                Tutup
              </button>

              <button className="flex-[2] bg-neutral-900 text-white px-4 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black active:scale-95 transition-all shadow-lg shadow-neutral-200 text-sm uppercase tracking-widest">
                <Save size={18} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}