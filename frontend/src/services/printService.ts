/**
 * Print Service - Mie Ma-Dyang POS
 * Kirim data struk langsung lewat Browser Dialog (Tanpa Print Server Lokal)
 */

export interface PrintItem {
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
}

export interface PrintOrder {
  no: string;
  nama: string;
  kasir: string;
  metode: string;
  waktu: string;
  kondisi: string;
  total: number;
  items: PrintItem[];
  tunai?: number;
  kembalian?: number;
  receipt_config?: Record<string, any>;
}

let cachedDevice: any = null;
let cachedCharacteristic: any = null;

async function getBluetoothCharacteristic() {
  if (cachedCharacteristic) return cachedCharacteristic;
  const nav = navigator as any;
  if (!nav.bluetooth) throw new Error("Web Bluetooth API tidak didukung di browser ini.");

  const device = await nav.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      '000018f0-0000-1000-8000-00805f9b34fb', 
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2', 
      '49535343-fe7d-4ae5-8fa9-9fafd205e455', 
      '0000ff00-0000-1000-8000-00805f9b34fb'
    ]
  });

  const server = await device.gatt.connect();
  const services = await server.getPrimaryServices();
  for (const service of services) {
    const characteristics = await service.getCharacteristics();
    for (const char of characteristics) {
      if (char.properties.write || char.properties.writeWithoutResponse) {
        cachedDevice = device;
        cachedCharacteristic = char;
        device.addEventListener('gattserverdisconnected', () => {
          cachedDevice = null;
          cachedCharacteristic = null;
        });
        return char;
      }
    }
  }
  throw new Error("Karakteristik Bluetooth untuk mencetak tidak ditemukan.");
}

async function printViaBluetooth(order: PrintOrder) {
  const char = await getBluetoothCharacteristic();
  const buffer: number[] = [];
  const config = order.receipt_config || {};

  buffer.push(27, 64); // ESC @
  buffer.push(27, 97, 1); // Center

  const textToBuffer = (str: string) => {
    for (let i = 0; i < str.length; i++) buffer.push(str.charCodeAt(i));
    buffer.push(10); // LF
  };

  const formatRp = (angka: number) => new Intl.NumberFormat("id-ID").format(angka);

  textToBuffer(config.store_name || "MIE MA-DYANG");
  if (config.store_motto) textToBuffer(config.store_motto);
  textToBuffer(config.store_address || "Jl. Raya Madyang No. 16, Malang");
  if (config.store_phone) textToBuffer(config.store_phone);
  textToBuffer("-".repeat(32));

  buffer.push(27, 97, 0); // Left
  textToBuffer(`No   : ${order.no}`);
  textToBuffer(`Kasir: ${order.kasir}`);
  textToBuffer(`Plgn : ${order.nama}`);
  textToBuffer("-".repeat(32));

  order.items.forEach((item) => {
    textToBuffer(item.nama);
    const line = `  ${item.qty} x ${formatRp(item.harga)}`;
    const subtotal = formatRp(item.subtotal);
    const spaces = Math.max(1, 32 - line.length - subtotal.length);
    textToBuffer(line + " ".repeat(spaces) + subtotal);
  });
  textToBuffer("-".repeat(32));

  buffer.push(27, 97, 2); // Right
  textToBuffer(`TOTAL   : ${formatRp(order.total)}`);
  if (order.tunai) textToBuffer(`Bayar   : ${formatRp(order.tunai)}`);
  if (order.kembalian !== undefined) textToBuffer(`Kembali : ${formatRp(order.kembalian)}`);

  buffer.push(27, 97, 1); // Center
  textToBuffer("-".repeat(32));
  textToBuffer(config.footer_msg1 || "Terima kasih!");
  if (config.footer_msg2) textToBuffer(config.footer_msg2);
  buffer.push(10, 10, 10, 10); // Spacing

  const finalBuffer = new Uint8Array(buffer);
  const chunkSize = 100;
  for (let i = 0; i < finalBuffer.length; i += chunkSize) {
    await char.writeValue(finalBuffer.slice(i, i + chunkSize));
  }
}

export async function smartPrint(order: PrintOrder) {
  try {
    const printServerUrl = order.receipt_config?.print_server_url || "http://localhost:5000/print";
    
    if (printServerUrl.trim().toLowerCase() === "bluetooth") {
      await printViaBluetooth(order);
      return "server"; // sukses via bluetooth
    }

    const response = await fetch(printServerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      return "server";
    }
  } catch (error) {
    console.log("Cetak gagal / tidak merespons, fallback ke browser print.", error);
  }

  // Fallback ke browser print
  const printWindow = window.open("", "_blank", "width=340,height=600");
  if (!printWindow) {
    alert("Popup diblokir oleh browser! Mohon izinkan popup untuk mencetak struk.");
    return "failed";
  }

  // Format angka ke Rupiah untuk struk
  const formatRp = (angka: number) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  const receiptHtml = `
    <html>
    <head>
      <title>Cetak Struk - ${order.no}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 80mm;
          margin: 0;
          padding: 10px;
          color: #000;
          font-size: 14px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .title { 
          font-size: 20px; 
          font-weight: bold; 
          margin-bottom: 5px; 
        }
        .subtitle { 
          font-size: 12px; 
          margin-bottom: 15px; 
        }
        .divider { 
          border-top: 1px dashed #000; 
          margin: 8px 0; 
        }
        .flex { 
          display: flex; 
          justify-content: space-between; 
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }
        .item-name { 
          margin-bottom: 2px;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
        }
        .btn-print {
          display: none;
        }
        
        @media print {
          body {
            width: 100%;
            padding: 0;
          }
          .btn-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="text-center">
        <div class="title">MIE MA-DYANG</div>
        <div class="subtitle">
          The Culinary Curator<br>
          Jl. Raya Madyang No. 16, Malang<br>
          0812-3456-7890
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="flex"><span>No: ${order.no}</span></div>
      <div class="flex"><span>Tgl: ${new Date(order.waktu).toLocaleString("id-ID")}</span></div>
      <div class="flex"><span>Kasir: ${order.kasir}</span></div>
      <div class="flex"><span>Plgn: ${order.nama}</span></div>
      <div class="flex"><span>Tipe: ${order.kondisi}</span></div>
      
      <div class="divider"></div>
      
      <div style="margin-bottom: 8px;">
        ${order.items.map(item => `
          <div class="item-name">${item.nama}</div>
          <div class="item-row">
            <span>${item.qty} x ${formatRp(item.harga)}</span>
            <span>${formatRp(item.subtotal)}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="divider"></div>
      
      <div class="flex font-bold" style="font-size: 16px;">
        <span>TOTAL</span>
        <span>Rp ${formatRp(order.total)}</span>
      </div>
      
      <div class="flex" style="margin-top: 5px;">
        <span>Bayar (${order.metode})</span>
        <span>${order.tunai ? `Rp ${formatRp(order.tunai)}` : '-'}</span>
      </div>
      
      <div class="flex">
        <span>Kembali</span>
        <span>${order.kembalian !== undefined ? `Rp ${formatRp(order.kembalian)}` : '-'}</span>
      </div>
      
      <div class="divider"></div>
      
      <div class="text-center footer">
        <div class="font-bold">Terima kasih!</div>
        <div>Selamat menikmati :)</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(receiptHtml);
  printWindow.document.close();
  return "browser";
}
