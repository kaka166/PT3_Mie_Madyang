import {
  ShoppingBag,
  Factory,
  Trash2,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

export default function KitchenPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-8">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Kitchen Dashboard</h1>
          <p className="text-zinc-500">
            Manage production output and material procurement.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="bg-gradient-to-b from-red-700 to-red-500 text-white px-6 py-3 rounded-xl font-semibold">
            Catat Pembelian Bahan
          </button>

          <button className="bg-white border border-red-300 text-red-700 px-6 py-3 rounded-xl font-semibold">
            Input Hasil Produksi
          </button>

          <button className="bg-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold">
            Lapor Stok Tidak Layak
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* CARD PRODUKSI */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <span className="text-xs uppercase text-zinc-400">
              Daily Noodle Production
            </span>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-bold text-red-700">142.5</span>
              <span className="text-lg text-zinc-400">KG</span>
            </div>

            <p className="mt-3 text-green-600 text-sm font-semibold">
              +12% from yesterday
            </p>
          </div>

          {/* INVENTORY */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <span className="text-xs uppercase text-zinc-400">
              Inventory Health
            </span>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>Tepung Terigu</span>
                  <span className="text-green-600 font-semibold">85%</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded mt-2">
                  <div className="h-2 bg-green-600 w-[85%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <span>Telur Ayam</span>
                  <span className="text-red-600 font-semibold">12%</span>
                </div>
                <div className="h-2 bg-zinc-200 rounded mt-2">
                  <div className="h-2 bg-red-600 w-[12%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Purchasing & Production Activity
              </h3>
              <button className="text-red-700 text-sm font-semibold">
                View All
              </button>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-3 text-left">Activity</th>
                  <th className="px-6 py-3 text-left">Details</th>
                  <th className="px-6 py-3 text-left">Value / Qty</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {/* MATERIAL PURCHASE */}
                <tr className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingBag size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Material Purchase</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">Beli Tepung 25kg</p>
                    <p className="text-xs text-zinc-500">
                      Supplier: Grain Master Co.
                    </p>
                  </td>

                  <td className="px-6 py-4 font-semibold">Rp 350.000</td>

                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-red-700 text-sm font-medium">
                      View Receipt <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>

                {/* PRODUCTION OUTPUT */}
                <tr className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Factory size={18} className="text-green-600" />
                    </div>
                    <span className="font-medium">Production Output</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">Produksi Mie Basah</p>
                    <p className="text-xs text-zinc-500">Batch #0942</p>
                  </td>

                  <td className="px-6 py-4 font-semibold">10kg</td>

                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                      Completed
                    </span>
                  </td>
                </tr>

                {/* WASTE REPORT */}
                <tr className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Trash2 size={18} className="text-red-600" />
                    </div>
                    <span className="font-medium">Waste Report</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">Stok Basi: Mie</p>
                    <p className="text-xs text-zinc-500">
                      Reason: Humidity issue
                    </p>
                  </td>

                  <td className="px-6 py-4 font-semibold">2kg</td>

                  <td className="px-6 py-4">
                    <button className="text-zinc-500 hover:text-black">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>

                {/* ANOTHER PURCHASE */}
                <tr className="border-t border-zinc-200 hover:bg-zinc-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingBag size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium">Material Purchase</span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">Telur Ayam (Papan)</p>
                    <p className="text-xs text-zinc-500">
                      Supplier: Local Farm
                    </p>
                  </td>

                  <td className="px-6 py-4 font-semibold">Rp 120.000</td>

                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1 text-red-700 text-sm font-medium">
                      View Receipt <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      

      {/* FORM SECTION */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        {/* PRODUKSI */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h3 className="font-bold mb-6">Log Daily Production</h3>

          <div className="space-y-4">
            <input
              placeholder="Nama barang"
              className="w-full p-3 rounded-xl bg-zinc-100"
            />

            <input
              type="number"
              placeholder="Jumlah (KG)"
              className="w-full p-3 rounded-xl bg-zinc-100"
            />

            <button className="w-full bg-red-700 text-white py-3 rounded-xl">
              Simpan Produksi
            </button>
          </div>
        </div>

        {/* PEMBELIAN */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h3 className="font-bold mb-6">Log Material Purchase</h3>

          <div className="space-y-4">
            <input
              placeholder="Nama barang"
              className="w-full p-3 rounded-xl bg-zinc-100"
            />

            <input
              placeholder="Harga"
              className="w-full p-3 rounded-xl bg-zinc-100"
            />

            <input
              placeholder="Jumlah"
              className="w-full p-3 rounded-xl bg-zinc-100"
            />

            <button className="w-full bg-red-700 text-white py-3 rounded-xl">
              Simpan Pembelian
            </button>
          </div>
        </div>
      </div>
    </div>

    
  );
}
