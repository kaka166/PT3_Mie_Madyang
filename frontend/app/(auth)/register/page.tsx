"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Badge,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  ArrowRight,
  Utensils,
  LucideIcon,
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering with:", formData);
    alert("Pendaftaran berhasil! Silakan login.");
  };

  return (
    <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-24 relative overflow-hidden bg-gray-50">

      {/* Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">

        {/* LEFT */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-b from-[#a0383b] to-[#c05051] p-12 flex-col justify-between items-center text-center">
          
          <div>
            <h1 className="text-white font-bold text-4xl mb-4">
              Selamat Datang!
            </h1>
            <p className="text-white/80 text-lg">
              Bergabunglah dengan komunitas pecinta Mie Ayam terbaik.
            </p>
          </div>

          {/* Icon Besar */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Utensils className="text-white w-20 h-20" />
            </div>
          </div>

          <p className="text-white/60 text-sm italic">
            Kelezatan autentik dalam setiap mangkuk.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-7/12 p-8 md:p-16">

          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Utensils className="text-red-500 w-6 h-6" />
              <span className="text-red-500 font-extrabold text-xl uppercase">
                Mie Ayam Ma-Dyang
              </span>
            </div>

            <h2 className="text-gray-800 text-2xl font-bold">
              Daftar Akun Baru
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Lengkapi data diri Anda untuk mulai mengelola kedai.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username + Nama */}
            <div className="grid md:grid-cols-2 gap-5">
              
              <InputField icon={User} placeholder="ma_dyang_user" label="Username" />
              <InputField icon={Badge} placeholder="Nama Sesuai KTP" label="Nama Lengkap" />

            </div>

            <InputField icon={Mail} placeholder="example@email.com" label="Email" type="email" />
            <InputField icon={Phone} placeholder="0812-xxxx-xxxx" label="Nomor Telepon" type="tel" />

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-5">
              
              <InputField icon={Lock} placeholder="••••••••" label="Password" type="password" />
              <InputField icon={ShieldCheck} placeholder="••••••••" label="Konfirmasi Password" type="password" />

            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" required className="mt-1 w-5 h-5 accent-red-500 cursor-pointer" />
              <p className="text-gray-500 text-xs">
                Saya setuju dengan{" "}
                <Link href="#" className="text-red-500 font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="#" className="text-red-500 font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>
              </p>
            </div>

            {/* Button */}
            <button className="w-full bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white py-4 rounded-xl font-bold text-lg shadow-md hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 group">
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-500 text-sm">
              Sudah punya akun?
              <Link href="/login" className="text-red-500 font-bold ml-1 hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

/* 🔥 Reusable Input Component */
type InputFieldProps = {
  icon: LucideIcon;
  label: string;
  placeholder: string;
  type?: string;
};

function InputField({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-gray-500 text-[10px] uppercase tracking-widest font-bold ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-red-500 transition" />
        <input
          type={type}
          placeholder={placeholder}
          required
          className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
        />
      </div>
    </div>
  );
}