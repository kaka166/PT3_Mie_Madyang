"use client";

import { useEffect, useState } from "react";
import Navbar from "../../src/components/navbar";
import Image from "next/image";
// Import service dan interface
import { menuService, Menu } from "@/services/menuService";

export default function MenuPage() {
  const [mie, setMie] = useState<Menu[]>([]);
  const [topping, setTopping] = useState<Menu[]>([]);
  const [minuman, setMinuman] = useState<Menu[]>([]);

  // Base URL untuk gambar agar rapi
  const IMAGE_BASE_URL = "http://localhost:8000/storage/menu/";

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const res = await menuService.getAll();
        const data = res.data;

        // Filter kategori berdasarkan data dari backend
        // Hanya menampilkan menu yang is_active = 1
        const activeData = data.filter((item: Menu) => item.is_active === 1);

        setMie(activeData.filter((item: Menu) => item.kategori?.nama_kategori === "Mie"));
        setTopping(activeData.filter((item: Menu) => item.kategori?.nama_kategori === "Topping"));
        setMinuman(activeData.filter((item: Menu) => item.kategori?.nama_kategori === "Minuman"));
      } catch (error) {
        console.error("Gagal memuat menu:", error);
      }
    };

    loadMenu();
  }, []);

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Hero Header Section */}
        <header className="mb-16 relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] flex items-end shadow-2xl">
          <Image
            alt="Gourmet Mie Ayam"
            src="/img/mie-ayam.jpg"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="relative z-10 p-8 md:p-12 max-w-2xl">
            <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 block opacity-90">
              Signature Bowls
            </span>
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-white mb-4 leading-tight">
              Authentic Flavors, <br />
              Curated for You
            </h1>
            <p className="text-white/80 text-sm md:text-lg leading-relaxed max-w-md">
              Nikmati harmoni sempurna dari mi kenyal, ayam gurih, dan bumbu
              rahasia warisan generasi.
            </p>
          </div>
        </header>

        {/* Category: Mie */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#1a1c1c]">
              The Mie Selection
            </h2>
            <span className="text-primary font-semibold text-[10px] md:text-sm tracking-widest uppercase">
              Signature Base
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Feature Card */}
            {mie[0] && (
              <div className="md:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                    <Image
                      alt={mie[0].nama_menu}
                      src={`${IMAGE_BASE_URL}${mie[0].gambar}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl md:text-2xl font-bold font-headline text-[#1a1c1c]">
                        {mie[0].nama_menu}
                      </h3>
                      <span className="text-primary font-bold text-xl">
                        Rp {mie[0].harga_jual}
                      </span>
                    </div>
                    <p className="text-[#564241] text-sm md:text-base mb-8 leading-relaxed">
                      Menu mie ayam spesial Ma-Dyang.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Mie */}
            <div className="md:col-span-4 flex flex-col gap-8">
              {mie.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold font-headline text-[#1a1c1c]">
                      {item.nama_menu}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      Rp {item.harga_jual}
                    </span>
                  </div>
                  <p className="text-[#564241] text-sm leading-relaxed mb-6">
                    Menu mie ayam spesial Ma-Dyang.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category: Toppings */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#1a1c1c]">
              Curated Toppings
            </h2>
            <span className="text-primary font-semibold text-[10px] md:text-sm tracking-widest uppercase">
              Elevate Your Bowl
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topping.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative shadow-sm border border-gray-50">
                  <Image
                    alt={item.nama_menu}
                    src={`${IMAGE_BASE_URL}${item.gambar}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-md text-primary">
                    +Rp {item.harga_jual}
                  </div>
                </div>
                <h4 className="font-bold text-center text-sm text-[#1a1c1c]">
                  {item.nama_menu}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Category: Drinks */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#1a1c1c]">
              Refreshing Sips
            </h2>
            <span className="text-primary font-semibold text-[10px] md:text-sm tracking-widest uppercase">
              Chill Your Palate
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {minuman.map((item) => (
              <div
                key={item.id}
                className="bg-[#f3f3f3] p-5 rounded-2xl flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm relative">
                  <Image
                    src={`${IMAGE_BASE_URL}${item.gambar}`}
                    alt={item.nama_menu}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-[#1a1c1c]">
                    {item.nama_menu}
                  </h4>
                  <p className="text-[10px] text-[#564241]">
                    Pilihan minuman segar Ma-Dyang.
                  </p>
                </div>
                <span className="font-bold text-primary text-sm">
                  Rp {item.harga_jual}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#ffdad8] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden border border-primary/10">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4 text-[#410006]">
              Ready to satisfy your cravings?
            </h2>
            <p className="text-[#842327] mb-10 max-w-lg mx-auto text-sm md:text-base">
              Datang langsung ke cabang terdekat dan rasakan kelezatan autentik Mie Ayam Ma-Dyang yang disajikan fresh di tempat.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}