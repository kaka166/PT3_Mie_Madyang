import sys
import json
import time
import logging
from datetime import datetime
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

# Setup Logging
log_filename = f"print_server_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.FileHandler(log_filename),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

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
        pass # Matikan log bawaan http.server

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
                origin = self.headers.get('Origin', 'Web Lokal / Unknown')
                
                if 'mie-madyang.farelzy.my.id' in origin:
                    logger.info(f"WEB ONLINE REQUEST: Order No: {order.get('no', 'Unknown')} | Dari: {origin}")
                else:
                    logger.info(f"WEB REQUEST: Order No: {order.get('no', 'Unknown')} | Dari: {origin}")
                
                self.print_receipt(order, PRINTER_CONFIG)
                
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Struk berhasil dicetak"}).encode('utf-8'))
                logger.info(f"PRINTER SUCCESS: Struk {order.get('no', 'Unknown')} berhasil dicetak!")
                
            except Exception as e:
                logger.error(f"PRINTER ERROR: Gagal mencetak: {e}")
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
        if config['type'] == 'serial':
            printer = Serial(config['port'], 9600, timeout=1)
        elif config['type'] == 'usb':
            printer = Usb(int(config['vendor'], 16), int(config['product'], 16), 0)
        elif config['type'] == 'network':
            printer = Network(config['ip'])
        else:
            raise Exception("Tipe printer tidak dikenali.")
            
        try:
            receipt_config = order.get('receipt_config', {})
            store_name = receipt_config.get('store_name') or 'MIE MA-DYANG'
            store_motto = receipt_config.get('store_motto') or 'The Culinary Curator'
            store_address = receipt_config.get('store_address') or 'Jl. Raya Madyang No. 16, Malang'
            store_phone = receipt_config.get('store_phone') or '0812-3456-7890'
            footer_msg1 = receipt_config.get('footer_msg1') or 'Terima kasih!'
            footer_msg2 = receipt_config.get('footer_msg2') or 'Selamat menikmati :)'

            printer.set(align='center', font='a', width=1, height=1)
            printer.text(f"{store_name}\n")
            if store_motto: printer.text(f"{store_motto}\n")
            printer.text(f"{store_address}\n")
            if store_phone: printer.text(f"{store_phone}\n")
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
            if footer_msg1: printer.text(f"{footer_msg1}\n")
            if footer_msg2: printer.text(f"{footer_msg2}\n")
            printer.text("\n\n\n\n")
        finally:
            # Pastikan koneksi printer ditutup agar tidak terjadi PermissionError(13) di pencetakan berikutnya
            if hasattr(printer, 'close'):
                try:
                    printer.close()
                except:
                    pass

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
            
    logger.info("Menyimpan konfigurasi printer...")
    
    print("\n=======================================================")
    logger.info(f"Print Server BERJALAN di Port {port}")
    
    if PRINTER_CONFIG['type'] == 'serial':
        print(f" >>> ANDA TERHUBUNG DENGAN PRINTER {PRINTER_CONFIG['port']} <<<")
        logger.info(f"Terkoneksi ke {PRINTER_CONFIG['port']}")
    elif PRINTER_CONFIG['type'] == 'usb':
        print(" >>> ANDA TERHUBUNG DENGAN PRINTER USB <<<")
        logger.info("Terkoneksi ke USB")
    elif PRINTER_CONFIG['type'] == 'network':
        print(f" >>> ANDA TERHUBUNG DENGAN PRINTER IP {PRINTER_CONFIG['ip']} <<<")
        logger.info(f"Terkoneksi ke IP {PRINTER_CONFIG['ip']}")
        
    print("\nJANGAN TUTUP jendela ini selama aplikasi kasir digunakan.")
    print("Menerima request dari web lokal maupun online (mie-madyang.farelzy.my.id).")
    print(f"Log disimpan di: {log_filename}")
    print("=======================================================\n")
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, PrintHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Mematikan Print Server...")
        sys.exit(0)

if __name__ == '__main__':
    run_server()
