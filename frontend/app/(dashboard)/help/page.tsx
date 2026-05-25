"use client";

import { useState } from "react";
import {
  BookOpen,
  MessageCircleQuestion,
  ChevronDown,
  MonitorPlay,
  ChefHat,
  Receipt,
  Settings,
  ArrowRight
} from "lucide-react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "faq">("guide");
  const [activeGuideStep, setActiveGuideStep] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const guideSteps = [
    {
      id: "mulai-sesi",
      icon: <MonitorPlay size={32} />,
      title: "1. Memulai Sesi Kasir",
      desc: "Sebelum menerima pesanan, kasir wajib memulai sesi dengan memasukkan uang modal awal di laci. Hal ini penting agar perhitungan selisih uang di akhir hari akurat.",
      tips: "Pastikan laci uang kasir Anda memiliki pecahan uang kecil untuk kembalian sebelum memulai sesi."
    },
    {
      id: "pesanan",
      icon: <Receipt size={32} />,
      title: "2. Membuat Pesanan",
      desc: "Pilih menu dari layar kasir, atur jumlahnya, dan tambahkan catatan jika pembeli ada permintaan khusus (misal: 'Tidak pakai daun bawang'). Setelah klik 'Checkout', Anda bisa mencetak struk langsung ke printer thermal.",
      tips: "Anda bisa langsung menggunakan HP untuk kasir! Cukup atur URL Print Server di menu Pengaturan Nota ke 'bluetooth'."
    },
    {
      id: "dapur",
      icon: <ChefHat size={32} />,
      title: "3. Memproses di Dapur (Kitchen)",
      desc: "Pesanan yang baru masuk akan muncul di kolom 'Next' layar dapur. Koki dapat menggeser/menekan tombol untuk memindahkannya ke 'Cooking' (Sedang Dimasak) dan 'Done' (Selesai).",
      tips: "Layar dapur memiliki filter 24 jam terakhir otomatis sehingga layar Anda tidak akan penuh dengan pesanan hari sebelumnya."
    },
    {
      id: "pengaturan",
      icon: <Settings size={32} />,
      title: "4. Pengaturan Sistem",
      desc: "Admin dapat mengubah tampilan Landing Page (Katalog), daftar Menu Andalan, mengatur persentase Pajak PPN, dan mengubah teks Header/Footer Nota Kasir kapan saja melalui menu Pengaturan.",
      tips: "Jika Anda ingin menambah kategori baru, gunakan tombol 'Kategori' di pojok kanan atas layar Inventory Menu."
    }
  ];

  const faqs = [
    {
      q: "Bagaimana cara mencetak struk menggunakan HP/Tablet?",
      a: "Buka menu Settings -> Pengaturan Nota. Pada bagian 'URL Print Server', ketikkan 'bluetooth' jika Anda menggunakan HP Android dengan Chrome, lalu simpan. Saat Anda checkout, akan muncul pop-up izin Bluetooth untuk menyambungkan HP ke Printer Thermal Anda. Jika Anda pakai iOS, sistem otomatis memunculkan struk di layar untuk dicetak manual lewat AirPrint."
    },
    {
      q: "Mengapa gambar menu tidak muncul di katalog depan?",
      a: "Kemungkinan file gambar terhapus dari server. Tapi jangan khawatir, sistem telah dilengkapi fitur 'Fallback', sehingga jika gambar rusak/hilang, akan digantikan dengan gambar kotak bertuliskan 'Ma-Dyang' secara otomatis agar tampilan web tetap rapi."
    },
    {
      q: "Bagaimana cara mengubah 3 menu yang tampil di Landing Page?",
      a: "Masuk ke menu Settings -> Landing Page. Scroll ke bawah pada bagian 'Menu Andalan (Katalog)'. Anda akan menemukan 3 dropdown (Menu Utama, Topping, Minuman). Pilih menu yang ingin Anda tampilkan dan klik Simpan."
    },
    {
      q: "Uang akhir di laci kasir saya ada selisih, apa yang terjadi?",
      a: "Selisih bisa terjadi jika kasir salah memberikan kembalian atau ada transaksi pengeluaran (misal: beli es batu) yang tidak dicatat. Pastikan mencatat semua pengeluaran darurat lewat menu 'Pengeluaran' sebelum mengakhiri sesi kasir."
    },
    {
      q: "Printer tidak merespons padahal sudah terhubung kabel USB?",
      a: "Pastikan script 'print_server.py' (berlogo hitam) sedang berjalan di komputer Anda. Jika jendela hitam itu tertutup, website tidak bisa berkomunikasi dengan printer kabel Anda."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#F53E1B] tracking-tight mb-2">Pusat Bantuan</h1>
          <p className="text-zinc-500">Panduan lengkap dan solusi cepat untuk masalah Anda.</p>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-zinc-200 pb-px">
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "guide" ? "border-emerald-600 text-emerald-700" : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <BookOpen size={18} /> Buku Panduan (Interaktif)
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "faq" ? "border-emerald-600 text-emerald-700" : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <MessageCircleQuestion size={18} /> Tanya Jawab (FAQ)
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden min-h-[500px]">
          {activeTab === "guide" ? (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Panel - Steps */}
              <div className="w-full md:w-1/3 bg-zinc-50 p-6 border-r border-zinc-100">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Langkah Penggunaan</h3>
                <div className="space-y-3">
                  {guideSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveGuideStep(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group ${
                        activeGuideStep === index
                          ? "bg-white shadow-md shadow-zinc-200/50 border border-zinc-200/50"
                          : "hover:bg-zinc-100/80 border border-transparent"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        activeGuideStep === index ? "bg-red-50 text-red-600" : "bg-zinc-200 text-zinc-400 group-hover:bg-zinc-300"
                      }`}>
                        <span className="font-black text-sm">{index + 1}</span>
                      </div>
                      <span className={`text-sm font-bold transition-colors ${
                        activeGuideStep === index ? "text-neutral-800" : "text-zinc-500"
                      }`}>
                        {step.title.substring(3)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Panel - Content */}
              <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                
                <div className="relative z-10 animate-in fade-in slide-in-from-right-8 duration-500" key={activeGuideStep}>
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                    {guideSteps[activeGuideStep].icon}
                  </div>
                  <h2 className="text-3xl font-black text-neutral-800 mb-4 leading-tight">
                    {guideSteps[activeGuideStep].title}
                  </h2>
                  <p className="text-zinc-600 leading-relaxed mb-8 text-lg">
                    {guideSteps[activeGuideStep].desc}
                  </p>

                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 flex gap-4">
                    <div className="text-amber-500 font-black text-2xl leading-none">!</div>
                    <div>
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Tips Pro</h4>
                      <p className="text-sm text-amber-700 leading-relaxed">{guideSteps[activeGuideStep].tips}</p>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-zinc-100 pt-8">
                    <button
                      onClick={() => setActiveGuideStep((prev) => (prev < guideSteps.length - 1 ? prev + 1 : 0))}
                      className="flex items-center gap-3 bg-neutral-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-black active:scale-95 transition-all shadow-xl shadow-zinc-200"
                    >
                      {activeGuideStep < guideSteps.length - 1 ? "Langkah Selanjutnya" : "Kembali ke Awal"} 
                      <ArrowRight size={16} className={activeGuideStep < guideSteps.length - 1 ? "animate-pulse" : ""} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-black text-neutral-800 mb-8 text-center">Pertanyaan Seputar Ma-Dyang</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? "border-emerald-200 bg-emerald-50/30 shadow-md shadow-emerald-100/50" : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <span className={`font-bold pr-8 ${openFaqIndex === index ? "text-emerald-800" : "text-neutral-700"}`}>
                        {faq.q}
                      </span>
                      <ChevronDown 
                        className={`flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? "rotate-180 text-emerald-600" : "text-zinc-400"}`} 
                        size={20} 
                      />
                    </button>
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaqIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
                      }`}
                    >
                      <div className="w-full h-px bg-emerald-100 mb-4" />
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
