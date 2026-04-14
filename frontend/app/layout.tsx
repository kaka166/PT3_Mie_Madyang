"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

const pjs = Plus_Jakarta_Sans({
  variable: "--font-pjs",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Daftar halaman yang boleh diakses TANPA login
  const publicPaths = ["/login", "/register", "/about", "/contact", "/", "/catalog"];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const isPublicPath = publicPaths.includes(pathname);

      if (!token && !isPublicPath) {
        // Gak ada token & bukan halaman publik -> Tendang ke login
        setAuthorized(false);
        router.push("/login");
      } else if (token && isPublicPath) {
        // Ada token tapi maksa ke login/register -> Lempar ke admin/cashier
        router.push("/admin"); // atau halaman utama setelah login
      } else {
        // Aman, silakan lewat
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <html lang="id" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${pjs.variable} font-sans antialiased min-h-screen flex flex-col`}>
        {/* Jika halaman publik, langsung tampilin. Jika halaman private, tunggu authorized */}
        {publicPaths.includes(pathname) || authorized ? (
          children
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </body>
    </html>
  );
}