"""
Print Server untuk Mie Ma-Dyang POS
Jalan di background, terima request dari web app dan kirim ke printer RONGTA RPP02N
Run: python print_server.py
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import win32print
import threading
import sys
import subprocess

# Auto-install pywin32 jika belum ada
try:
    import win32print
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pywin32", "-q"])
    import win32print

# ======= KONFIGURASI =======
PORT = 8585
PRINTER_KEYWORD = ['rongta', 'rpp']  # keyword nama printer (case-insensitive)

# ======= ESC/POS Helpers =======
ESC = b'\x1b'
GS  = b'\x1d'

def esc_init():         return ESC + b'\x40'
def esc_center():       return ESC + b'\x61\x01'
def esc_left():         return ESC + b'\x61\x00'
def esc_bold_on():      return ESC + b'\x45\x01'
def esc_bold_off():     return ESC + b'\x45\x00'
def esc_double():       return ESC + b'\x21\x30'
def esc_normal():       return ESC + b'\x21\x00'
def esc_feed(n=4):      return ESC + b'\x64' + bytes([n])
def esc_cut():          return GS  + b'\x56\x41\x00'
def enc(text):          return text.encode('latin-1', errors='replace')

def find_printer():
    """Cari printer Rongta yang terinstall"""
    printers = win32print.EnumPrinters(
        win32print.PRINTER_ENUM_LOCAL | win32print.PRINTER_ENUM_CONNECTIONS
    )
    # Prioritas: cari yang ada "(2)" dulu (yang paling baru diinstall)
    for p in printers:
        name = p[2].lower()
        if any(k in name for k in PRINTER_KEYWORD):
            return p[2]
    return None

def raw_print(printer_name, data: bytes):
    """Kirim raw ESC/POS data ke printer"""
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        hJob = win32print.StartDocPrinter(hPrinter, 1, ("Mie Ma-Dyang Struk", None, "RAW"))
        win32print.StartPagePrinter(hPrinter)
        win32print.WritePrinter(hPrinter, data)
        win32print.EndPagePrinter(hPrinter)
        win32print.EndDocPrinter(hPrinter)
    finally:
        win32print.ClosePrinter(hPrinter)

def build_struk(order: dict) -> bytes:
    """
    Build ESC/POS struk dari data order:
    {
        "no": "2026052006",
        "nama": "Guest",
        "kasir": "Relz",
        "metode": "Tunai",
        "waktu": "2026-05-20 11:57:00",
        "kondisi": "Makan di Tempat",
        "items": [
            {"nama": "Mie Ayam", "qty": 1, "harga": 15000, "subtotal": 15000}
        ],
        "total": 15000
    }
    """
    from datetime import datetime

    data = b''
    data += esc_init()

    # Header
    data += esc_center()
    data += esc_double() + esc_bold_on()
    data += enc("MIE MA-DYANG\n")
    data += esc_normal() + esc_bold_off()
    data += enc("The Culinary Curator\n")
    data += enc("Jl. Contoh No.1, Kota\n")
    data += enc("================================\n")

    # Info transaksi
    data += esc_left()
    no = order.get('no', '-')
    waktu_raw = order.get('waktu', '')
    try:
        dt = datetime.fromisoformat(str(waktu_raw).replace('T', ' ')[:19])
        waktu_str = dt.strftime('%d/%m/%Y %H:%M')
    except:
        waktu_str = str(waktu_raw)[:16]

    data += enc(f"No : {no}\n")
    data += enc(f"Tgl: {waktu_str}\n")
    data += enc(f"Kasir: {order.get('kasir', '-')}\n")
    data += enc(f"Meja: {order.get('kondisi', '-')}\n")
    data += enc("================================\n")

    # Items
    data += enc(f"{'Item':<20} {'Qty':>3} {'Harga':>8}\n")
    data += enc("--------------------------------\n")
    for item in order.get('items', []):
        nama = str(item.get('nama', '-'))[:20]
        qty = item.get('qty', 1)
        harga = int(item.get('harga', 0))
        subtotal = int(item.get('subtotal', harga * qty))
        # Nama item (max 20 char)
        data += enc(f"{nama:<20} {qty:>3} {subtotal:>8,}\n".replace(',', '.'))

    data += enc("================================\n")

    # Total
    total = int(order.get('total', 0))
    data += esc_bold_on()
    data += enc(f"{'TOTAL':<20} {'Rp':>4} {total:>7,}\n".replace(',', '.'))
    data += esc_bold_off()
    data += enc(f"Metode: {order.get('metode', '-')}\n")

    # Footer
    data += enc("================================\n")
    data += esc_center()
    data += enc("Terima kasih!\n")
    data += enc("Selamat menikmati :)\n")
    data += esc_feed(4)
    data += esc_cut()

    return data

# ======= HTTP Handler =======
class PrintHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == '/status':
            printer = find_printer()
            body = json.dumps({
                "status": "ok",
                "printer": printer or "not found",
                "ready": printer is not None
            }).encode()
            self.send_response(200)
            self._cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/print':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length)
                order = json.loads(body)

                printer = find_printer()
                if not printer:
                    self._respond(503, {"success": False, "error": "Printer tidak ditemukan"})
                    return

                struk_data = build_struk(order)
                raw_print(printer, struk_data)

                self._respond(200, {"success": True, "printer": printer})
                print(f"[PRINT OK] No: {order.get('no', '?')} -> {printer}")

            except Exception as e:
                print(f"[ERROR] {e}")
                self._respond(500, {"success": False, "error": str(e)})
        else:
            self.send_response(404)
            self.end_headers()

    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _respond(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self._cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

# ======= MAIN =======
if __name__ == '__main__':
    printer = find_printer()
    print("=" * 40)
    print("  MIE MA-DYANG PRINT SERVER")
    print("=" * 40)
    print(f"  Port   : http://localhost:{PORT}")
    print(f"  Printer: {printer or 'TIDAK DITEMUKAN!'}")
    print(f"  Status : {'SIAP' if printer else 'ERROR - Cek printer'}")
    print("=" * 40)
    print("  Endpoint:")
    print(f"    GET  /status  - cek status printer")
    print(f"    POST /print   - cetak struk")
    print("=" * 40)
    print("  Tekan Ctrl+C untuk stop\n")

    server = HTTPServer(('localhost', PORT), PrintHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPrint server stopped.")
