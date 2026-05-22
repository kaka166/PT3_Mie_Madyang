"""
Print Server untuk Mie Ma-Dyang POS
Jalan di background, terima request dari web app dan kirim ke printer RONGTA RPP02N
Run: pythonw print_server.py  (tanpa console window)
  atau: python print_server.py  (dengan console)
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, sys, os, subprocess
from pathlib import Path

# Instal pyserial jika belum ada
try:
    import serial
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyserial", "-q"])
    import serial

# ======= LOAD CONFIG NOTA =======
BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "receipt_config.json"

def load_config():
    try:
        with open(CONFIG_PATH, encoding='utf-8') as f:
            return json.load(f)
    except:
        return {
            "nama_toko": "MIE MA-DYANG",
            "tagline": "The Culinary Curator",
            "alamat": "Jl. Raya Madyang No. 16, Malang",
            "telp": "0812-3456-7890",
            "footer_line1": "Terima kasih!",
            "footer_line2": "Selamat menikmati :)"
        }

# ======= KONFIGURASI =======
PORT = 8585
PRINTER_PORT = 'COM12'  # Pakai port langsung sesuai hardware

# ======= ESC/POS Helpers =======
ESC = b'\x1b'
GS  = b'\x1d'

def esc_init():      return ESC + b'\x40'
def esc_center():    return ESC + b'\x61\x01'
def esc_left():      return ESC + b'\x61\x00'
def esc_bold_on():   return ESC + b'\x45\x01'
def esc_bold_off():  return ESC + b'\x45\x00'
def esc_double():    return ESC + b'\x21\x30'
def esc_normal():    return ESC + b'\x21\x00'
def esc_feed(n=4):   return ESC + b'\x64' + bytes([n])
def esc_cut():       return GS  + b'\x56\x41\x00'
def enc(text):       return text.encode('latin-1', errors='replace')

def check_printer():
    try:
        # Test buka port sebentar
        with serial.Serial(PRINTER_PORT, 9600, timeout=1) as ser:
            return True
    except:
        return False

def raw_print(data: bytes):
    # Bypass Windows Spooler total, langsung kirim lewat hardware port
    with serial.Serial(PRINTER_PORT, 9600, timeout=3) as ser:
        ser.write(data)

def build_struk(order: dict) -> bytes:
    from datetime import datetime
    cfg = load_config()  # Baca config setiap print (supaya perubahan langsung terasa)

    data = b''
    data += esc_init()

    # ── HEADER ──
    data += esc_center()
    data += esc_double() + esc_bold_on()
    data += enc(cfg['nama_toko'] + "\n")
    data += esc_normal() + esc_bold_off()
    data += enc(cfg['tagline'] + "\n")
    data += enc(cfg['alamat'] + "\n")
    data += enc("Telp: " + cfg['telp'] + "\n")
    data += enc("================================\n")

    # ── INFO TRANSAKSI ──
    data += esc_left()
    waktu_raw = order.get('waktu', '')
    try:
        dt = datetime.fromisoformat(str(waktu_raw).replace('T', ' ')[:19])
        waktu_str = dt.strftime('%d/%m/%Y %H:%M')
    except:
        waktu_str = str(waktu_raw)[:16]

    data += enc(f"No    : {order.get('no', '-')}\n")
    data += enc(f"Tgl   : {waktu_str}\n")
    data += enc(f"Kasir : {order.get('kasir', '-')}\n")
    data += enc(f"Pelgn : {order.get('nama', 'Guest')}\n")
    data += enc(f"Meja  : {order.get('kondisi', '-')}\n")
    data += enc("================================\n")

    # ── ITEMS ──
    data += enc(f"{'Item':<20} {'Qty':>3} {'Harga':>8}\n")
    data += enc("--------------------------------\n")
    for item in order.get('items', []):
        nama = str(item.get('nama', '-'))[:20]
        qty = item.get('qty', 1)
        subtotal = int(item.get('subtotal', item.get('harga', 0) * qty))
        data += enc(f"{nama:<20} {qty:>3} {subtotal:>8,}\n".replace(',', '.'))

    data += enc("================================\n")

    # ── TOTAL ──
    total = int(order.get('total', 0))
    data += esc_bold_on()
    data += enc(f"{'TOTAL':<24} Rp{total:>7,}\n".replace(',', '.'))
    data += esc_bold_off()
    data += enc(f"Metode: {order.get('metode', '-')}\n")

    # ── FOOTER ──
    data += enc("================================\n")
    data += esc_center()
    data += enc(cfg['footer_line1'] + "\n")
    data += enc(cfg['footer_line2'] + "\n")
    data += esc_feed(4)
    data += esc_cut()

    return data

# ======= HTTP Handler =======
class PrintHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if self.path == '/status':
            is_ready = check_printer()
            cfg = load_config()
            self._respond(200, {
                "status": "ok",
                "printer": PRINTER_PORT if is_ready else "not found",
                "ready": is_ready,
                "config": cfg
            })
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/print':
            try:
                length = int(self.headers.get('Content-Length', 0))
                order = json.loads(self.rfile.read(length))
                if not check_printer():
                    self._respond(503, {"success": False, "error": f"Gagal buka port {PRINTER_PORT}"})
                    return
                raw_print(build_struk(order))
                self._respond(200, {"success": True, "printer": PRINTER_PORT})
                print(f"[PRINT OK] No:{order.get('no','?')} Nama:{order.get('nama','?')} -> {PRINTER_PORT}")
            except Exception as e:
                print(f"[ERROR] {e}")
                self._respond(500, {"success": False, "error": str(e)})
        else:
            self.send_response(404)
            self.end_headers()

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')

    def _respond(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self._cors()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

# ======= MAIN =======
if __name__ == '__main__':
    cfg = load_config()
    is_ready = check_printer()
    print("=" * 44)
    print(f"  {cfg['nama_toko']} - PRINT SERVER")
    print("=" * 44)
    print(f"  Port   : http://localhost:{PORT}")
    print(f"  Printer: {PRINTER_PORT}")
    print(f"  Status : {'SIAP' if is_ready else 'ERROR - Cek kabel/driver'}")
    print(f"  Config : {CONFIG_PATH}")
    print("=" * 44)
    print("  Tekan Ctrl+C untuk stop\n")

    server = HTTPServer(('localhost', PORT), PrintHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPrint server stopped.")
