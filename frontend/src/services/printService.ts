/**
 * Print Service - Mie Ma-Dyang POS
 * Kirim data struk ke print server lokal (localhost:8585)
 * Fallback ke browser print dialog jika server tidak tersedia
 */

const PRINT_SERVER_URL = "http://localhost:8585";

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
  items: PrintItem[];
  total: number;
}

/** Cek apakah print server lokal tersedia */
export async function isPrintServerAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${PRINT_SERVER_URL}/status`, {
      signal: AbortSignal.timeout(1000),
    });
    const data = await res.json();
    return data.ready === true;
  } catch {
    return false;
  }
}

/** Cetak struk via print server lokal (tanpa dialog) */
export async function printViaServer(order: PrintOrder): Promise<boolean> {
  try {
    const res = await fetch(`${PRINT_SERVER_URL}/print`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

/** Cetak struk via browser print dialog (fallback) */
export function printViaBrowser(order: PrintOrder): void {
  const formatRp = (n: number) =>
    "Rp " + n.toLocaleString("id-ID");

  const formatWaktu = (w: string) => {
    try {
      return new Date(w).toLocaleString("id-ID", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return w; }
  };

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:2px 0">${item.nama}</td>
        <td style="text-align:center;padding:2px 4px">${item.qty}x</td>
        <td style="text-align:right;padding:2px 0">${formatRp(item.subtotal)}</td>
      </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: 80mm auto; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 4mm; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .big { font-size: 16px; font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 4px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { vertical-align: top; }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="big">MIE MA-DYANG</div>
        <div>The Culinary Curator</div>
        <div style="font-size:10px">Jl. Contoh No.1, Kota</div>
      </div>
      <div class="divider"></div>
      <div>No  : ${order.no}</div>
      <div>Tgl : ${formatWaktu(order.waktu)}</div>
      <div>Kasir: ${order.kasir}</div>
      <div>Meja : ${order.kondisi}</div>
      <div class="divider"></div>
      <table>
        <thead>
          <tr>
            <th style="text-align:left">Item</th>
            <th>Qty</th>
            <th style="text-align:right">Harga</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div class="divider"></div>
      <div style="display:flex;justify-content:space-between">
        <span class="bold">TOTAL</span>
        <span class="bold">${formatRp(order.total)}</span>
      </div>
      <div>Metode: ${order.metode}</div>
      <div class="divider"></div>
      <div class="center">
        <div>Terima kasih!</div>
        <div>Selamat menikmati :)</div>
      </div>
      <script>window.onload = () => { window.print(); window.close(); }</script>
    </body>
    </html>`;

  const win = window.open("", "_blank", "width=340,height=600");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

/**
 * Smart print: coba server dulu, fallback ke browser
 * @returns "server" | "browser" | "failed"
 */
export async function smartPrint(order: PrintOrder): Promise<"server" | "browser" | "failed"> {
  const serverOk = await isPrintServerAvailable();
  if (serverOk) {
    const success = await printViaServer(order);
    if (success) return "server";
  }
  // Fallback: browser dialog
  try {
    printViaBrowser(order);
    return "browser";
  } catch {
    return "failed";
  }
}
