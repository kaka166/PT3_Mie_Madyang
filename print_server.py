import sys
import json
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
try:
    from escpos.printer import Serial, Usb, Network
except ImportError:
    print("==================================================")
    print(" ERROR: Library python-escpos belum terinstall.")
    print(" Silakan jalankan: pip install python-escpos")
    print("==================================================")
    input("Tekan Enter untuk keluar...")
    sys.exit(1)

# Variabel global untuk menyimpan konfigurasi printer
PRINTER_CONFIG = {
    'type': None,
    'port': None,
    'vendor': None,
    'product': None,
    'ip': None
}

class PrintHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_POST(self):
        global PRINTER_CONFIG
        
        if self.path == '/print':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                order = json.loads(post_data.decode('utf-8'))
                print(f"\n[INFO] Menerima request cetak struk untuk No: {order.get('no', 'Unknown')}")
                
                self.print_receipt(order, PRINTER_CONFIG)
                
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Struk berhasil dicetak"}).encode('utf-8'))
                print("[SUCCESS] Struk berhasil dicetak!")
                
            except Exception as e:
                print(f"[ERROR] Gagal mencetak: {e}")
                self.send_response(500)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

    def print_receipt(self, order, config):
        # Membuka koneksi ke printer berdasarkan tipe
        if config['type'] == 'serial':
            printer = Serial(config['port'], 9600, timeout=1)
        elif config['type'] == 'usb':
            printer = Usb(int(config['vendor'], 16), int(config['product'], 16), 0)
        elif config['type'] == 'network':
            printer = Network(config['ip'])
        else:
            raise Exception("Tipe printer tidak dikenali.")
            
        printer.set(align='center', font='a', width=1, height=1)
        
        printer.text("MIE MA-DYANG\n")
        printer.text("The Culinary Curator\n")
        printer.text("Jl. Raya Madyang No. 16, Malang\n")
        printer.text("0812-3456-7890\n")
        printer.text("-" * 32 + "\n")
        
        printer.set(align='left')
        printer.text(f"No   : {order.get('no', '')}\n")
        printer.text(f"Tgl  : {order.get('waktu', '')}\n")
        printer.text(f"Kasir: {order.get('kasir', '')}\n")
        printer.text(f"Plgn : {order.get('nama', '')}\n")
        printer.text(f"Tipe : {order.get('kondisi', '')}\n")
        printer.text("-" * 32 + "\n")
        
        for item in order.get('items', []):
            printer.text(f"{item['nama']}\n")
            qty_harga = f"  {item['qty']} x {self.format_rp(item['harga'])}"
            subtotal = f"{self.format_rp(item['subtotal'])}"
            
            spaces = 32 - len(qty_harga) - len(subtotal)
            if spaces < 1: spaces = 1
            printer.text(qty_harga + (" " * spaces) + subtotal + "\n")
            
        printer.text("-" * 32 + "\n")
        
        printer.set(align='right')
        printer.text(f"TOTAL   : {self.format_rp(order.get('total', 0))}\n")
        printer.text(f"Bayar   : {self.format_rp(order.get('tunai', 0)) if order.get('tunai') else '-'}\n")
        printer.text(f"Kembali : {self.format_rp(order.get('kembalian', 0)) if order.get('kembalian') is not None else '-'}\n")
        
        printer.set(align='center')
        printer.text("-" * 32 + "\n")
        printer.text("Terima kasih!\n")
        printer.text("Selamat menikmati :)\n")
        
        printer.text("\n\n\n\n")

    def format_rp(self, number):
        try:
            return f"{int(number):,}".replace(',', '.')
        except (ValueError, TypeError):
            return str(number)

def run_server(port=5000):
    global PRINTER_CONFIG
    
    print("\n=======================================================")
    print("          MIE MA-DYANG - LOCAL PRINT SERVER            ")
    print("=======================================================")
    print("Pilih tipe koneksi printer yang Anda gunakan:")
    print("1. Bluetooth / Serial (Menggunakan COM Port)")
    print("2. USB Printer Kabel (Butuh idVendor & idProduct)")
    print("3. Network / LAN / WiFi (Menggunakan IP Address)")
    print("=======================================================")
    
    while True:
        pilihan = input("Masukkan angka pilihan (1/2/3): ").strip()
        
        if pilihan == '1':
            PRINTER_CONFIG['type'] = 'serial'
            print("\n>> TIPE: SERIAL / BLUETOOTH")
            print("Cara cek COM Port: Buka Windows Device Manager -> Ports (COM & LPT)")
            while True:
                com_input = input("Masukkan Port Printer (contoh: COM11): ").strip()
                if com_input.upper().startswith("COM"):
                    PRINTER_CONFIG['port'] = com_input.upper()
                    break
                else:
                    print("Format tidak valid! Pastikan formatnya COM diikuti angka, misal COM11.")
            break
            
        elif pilihan == '2':
            PRINTER_CONFIG['type'] = 'usb'
            print("\n>> TIPE: USB KABEL")
            print("Cara cek Vendor & Product ID: Buka Windows Device Manager -> Universal Serial Bus controllers -> klik kanan Printer -> Details -> Hardware Ids")
            print("Format contoh: 0x04b8 atau 04b8")
            PRINTER_CONFIG['vendor'] = input("Masukkan idVendor (contoh: 0x04b8): ").strip()
            if not PRINTER_CONFIG['vendor'].startswith('0x'): PRINTER_CONFIG['vendor'] = '0x' + PRINTER_CONFIG['vendor']
            PRINTER_CONFIG['product'] = input("Masukkan idProduct (contoh: 0x0202): ").strip()
            if not PRINTER_CONFIG['product'].startswith('0x'): PRINTER_CONFIG['product'] = '0x' + PRINTER_CONFIG['product']
            break
            
        elif pilihan == '3':
            PRINTER_CONFIG['type'] = 'network'
            print("\n>> TIPE: NETWORK / WIFI / LAN")
            PRINTER_CONFIG['ip'] = input("Masukkan IP Address Printer (contoh: 192.168.1.100): ").strip()
            break
            
        else:
            print("Pilihan tidak valid! Silakan masukkan 1, 2, atau 3.")
            
    print("\n[INFO] Menyimpan konfigurasi... (Anda akan langsung menggunakannya untuk print)")
    
    print("\n=======================================================")
    print(f" Print Server BERJALAN di Port {port}")
    if PRINTER_CONFIG['type'] == 'serial':
        print(f" Target Printer: Serial / Bluetooth di {PRINTER_CONFIG['port']}")
    elif PRINTER_CONFIG['type'] == 'usb':
        print(f" Target Printer: USB (Vendor: {PRINTER_CONFIG['vendor']}, Product: {PRINTER_CONFIG['product']})")
    elif PRINTER_CONFIG['type'] == 'network':
        print(f" Target Printer: Network (IP: {PRINTER_CONFIG['ip']})")
    print(" JANGAN TUTUP jendela ini selama aplikasi kasir digunakan.")
    print("=======================================================\n")
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, PrintHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] Mematikan Print Server...")
        sys.exit(0)

if __name__ == '__main__':
    run_server()
