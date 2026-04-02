"use client";

import Image from "next/image";
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
  LucideIcon,
} from "lucide-react";

// ============================================================
// ✏️ GANTI PATH/URL GAMBAR DI SINI
const BANNER_SRC = "/assets/Logo_Mie_Ma-Dyang_RemovedBG.png";

// ✏️ GANTI TEKS ALT
const BANNER_ALT = "Banner Mie Ayam Ma-Dyang";

// ✏️ GANTI UKURAN TAMPILAN GAMBAR (px)
const BANNER_WIDTH = 600;
const BANNER_HEIGHT = 600;
// ============================================================

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
    <main className="min-h-screen flex flex-col items-center relative bg-gray-100 overflow-hidden">
      {/* Red chevron background — sama seperti login */}
      <div
        className="absolute top-0 left-0 right-0 bg-[#c93535]"
        style={{
          height: "52%",
          clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-4 pt-10 pb-12 flex flex-col items-center">

        {/* ============================================================
            📌 AREA BANNER / LOGO — sama seperti login
        ============================================================ */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            src={BANNER_SRC}
            alt={BANNER_ALT}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            className="object-contain drop-shadow-md"
            priority
          />
          <p className="text-white text-sm mt-6 font-light tracking-wide">
            Selamat datang!
          </p>
        </div>
        {/* ========================================================== */}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full px-8 py-8">

          {/* Title */}
          <div className="text-center mb-1">
            <h2
              className="text-2xl font-bold tracking-[0.25em] text-gray-800"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Register
            </h2>
          </div>
          <p className="text-center text-gray-400 text-xs mb-6">
            Lengkapi data diri Anda untuk mulai mengelola kedai.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username + Nama */}
            <div>
              <InputField icon={User}  label="Username"     placeholder="e.x: Prellzy" />
            </div>
            <div>
              <InputField icon={Badge} label="Nama Lengkap" placeholder="Nama Sesuai KTP" />
            </div>

            <InputField icon={Mail}  label="Email"          placeholder="example@email.com" type="email" />
            <InputField icon={Phone} label="Nomor Telepon"  placeholder="0812-xxxx-xxxx"    type="tel" />

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField icon={Lock}        label="Password"           placeholder="••••••••" type="password" />
              <InputField icon={ShieldCheck} label="Konfirmasi Password" placeholder="••••••••" type="password" />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 accent-[#c93535] cursor-pointer"
              />
              <p className="text-gray-500 text-xs">
                Saya setuju dengan{" "}
                <Link href="#" className="text-[#c93535] font-semibold hover:underline">
                  Syarat & Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="#" className="text-[#c93535] font-semibold hover:underline">
                  Kebijakan Privasi
                </Link>
              </p>
            </div>

            {/* Submit Button — sama seperti login */}
            <button
              type="submit"
              className="w-full py-3 bg-[#c93535] hover:bg-[#a82828] active:scale-[0.98] text-white font-bold rounded-lg tracking-widest text-sm transition flex items-center justify-center gap-2 group"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

          </form>

          {/* Divider & Login */}
          <hr className="my-5 border-gray-100" />
          <p className="text-center text-sm text-gray-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#c93535] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>

        </div>

        {/* Footer */}
        <div className="flex gap-5 mt-6 text-xs text-gray-300">
          <span>Help Center</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
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
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#c93535] transition" />
        <input
          type={type}
          placeholder={placeholder}
          required
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#c93535] focus:bg-white transition"
        />
      </div>
    </div>
  );
}