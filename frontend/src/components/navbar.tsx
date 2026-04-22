"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import Lucide Icons

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Helper untuk menentukan apakah link sedang aktif
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-[#f9f9f9] dark:bg-neutral-900 sticky top-0 z-50 border-b border-gray-100 dark:border-neutral-800">
      <nav className="flex justify-between items-center px-6 md:px-8 py-4 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[#a0383b] dark:text-[#c05051] font-headline z-50"
        >
          Mie Ayam Ma-Dyang
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`${
                isActive(link.href)
                  ? "text-[#a0383b] font-bold border-b-2 border-[#a0383b] pb-1"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-[#a0383b]"
              } transition-colors`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <button className="text-neutral-600 dark:text-neutral-400 font-sans text-sm font-medium px-4 py-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-lg transition-all active:scale-95">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition-all shadow-md text-sm active:scale-95">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Burger Button */}
        <button
          className="md:hidden text-neutral-600 dark:text-neutral-400 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-white dark:bg-neutral-900 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center gap-6 text-xl font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(link.href) ? "text-[#a0383b] font-bold" : "text-neutral-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col w-full px-12 gap-4 mt-4">
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <button className="w-full py-4 border-2 border-stone-200 dark:border-neutral-700 rounded-xl font-bold text-neutral-600">
                Login
              </button>
            </Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
              <button className="w-full py-4 bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white rounded-xl font-bold shadow-lg">
                Register
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}