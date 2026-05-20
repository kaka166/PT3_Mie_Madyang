"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function LoginAbedPage() {
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login("abed", password);

      if (response.status === "success") {
        const role = response.data.user.role;
        if (role === 2) {
          router.push("/cashier?startSession=1");
        } else if (role === 3) {
          router.push("/kitchen");
        } else {
          router.push("/admin");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Password salah atau akun tidak ditemukan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative bg-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-[#c93535]"
        style={{ height: "52%", clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)" }}
      />

      <div className="relative z-10 w-full max-w-md px-4 pt-10 pb-12 flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/assets/Logo_Mie_Ma-Dyang_RemovedBG.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain drop-shadow-md"
            priority
          />
          <p className="text-white text-sm mt-4 font-light tracking-wide">Akses Khusus</p>
          <p className="text-white/70 text-xs mt-1">PAK ABED</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl w-full px-8 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "0.25em" }}>
            Masuk
          </h2>
          <p className="text-center text-gray-400 text-xs mb-6">Silakan masukkan password</p>

          {error && (
            <div className="mb-4 p-3 text-xs text-center bg-red-50 text-red-600 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Username</p>
              <p className="font-bold text-gray-700">abed</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-[#c93535] focus:bg-white transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#c93535] hover:bg-[#a82828]"} active:scale-[0.98] text-white font-bold rounded-lg tracking-widest text-sm transition shadow-lg mt-2`}
            >
              {loading ? "MASUK..." : "MASUK"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}