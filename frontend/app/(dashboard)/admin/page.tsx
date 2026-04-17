import { TrendingUp, Filter, Download } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  subValue: string;
};

function StatCard({ title, value, change, subValue }: StatCardProps) {
  return (
    <div className=" bg-white rounded-xl p-5 md:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-neutral-500">
          {title}
        </span>

        <span className="flex items-center text-green-600 font-bold text-[10px] md:text-xs bg-green-50 px-2 py-1 rounded-full shrink-0">
          <TrendingUp size={12} className="mr-1" />
          {change}
        </span>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-red-700 mb-1 leading-tight">
          {value}
        </h2>
        <p className="text-[10px] md:text-xs text-neutral-400">{subValue}</p>
      </div>
    </div>
  );
}

// INI MAINNYA DISINI
export default function AdminPage() {
  return (
    <div className="h-full overflow-y-auto min-h-screen bg-neutral-100 p-8 font-sans pb-24 md:p-8 max-w-1xl mx-auto space-y-6 md:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Business Performance</h1>
        <p className="text-neutral-500 text-xs md:text-sm">
          Welcome back, Chief. Here is your overview for October 2023.
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Monthly Revenue"
          value="Rp 48.2M"
          change="+12.4%"
          subValue="vs Rp 42.8M last month"
        />

        <StatCard
          title="Net Profit"
          value="Rp 19.5M"
          change="+8.2%"
          subValue="vs Rp 18.0M last month"
        />

        {/* STOCK ALERT */}
        <div className="bg-white rounded-xl p-5 md:p-8 shadow-sm sm:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] md:text-xs uppercase font-medium tracking-widest text-neutral-500">
              Stock Alerts
            </span>

            <span className="text-[10px] md:text-xs text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full">
              4 Items Critical
            </span>
          </div>

          {/* Grid kecil di dalam stock alert: 2 kolom di HP, 4 di tablet/desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Mie Telur", stock: "2kg" },
              { name: "Ayam Fillet", stock: "1.5kg" },
              { name: "Sawi Hijau", stock: "0.5kg" },
              { name: "Minyak Wijen", stock: "2 Botol" },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-neutral-50 rounded-lg text-center flex flex-col justify-center">
                <p className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase truncate">
                  {item.name}
                </p>
                <p className="text-xs md:text-sm font-bold text-red-600">{item.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHART + RESTOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="font-bold text-sm md:text-base">Revenue vs Expense Trend</h3>

            <div className="flex gap-4 text-[10px] md:text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                <span>Expense</span>
              </div>
            </div>
          </div>

          <div className="h-40 md:h-64 flex items-end justify-between gap-1 md:gap-2">
            {[60, 75, 55, 90, 85, 100, 95].map((val, i) => (
              <div key={i} className="flex gap-1 items-end flex-1 max-w-[40px]">
                <div
                  className="w-full bg-red-600 rounded-t-sm"
                  style={{ height: `${val}%` }}
                />
                <div
                  className="w-full bg-neutral-400 rounded-t-sm"
                  style={{ height: `${val - 20}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[9px] md:text-xs mt-4 text-neutral-400 font-bold border-t pt-2">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* RESTOCK CARD */}
        <div className="bg-gradient-to-br from-[#a0383b] to-[#c05051] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[200px]">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2">Restock Requisition</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Generate an automated order list for your registered vendors.
            </p>
          </div>

          <button className="bg-white text-red-700 w-full py-3 rounded-xl font-bold mt-6 hover:bg-neutral-100 transition-colors">
            Review Order
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100">
          <h3 className="font-bold text-sm md:text-base">Profit Margin per Menu</h3>

          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center text-xs md:text-sm text-red-700 font-bold px-4 py-2 border border-red-100 hover:bg-red-50 rounded-lg">
              <Filter size={14} className="mr-2" />
              Filter
            </button>

            <button className="flex-1 sm:flex-none flex items-center justify-center text-xs md:text-sm text-red-700 font-bold px-4 py-2 border border-red-100 hover:bg-red-50 rounded-lg">
              <Download size={14} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Wrapper untuk Scroll Horizontal di HP */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm min-w-[600px]">
            <thead className="bg-neutral-50 uppercase text-neutral-500 text-[10px] md:text-xs">
              <tr>
                <th className="px-6 md:px-8 py-4 text-left font-semibold">Menu Item</th>
                <th className="px-6 md:px-8 py-4 text-right font-semibold">HPP</th>
                <th className="px-6 md:px-8 py-4 text-right font-semibold">Selling Price</th>
                <th className="px-6 md:px-8 py-4 text-right font-semibold">Margin %</th>
                <th className="px-6 md:px-8 py-4 text-center font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 md:px-8 py-5 font-bold text-neutral-800">
                  Mie Ayam Spesial Ma-Dyang
                </td>
                <td className="px-6 md:px-8 py-5 text-right text-neutral-500 font-medium">
                  Rp 12.500
                </td>
                <td className="px-6 md:px-8 py-5 text-right font-bold text-neutral-800">
                  Rp 28.000
                </td>
                <td className="px-6 md:px-8 py-5 text-right text-green-600 font-bold">
                  55.4%
                </td>
                <td className="px-6 md:px-8 py-5 text-center">
                  <span className="bg-green-100 text-green-600 text-[10px] md:text-[11px] px-3 py-1 rounded-full font-bold uppercase whitespace-nowrap">
                    High Margin
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}