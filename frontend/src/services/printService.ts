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
}

export async function smartPrint(order: PrintOrder) {
  try {
    // Coba kirim ke Local Print Server (Python)
    const response = await fetch("http://localhost:5000/print", {
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
    console.log("Local Print Server tidak merespons, fallback ke browser print.", error);
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
