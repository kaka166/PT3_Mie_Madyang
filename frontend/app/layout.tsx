import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Ganti ke Plus Jakarta Sans
import "./globals.css";

const pjs = Plus_Jakarta_Sans({
  variable: "--font-pjs",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mie Ayam Ma-Dyang - The Culinary Curator",
  description: "Sistem Manajemen POS Terintegrasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <head>
        {/* Tambahkan link Material Symbols agar icon-nya muncul */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${pjs.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
