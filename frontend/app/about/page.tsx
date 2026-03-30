"use client";

import Link from "next/link";
import Navbar from "../../src/components/navbar";

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full">
        {/* Hero Section: The Culinary Curator */}
        <section className="relative min-h-[700px] md:h-[819px] flex items-center overflow-hidden bg-[#f3f3f3]">
          <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 py-20 md:py-0">
            <div className="space-y-6">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                The Culinary Curator
              </span>
              <h1 className="text-5xl md:text-7xl font-bold font-headline text-[#1a1c1c] leading-[1.1] tracking-tight">
                Crafting <span className="text-primary">Soul</span> in Every
                Bowl.
              </h1>
              <p className="text-lg text-[#564241] max-w-md leading-relaxed">
                Beyond a meal, we curate an experience. From the snap of our
                noodles to the depth of our secret broth, every element is an
                editorial choice in taste.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transform md:rotate-2 bg-stone-200">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNfO3mrFpiZu4tA3fbwi2uAQKMnSDVjWfw-Sp1lujLBqE533Nw4shRF4rjzgnzc8HGTb_PO7oxg0XfVSX3A-pTCM3suoG4rF2ee3ZWlUhJ6H-xSKOhrvbjJ1IzpRy0m341mWcOtBhnzUE-QRNu6Un9k68-dssSASiW91WoLQLlXwoLNXmr1GEoZJ6mb3yj06Scqy2q6kWM5ccqEotL57lOSJ9rhoXjmdDBYacRHkWZIkUOwaGvCPgOpQ9J-fNFdspJjmedr_IFAC0"
                  alt="Artisan Noodles"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block border border-gray-100">
                <p className="italic text-[#564241] text-sm">
                  The secret isnt just in the spices, but in the patience of
                  the curation.
                </p>
                <p className="mt-4 font-bold text-primary">
                  — Founder Ma-Dyang
                </p>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#ffdad8] opacity-20 -skew-x-12 translate-x-1/2"></div>
        </section>

        {/* The Heritage Story */}
        <section className="py-24 bg-white px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl aspect-square bg-stone-100 overflow-hidden shadow-sm">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaDejodb66Txf2JMrnuF-IWWB8EJfE-9_4Ah4L6G2XJlcAqh5-4UXpjs5Fc99xMcxM0FnnMfGDhXOBdU2hMHRUUnaodTQgsbK92yAhza1JzTYxyUKJ3w13oW1JVbtsyTw-fyJx-fIFhYFRQmfUyUlcZOvzIkddveLiAQDIk_3liHPtFs85468ZMclE6kX7GV4AauLV7zHF5MAV1_d2G5nTAEwM6F2le1It5ttdiJMwKczZv25Rsc7-1Tinrv065w9cKsLiQ0n-hRU"
                      alt="Spices"
                    />
                  </div>
                  <div className="rounded-xl aspect-square bg-stone-100 overflow-hidden shadow-sm mt-8">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT6X1wKAVag2CxAaexp6FF9GCX8OexjhJNXEccCS2jG4kBpu5J-gkVeepOMSjPdbx5JoAv0YkAkAoKam9j8W7YUvVu5kGmAQ5ziRtreDbgddFfjfyLM6Ly3eh0iTRjn-yE92irQiVRArQVu1q01qRId-64vcMX-Odmx3AJ4rnFAyz8BUbQ3dQKykyjVmV5NvQqtZXX4gNA-e8h8Xtr-HUDhuLpxB4EPE3pJNvL9yC0dG2FUS1RTls1BGTMn0Fd0q-Gp_1-RDcDey0"
                      alt="Fresh Noodles"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2 space-y-8 text-center md:text-left">
                <h2 className="text-4xl font-bold font-headline text-[#1a1c1c] leading-tight">
                  A Legacy of <br />
                  Uncompromising Quality
                </h2>
                <div className="w-16 h-1 bg-primary mx-auto md:mx-0"></div>
                <div className="space-y-4 text-[#564241] leading-loose">
                  <p>
                    Starting from a humble roadside stall in 1988, Mie Ayam
                    Ma-Dyang was never just about hunger. It was about the
                    science of the perfect noodle—the precise hydration of the
                    dough and the temperature of the wok.
                  </p>
                  <p>
                    Our founder, known by locals as the Flavour Architect,
                    spent decades refining the soy-braised chicken recipe. We
                    honor this heritage by using the same copper pots and
                    hand-grinding our secret spice blend daily.
                  </p>
                </div>
                <div className="flex gap-4 items-center pt-4 justify-center md:justify-start">
                  <div className="p-3 bg-[#006a46]/10 rounded-full text-[#006a46]">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#1a1c1c]">
                      100% Organic Ingredients
                    </p>
                    <p className="text-sm text-[#564241]">
                      Sourced directly from local farmers weekly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: The Curator's Manifesto */}
        <section className="py-24 bg-[#f3f3f3] px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold font-headline text-[#1a1c1c]">
                The Curators Manifesto
              </h2>
              <p className="text-[#564241]">
                How we define the modern Mie Ayam experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:min-h-[600px]">
              {/* Large Feature */}
              <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-10 flex flex-col justify-between shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Heritage
                  </span>
                  <h3 className="text-3xl font-bold font-headline text-[#1a1c1c]">
                    The Ma-Dyang Mascot
                  </h3>
                  <p className="text-[#564241] max-w-sm">
                    Our golden rooster mascot isnt just a logo; its a symbol
                    of prosperity and the dawn of a new standard in traditional
                    cuisine.
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-64 h-64 relative overflow-hidden flex items-center justify-center opacity-40">
                    <img
                      className="w-full h-full object-contain grayscale"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBREN32n5nMI_3TXAQiv7K-85_1PlFATK3N8WN6ReneAcFOq_G_Uo41a2byhgTW-5-WrH4uoNW4Kx-BaC-CdT9ivneKmRzs2uZ1ekrku9Hu3l3MV_B_WfH_k0Jmox6i1nKpwgk5n2S-gnZ3sqXRSXsWKdvETO8L71iAMmQOSIcPPcIk2v6_eEV8VWhqtJq3HPINCakSY_3y0rM9LGCwQ4CB7bfO4qXRr2c9SfwRU6nPqBLwF1VFj-lTzOtz98Fn2ddTiXm_FeMyiAE"
                      alt="Rooster Mascot"
                    />
                  </div>
                </div>
              </div>
              {/* Small Feature 1 */}
              <div className="bg-primary text-white rounded-3xl p-8 flex flex-col justify-center gap-4 shadow-lg shadow-primary/20">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  restaurant_menu
                </span>
                <h4 className="text-xl font-bold">Chef-Led Innovation</h4>
                <p className="text-white/80 text-sm">
                  We iterate our menu seasonally, introducing modern toppings
                  while keeping the soul of the dish intact.
                </p>
              </div>
              {/* Small Feature 2 */}
              <div className="bg-white rounded-3xl p-8 flex flex-col justify-center gap-4 border border-gray-100 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-[#006a46]">
                  eco
                </span>
                <h4 className="text-xl font-bold text-[#1a1c1c]">
                  Sustainability First
                </h4>
                <p className="text-[#564241] text-sm">
                  From zero-plastic packaging to solar-powered kitchens, our
                  curation extends to the planet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Section */}
        <section className="py-24 relative overflow-hidden px-8">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-5/12 space-y-6">
                <h2 className="text-5xl font-bold font-headline leading-tight text-[#1a1c1c]">
                  The Art of the Selection
                </h2>
                <p className="text-[#564241] leading-relaxed">
                  As a Culinary Curator, we dont just sell food. We select
                  the finest wheat, choose the age of the ginger, and even the
                  thickness of the ceramic bowl.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    {
                      id: "01",
                      title: "Precision Temperature",
                      desc: "Broth served at exactly 85°C.",
                    },
                    {
                      id: "02",
                      title: "Texture Ratios",
                      desc: "The 70:30 noodle-to-protein balance.",
                    },
                    {
                      id: "03",
                      title: "Sensory Harmony",
                      desc: "Aromatic oils curated for impact.",
                    },
                  ].map((list, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="bg-primary rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-1">
                        {list.id}
                      </span>
                      <div>
                        <p className="font-bold text-[#1a1c1c]">{list.title}</p>
                        <p className="text-xs text-[#564241]">{list.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-7/12">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1Q_iVyD39t_FjgwU6k-SbP2kr1teVgNErEA5M4i4Tb_hOGkj73qV0A6cGGP1DTAPh8N0Di3SV5xSSm5KFuy1BwQozeq3lEWmZTEeFBVnjJqET22eOypx1QXls49gfBZnsskS8j0cwNYWpZlx-PNCKh0A_BX-Wv9vDmxY1IDoXmmIQiWZWFaEi9DztAXzvPJU2yzvfZ-lRwYjPtjidJbb9z3RoioaL3uf9GotWe_h6gakeKOlLGUg2nPfV-FDgqVAE29rRro8vZ04"
                    alt="Kitchen Plating"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Aesthetic backdrop text */}
          <div className="absolute -bottom-10 left-0 text-[120px] md:text-[180px] font-bold text-[#e8e8e8] opacity-40 select-none whitespace-nowrap -z-0">
            CURATION CURATION CURATION
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#e2e2e2] rounded-[2.5rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden border border-gray-200">
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-headline max-w-2xl mx-auto text-[#1a1c1c]">
                  Experience the Tradition, Reimagined.
                </h2>
                <p className="text-[#564241] text-lg">
                  Join us at any of our curated locations and taste the
                  difference of precision.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                  <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                    Find a Location
                  </button>
                  <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold border border-gray-300 hover:bg-stone-50 transition-all">
                    View Our Story
                  </button>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[3] pointer-events-none">
                <span className="material-symbols-outlined text-[300px]">
                  restaurant
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#f3f3f3] border-t border-gray-200 mt-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-6">
          <div className="text-sm font-bold text-gray-800">
            Mie Ayam Ma-Dyang
          </div>
          <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Careers
            </Link>
          </div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Mie Ayam Ma-Dyang. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
