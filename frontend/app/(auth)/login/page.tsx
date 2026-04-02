"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// GANTI PATH/URL GAMBAR DI SINI LURRR
const BANNER_SRC = "/assets/Logo_Mie_Ma-Dyang_RemovedBG.png";

// GANTI TEKS ALT 
const BANNER_ALT = "Banner Mie Ayam Ma-Dyang";

// GANTI UKURAN TAMPILAN GAMBAR (px)
const BANNER_WIDTH = 600;
const BANNER_HEIGHT = 600;

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);

  // Simulasi login (ganti dengan logika autentikasi sebenarnya)
  const handleLogin = () => {
    alert("Login berhasil! Mengarahkan ke Dashboard...");
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative bg-gray-100 overflow-hidden">
      {/* Red chevron background */}
      <div
        className="absolute top-0 left-0 right-0 bg-[#c93535]"
        style={{
          height: "52%",
          clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4 pt-10 pb-12 flex flex-col items-center">
          {/* Banner & Welcome Text */}
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
              Login
            </h2>
          </div>
          <p className="text-center text-gray-400 text-xs mb-6">
            Please login to admin dashboard
          </p>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="Admin"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#c93535] focus:bg-white transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#c93535] focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 mb-5">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 accent-[#c93535] cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <Link href="/admin">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-[#c93535] hover:bg-[#a82828] active:scale-[0.98] text-white font-bold rounded-lg tracking-widest text-sm transition"
            >
              Login
            </button>
          </Link>

          {/* Divider & Register */}
          <hr className="my-5 border-gray-100" />
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#c93535] font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Footer */}
      </div>
    </main>
  );
} 