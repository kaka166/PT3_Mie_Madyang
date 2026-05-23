import sys
try:
    from escpos.printer import Usb, Network, Serial, Dummy
except ImportError:
    print("Library python-escpos belum terinstall.")
    print("Silakan jalankan: pip install python-escpos")
    sys.exit(1)

def print_struk_contoh():
    print("Memulai tes print struk 58mm...")
    try:
        # ==========================================
        # 1. KONFIGURASI KONEKSI PRINTER
        # Buka komentar (hapus tanda #) pada salah satu metode koneksi yang Anda gunakan:
        # ==========================================

        # A. KONEKSI BLUETOOTH / SERIAL (COM Port di Windows)
        # Ganti "COM3" dengan port COM printer Bluetooth Anda (cek di Device Manager)
        # printer = Dummy() # Ganti ini dengan koneksi asli di bawah
        printer = Serial("COM11", 9600, timeout=1)

        # B. KONEKSI USB
        # Ganti idVendor dan idProduct sesuai printer Anda (cek di Device Manager -> Details -> Hardware Ids)
        # printer = Usb(0x04b8, 0x0202, 0, profile="POS-5890")

        # C. KONEKSI JARINGAN (LAN / WiFi)
        # Ganti dengan IP Address printer Anda
        # printer = Network("192.168.1.100")

        # ==========================================
        # 2. FORMAT STRUK (Untuk ukuran kertas 58mm = maksimal 32 karakter per baris)
        # ==========================================
        
        # Pengaturan awal: rata tengah
        printer.set(align='center', font='a', width=1, height=1)
        
        # Header Struk
        printer.text("MIE MADYANG\n")
        printer.text("Jl. Contoh Alamat No. 123\n")
        printer.text("Telp: 08123456789\n")
        printer.text("-" * 32 + "\n")
        
        # Info Transaksi: rata kiri
        printer.set(align='left')
        printer.text("No    : 20260523001\n")
        printer.text("Kasir : Relz (Owner)\n")
        printer.text("Waktu : 23 Mei 2026 18:00\n")
        printer.text("-" * 32 + "\n")
        
        # Daftar Item
        # Format: Nama Item (kiri)
        #         Qty x Harga (kiri)       Subtotal (kanan)
        printer.text("Mie Ayam Spesial\n")
        printer.text("  2 x 15.000              30.000\n")
        printer.text("Es Teh Manis\n")
        printer.text("  2 x 5.000               10.000\n")
        printer.text("-" * 32 + "\n")
        
        # Total Pembayaran
        printer.set(align='right')
        printer.text("Total   : 40.000\n")
        printer.text("Tunai   : 50.000\n")
        printer.text("Kembali : 10.000\n")
        
        # Footer
        printer.set(align='center')
        printer.text("-" * 32 + "\n")
        printer.text("Terima Kasih\n")
        printer.text("Selamat Menikmati\n")
        
        # Feed kertas beberapa baris agar struk keluar dengan baik
        printer.text("\n\n\n\n")
        
        # Potong kertas otomatis (jika printer mendukung auto-cutter)
        # printer.cut()
        
        # Jika menggunakan Dummy (hanya untuk testing kode berjalan)
        if isinstance(printer, Dummy):
            print("\n[PERINGATAN] Anda masih menggunakan printer Dummy.")
            print("Silakan edit script ini dan sesuaikan dengan koneksi printer Anda (Serial/USB/Network).")
            print("Berikut adalah raw output ESC/POS yang digenerate:")
            print(printer.output)
        else:
            print("Struk berhasil dicetak ke printer!")

    except Exception as e:
        print(f"\n[ERROR] Gagal mencetak: {e}")
        print("Pastikan printer menyala, terhubung, dan pengaturan koneksi (COM port / USB ID / IP) sudah benar.")

if __name__ == "__main__":
    print_struk_contoh()
