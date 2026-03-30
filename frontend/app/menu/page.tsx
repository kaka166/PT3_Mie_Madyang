"use client";

import Link from "next/link";
import Navbar from "../../component/navbar";
import Image from "next/image";

export default function MenuPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Hero Header Section */}
        <header className="mb-16 relative rounded-3xl overflow-hidden h-[300px] md:h-[400px] flex items-end shadow-2xl">
          <Image
            alt="Gourmet Mie Ayam"
            src="https://placehold.co/1200x600.png"
            fill
            className="object-cover"
          />
          {/* Hero Gradient Overlay */}
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

        {/* Category: Mie (Main Dishes) */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-[#1a1c1c]">
              The Mie Selection
            </h2>
            <span className="text-primary font-semibold text-[10px] md:text-sm tracking-widest uppercase">
              Signature Base
            </span>
          </div>

          {/* Bento Grid Layout for Mains */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Feature Card */}
            <div className="md:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                  <Image
                    alt="Mie Ayam Komplet"
                    src="https://placehold.co/600x400.png"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl md:text-2xl font-bold font-headline text-[#1a1c1c]">
                      Mie Ayam Komplet
                    </h3>
                    <span className="text-primary font-bold text-xl">
                      Rp 35k
                    </span>
                  </div>
                  <p className="text-[#564241] text-sm md:text-base mb-8 leading-relaxed">
                    Pengalaman Ma-Dyang paling lengkap. Mi tipis khas kami
                    dengan topping ayam kecap, jamur shiitake, sawi hijau, dan
                    pangsit goreng renyah.
                  </p>
                  <div className="flex items-center gap-2 text-[#006a46] font-medium">
                    <span className="material-symbols-outlined text-sm">
                      verified
                    </span>
                    <span className="text-[10px] uppercase tracking-wider">
                      Chefs Recommended
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Main Cards */}
            <div className="md:col-span-4 flex flex-col gap-8">
              {[
                {
                  title: "Mie Ayam Rica-Rica",
                  price: "28k",
                  desc: "Pedas khas Manado dengan bumbu rica yang meresap dan aroma daun jeruk yang segar.",
                  tag: "Extra Spicy",
                },
                {
                  title: "Mie Polos Ma-Dyang",
                  price: "18k",
                  desc: "Kemurnian rasa mi telur buatan tangan dengan minyak bawang putih aromatik.",
                  tag: null,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold font-headline text-[#1a1c1c]">
                      {item.title}
                    </h3>
                    <span className="text-primary font-bold text-lg">
                      Rp {item.price}
                    </span>
                  </div>
                  <p className="text-[#564241] text-sm leading-relaxed mb-6">
                    {item.desc}
                  </p>
                  {item.tag && (
                    <div className="inline-flex items-center px-3 py-1 bg-primary/10 rounded-full w-fit">
                      <span
                        className="material-symbols-outlined text-primary text-sm mr-1"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_fire_department
                      </span>
                      <span className="text-[10px] font-bold text-primary uppercase">
                        {item.tag}
                      </span>
                    </div>
                  )}
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
            {[
              { name: "Bakso Sapi Premium", price: "8k", img: "14" },
              { name: "Pangsit Goreng", price: "5k", img: "15" },
              { name: "Ceker Empuk", price: "6k", img: "16" },
              { name: "Sayur Ekstra", price: "3k", img: "17" },
            ].map((topping, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative shadow-sm border border-gray-50">
                  <Image
                    alt={topping.name}
                    src="https://placehold.co/400x400.png"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded-lg text-xs font-bold shadow-md text-primary">
                    +Rp {topping.price}
                  </div>
                </div>
                <h4 className="font-bold text-center text-sm text-[#1a1c1c]">
                  {topping.name}
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
            {[
              {
                name: "Es Teh Manis",
                desc: "Classic jasmine iced tea.",
                price: "6k",
                img: "18",
              },
              {
                name: "Es Jeruk Peras",
                desc: "100% freshly squeezed local oranges.",
                price: "12k",
                img: "19",
              },
              {
                name: "Badak Sarsaparilla",
                desc: "Iconic North Sumatran soda.",
                price: "15k",
                img: "20",
              },
            ].map((drink, idx) => (
              <div
                key={idx}
                className="bg-[#f3f3f3] p-5 rounded-2xl flex items-center gap-6 group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src="https://placehold.co/100x100.png"
                    alt={drink.name}
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-[#1a1c1c]">
                    {drink.name}
                  </h4>
                  <p className="text-[10px] text-[#564241]">{drink.desc}</p>
                </div>
                <span className="font-bold text-primary text-sm">
                  Rp {drink.price}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <div className="bg-[#ffdad8] rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden border border-primary/10">
          <div className="relative z-10">
            <span className="material-symbols-outlined text-primary text-5xl mb-6">
              restaurant
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4 text-[#410006]">
              Ready to satisfy your cravings?
            </h2>
            <p className="text-[#842327] mb-10 max-w-lg mx-auto text-sm md:text-base">
              Datang langsung ke cabang terdekat dan rasakan kelezatan autentik Mie Ayam Ma-Dyang yang disajikan fresh di tempat.
            </p>
            
          </div>
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -ml-16 -mb-16"></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f3f3] py-12 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="text-sm font-bold text-gray-800">
              Mie Ayam Ma-Dyang
            </div>
            <div className="text-[10px] text-gray-400 font-sans tracking-widest uppercase">
              © 2026 All Rights Reserved.
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Careers
            </Link>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">
              language
            </span>
            <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary transition-colors">
              share
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
