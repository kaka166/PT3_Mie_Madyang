"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper untuk menentukan apakah link sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-[#f9f9f9] dark:bg-neutral-900 sticky top-0 z-50 border-b border-gray-100 dark:border-neutral-800">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[#a0383b] dark:text-[#c05051] font-headline"
        >
          Mie Ayam Ma-Dyang
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
          <Link
            href="/"
            className={`${isActive("/") ? "text-[#a0383b] font-bold border-b-2 border-[#a0383b] pb-1" : "text-neutral-600 dark:text-neutral-400 hover:text-[#a0383b]"} transition-colors`}
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="text-neutral-600 dark:text-neutral-400 hover:text-[#a0383b] dark:hover:text-[#c05051] transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/about"
            className="text-neutral-600 dark:text-neutral-400 hover:text-[#a0383b] dark:hover:text-[#c05051] transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className={`${isActive("/contact") ? "text-[#a0383b] font-bold border-b-2 border-[#a0383b] pb-1" : "text-neutral-600 dark:text-neutral-400 hover:text-[#a0383b]"} transition-colors`}
          >
            Contact
          </Link>
        </div>

        {/* Action Button */}

        <div className="flex items-center gap-3">
          {/* Tombol Login - Style Outlined/Ghost */}
          <Link href="/login">
            <button className="text-neutral-600 dark:text-neutral-400 font-sans text-sm font-medium px-4 py-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-lg transition-all active:scale-95 duration-150 ease-in-out">
              Login
            </button>
          </Link>

          {/* Tombol Register - Style Gradient Primary */}
          <Link href="/register">
            <button className="bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-all shadow-md text-sm active:scale-95 duration-150 ease-in-out">
              Register
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
