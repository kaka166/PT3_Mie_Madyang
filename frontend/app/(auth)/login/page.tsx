"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login berhasil! Mengarahkan ke Dashboard...");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gray-50">
      {/* Background Blur */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-md">
            <Image
              src="https://placehold.co/100x100.png"
              alt={"Mie Ayam Ma-Dyang Logo"}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold text-[#b23b3b]">
            Mie Ayam Ma-Dyang
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, Curator. Please login to manage your stall.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  person
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-red-500 focus:ring-red-400"
                />
                <span className="text-gray-600">Remember me</span>
              </label>

              <Link
                href="#"
                className="text-red-500 font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button */}
            <Link href="/admin">
              <button className="w-full py-3 bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white rounded-lg font-semibold shadow-md hover:brightness-105 active:scale-95 transition">
                Login
              </button>
            </Link>
          </form>

          {/* Register */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Dont have an account?{" "}
              <Link
                href="/register"
                className="text-red-500 font-bold hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400 space-x-4">
          <span>Help Center</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>
    </main>
  );
}
