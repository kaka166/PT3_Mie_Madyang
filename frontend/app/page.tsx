"use client";

import Link from "next/link";
import Navbar from "../component/navbar";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Memanggil Navbar Komponen */}
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[870px] flex items-center bg-background">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ffdad8] text-[#842327] font-medium text-xs tracking-widest uppercase">
                Authentic Flavors since 1998
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-[#1a1c1c] leading-[1.1] tracking-tight">
                Cita Rasa{" "}
                <span className="text-primary italic font-black">
                  Legendaris
                </span>{" "}
                di Setiap Suapan.
              </h1>
              <p className="text-lg text-[#564241] max-w-lg leading-relaxed">
                Nikmati kelezatan mie ayam dengan resep warisan yang dikurasi
                secara profesional untuk memanjakan lidah Anda. Kualitas bahan
                premium, rasa tak terlupakan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 bg-gradient-to-b from-[#a0383b] to-[#c05051]">
                  Pesan Sekarang
                  <span className="material-symbols-outlined">
                    shopping_basket
                  </span>
                </button>
                <button className="px-8 py-4 border-2 border-[#ddc0be]/30 text-primary rounded-xl font-bold text-lg hover:bg-primary/5 transition-all">
                  Lihat Menu
                </button>
              </div>
              <div className="flex items-center gap-6 pt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-[#e8e8e8] flex items-center justify-center border-2 border-background"
                    >
                      <span className="material-symbols-outlined text-sm">
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#564241] font-medium">
                  <span className="text-[#1a1c1c] font-bold">12,000+</span>{" "}
                  Pelanggan Puas
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
              <div className="relative z-20 transform scale-110">
                <img
                  alt="Mascot Ma-Dyang"
                  className="w-full h-auto drop-shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFbe8lwjOheNtzzhrq-94x0FnX2aDlhGrS1nU3VnBvrcq0lUFPZStUoftz5N8W5lmJkDhNzu_eeeUv__yOb69bFh1SC3-3PafvXSnPCQxMaEebV_FtdLcCdSSXDreXa7VmUryo6UBgoRzju25gXe_ixUZiwB_7-AZ__aA61qb6Cut-jFHUAv6gjDcA9CGcC25Sh_LsnobkPcUshJq846E7B8-ZyWZNv5Gi1QRkdxeXldaRofD603bbWogbfOo-aqMtHJWixBguQyo"
                />
              </div>
              {/* <div className="absolute bottom-10 -left-10 bg-white/80 p-6 rounded-2xl shadow-2xl backdrop-blur-md max-w-[200px] z-30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-tertiary">
                    verified
                  </span>
                  <span className="font-bold text-[#1a1c1c]">Terjamin</span>
                </div>
                <p className="text-xs text-[#564241]">
                  Bahan pilihan 100% segar setiap harinya untuk kualitas
                  terbaik.
                </p>
              </div> */}
            </div>
          </div>
          {/* Decorative Pattern */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#a0383b 0.5px, transparent 0.5px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </section>

        {/* Menu Favorit Section */}
        <section className="py-24 bg-[#f3f3f3] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                  Menu Favorit Kita
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1a1c1c]">
                  Kurasi Rasa <br />
                  Terbaik Hari Ini
                </h2>
              </div>
              <p className="max-w-md text-[#564241] leading-relaxed">
                Pilihan menu paling dicari oleh para pencinta kuliner Ma-Dyang.
                Dibuat dengan cinta dan bumbu rahasia keluarga.
              </p>
            </div>
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLw6XYJvhjxex_ojIfHm-VLbwmL7wS-BFMzOGLB-htUThugPevO0pQ6mVbpokqfzITidlKItFFlcQVz-FiPvVDre0a-KILh9BA9XNHPmSADAkdTYQMI4vpLEAS7hTJu6JwI5kY9GX4s8wgV-OY1O-JehRdG03Og3Kv6bN2xv0HSnBsB0Fl7CdpXs9xTiqZBYWwh_BJFWhj49ZXGDcznwn0At5Iq2fOtHx_4Z8leCP6N2kU3PoeEsH3JVlddmYnfh1-X_tqEE7WhY"
                    alt="Mie Ayam Spesial"
                  />
                </div>
                <div className="p-8 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded uppercase">
                        Best Seller
                      </span>
                      <span className="text-tertiary font-bold text-xs">
                        5.0 (2.1k Reviews)
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a1c1c]">
                      Mie Ayam Spesial Ma-Dyang
                    </h3>
                    <p className="text-[#564241] text-sm mt-1">
                      Lengkap dengan bakso, pangsit, dan ceker.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-primary mb-2">
                      Rp 25k
                    </div>
                    <button className="p-4 bg-[#eeeeee] rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined">
                        add_shopping_cart
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col gap-6">
                {[
                  {
                    title: "Pangsit Goreng Kriuk",
                    price: "Rp 12k",
                    img: "2",
                    desc: "Pelengkap sempurna yang renyah dengan bumbu rempah pilihan.",
                  },
                  {
                    title: "Es Jeruk Segar Madu",
                    price: "Rp 15k",
                    img: "3",
                    desc: "Perasan jeruk asli dengan sentuhan madu hutan yang menyegarkan.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-white rounded-3xl p-6 shadow-sm group hover:shadow-xl transition-all overflow-hidden relative"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                                      src="https://placehold.co/100x100.png"
                                            alt={"Mie Ayam Ma-Dyang Logo"}
                                            width={100}
                                            height={100}
                                            className="object-cover"
                                    />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-[#1a1c1c] leading-tight">
                          {item.title}
                        </h4>
                        <div className="text-primary font-bold text-xl mt-1">
                          {item.price}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#564241] leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <button className="w-full py-3 bg-[#e9e0e0] text-[#696363] rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                      Tambahkan{" "}
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Cabang Nasional", val: "25+", color: "text-primary" },
              { label: "Bahan Alami", val: "100%", color: "text-tertiary" },
              { label: "Resep Rahasia", val: "15", color: "text-[#1a1c1c]" },
              {
                label: "Rating Google",
                val: "4.9",
                color: "text-primary-container",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <span className={`text-6xl font-bold ${stat.color} mb-2`}>
                  {stat.val}
                </span>
                <span className="text-xs uppercase tracking-widest font-bold text-[#564241]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 max-w-7xl mx-auto px-6 mb-20">
          <div className="bg-primary rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden shadow-2xl bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Jangan Lewatkan Promo Menarik Kami!
              </h2>
              <p className="text-white/80 mb-10 text-lg">
                Dapatkan info menu baru dan diskon eksklusif setiap minggunya
                langsung di inbox Anda.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
                <div className="relative flex-1 group">
                  <input
                    type="email"
                    placeholder="Alamat Email Anda"
                    className="w-full px-5 py-4 rounded-xl bg-white/90 text-gray-800 placeholder:text-gray-400 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-b from-[#b8870b] to-[#e0a800] text-white font-semibold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                >
                  Berlangganan
                </button>
              </form>
            </div>
            <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 dark:bg-stone-950 w-full py-12 border-t border-stone-200/20">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-6">
          <div className="text-lg font-black text-stone-900 dark:text-stone-100">
            Mie Ayam Ma-Dyang
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              href="#"
              className="text-stone-500 hover:underline decoration-orange-500 underline-offset-4 font-sans text-xs uppercase tracking-widest font-semibold"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-stone-500 hover:underline decoration-orange-500 underline-offset-4 font-sans text-xs uppercase tracking-widest font-semibold"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-stone-500 hover:underline decoration-orange-500 underline-offset-4 font-sans text-xs uppercase tracking-widest font-semibold"
            >
              Support
            </Link>
            <Link
              href="#"
              className="text-stone-500 hover:underline decoration-orange-500 underline-offset-4 font-sans text-xs uppercase tracking-widest font-semibold"
            >
              Instagram
            </Link>
          </div>
          <div className="text-stone-500 text-[10px] font-sans uppercase tracking-widest font-semibold">
            © 2026 Mie Ayam Ma-Dyang. The Culinary Curator System.
          </div>
        </div>
      </footer>
    </div>
  );
}
