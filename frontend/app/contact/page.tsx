"use client";

import Navbar from "../../component/navbar"; 

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pesan Anda telah terkirim ke tim Ma-Dyang!");
  };

  return (
    <div className="bg-background font-body text-on-surface flex flex-col min-h-screen">
      {/* Panggil Navbar Komponen */}
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-8 py-12 pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-headline text-[#a0383b] tracking-tight mb-4">
            Let`s Start a Conversation
          </h1>
          <p className="text-lg text-[#635d5d] max-w-2xl leading-relaxed">
            Whether you have a question about our secret spice blend, want to
            book a large event, or just want to say hi—we `re all ears.
          </p>
        </section>

        {/* Bento Grid Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-white rounded-xl p-8 shadow-[0px_12px_32px_rgba(86,66,65,0.06)] border border-gray-100">
            <h2 className="text-2xl font-semibold mb-8 text-[#564241]">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7170]">
                    Name
                  </label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#ddc0be]/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a0383b] focus:border-[#a0383b] outline-none transition-all placeholder:text-neutral-400"
                    placeholder="Your Name"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7170]">
                    Email
                  </label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#ddc0be]/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a0383b] focus:border-[#a0383b] outline-none transition-all placeholder:text-neutral-400"
                    placeholder="your@email.com"
                    type="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7170]">
                  Subject
                </label>
                <select className="w-full bg-[#ffffff] border border-[#ddc0be]/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a0383b] focus:border-[#a0383b] outline-none transition-all cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Catering Request</option>
                  <option>Feedback & Suggestions</option>
                  <option>Business Partnership</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7170]">
                  Message
                </label>
                <textarea
                  className="w-full bg-[#ffffff] border border-[#ddc0be]/30 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#a0383b] focus:border-[#a0383b] outline-none transition-all placeholder:text-neutral-400"
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  required
                ></textarea>
              </div>
              <button className="w-full md:w-auto bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Info & Map Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#f3f3f3] rounded-xl p-8 space-y-6">
              {[
                {
                  icon: "location_on",
                  title: "Our Kitchen",
                  desc: "Jl. Rasa Lezat No. 42, Jakarta Selatan, Indonesia",
                },
                { icon: "call", title: "Call Us", desc: "+62 21 555 0123" },
                {
                  icon: "schedule",
                  title: "Serving Hours",
                  desc: "Mon - Sun: 10:00 AM - 10:00 PM",
                },
              ].map((info, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-[#a0383b]/10 p-3 rounded-lg text-[#a0383b]">
                    <span className="material-symbols-outlined">
                      {info.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1c1c]">{info.title}</h4>
                    <p className="text-sm text-[#635d5d]">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative h-64 rounded-xl overflow-hidden shadow-sm group border border-gray-100">
              <img
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu_gzL8tQxhuoAuQsxjQvoXXUnhcZEtA1C3xhDFKbDZvjRuOjhLDelbPJvEbM8ysM6LV8hDtg96ix0wSFxGjSDXfkL1uS5pdoSTuOq_7k9RYhcwBK4WjvPASbFzwD-d7Jd0cXWO7H9TV8G2vGjPPecE59IM2Zc84UIfxPNVBaou-dKnQ8J8K2kjwxKSyDHGQHIQx6VhRztpi897r8LyfLMYbOALtPN6Xk1CRgEU5HxXqF9UL5LwZroCwsNeO0ifBcx3JJKleyG-mA"
                alt="Map"
              />
              <div className="absolute inset-0 bg-[#a0383b]/10 pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-lg flex justify-between items-center border border-white">
                <span className="text-xs font-bold text-[#a0383b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    directions
                  </span>
                  Get Directions
                </span>
                <span className="text-[10px] text-[#635d5d]">
                  Open in Google Maps
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f3f3f3] py-8 border-t border-neutral-200/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-4">
          <div className="text-sm font-bold text-neutral-800">
            Mie Ayam Ma-Dyang
          </div>
          <div className="text-[10px] text-neutral-500 font-sans uppercase tracking-widest">
            © 2026 Mie Ayam Ma-Dyang. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Bottom Nav (Khusus Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 px-4 z-50 pb-7 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {/* Menu Bottom Nav Kamu di sini */}
      </div>
    </div>
  );
}
