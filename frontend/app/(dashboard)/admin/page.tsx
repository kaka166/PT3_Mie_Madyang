import { TrendingUp, Filter, Download } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  subValue: string;
};

function StatCard({ title, value, change, subValue }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-neutral-500">
          {title}
        </span>

        <span className="flex items-center text-green-600 font-bold text-[10px] md:text-xs bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} className="mr-1" />
          {change}
        </span>
      </div>

      <h2 className="text-2xl md:text-[2.5rem] font-bold text-red-700 mb-1">
        {value}
      </h2>

      <p className="text-[10px] md:text-xs text-neutral-400">{subValue}</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-3xl font-bold">Business Performance</h1>
        <p className="text-neutral-500 text-xs md:text-sm">
          Welcome back, Chief. Here is your overview for October 2023.
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
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
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] md:text-xs uppercase font-medium tracking-widest text-neutral-500">
              Stock Alerts
            </span>

            <span className="text-xs text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full">
              4 Items Critical
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Mie Telur", stock: "2kg Left" },
              { name: "Ayam Fillet", stock: "1.5kg Left" },
              { name: "Sawi Hijau", stock: "0.5kg Left" },
              { name: "Minyak Wijen", stock: "2 Botol" },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-neutral-50 rounded-lg text-center">
                <p className="text-[10px] font-bold text-neutral-500 uppercase">
                  {item.name}
                </p>
                <p className="text-sm font-bold text-red-600">{item.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHART + RESTOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* CHART */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Revenue vs Expense Trend</h3>

            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                Revenue
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                Expense
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="h-48 md:h-64 flex items-end justify-between">
            {[60, 75, 55, 90, 85, 100, 95].map((val, i) => (
              <div key={i} className="flex gap-1 items-end w-6">
                <div
                  className="w-1/2 bg-red-600 rounded"
                  style={{ height: `${val}%` }}
                />
                <div
                  className="w-1/2 bg-neutral-400 rounded"
                  style={{ height: `${val - 20}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] md:text-xs mt-2 text-neutral-400 font-bold">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* RESTOCK */}
        <div className="bg-gradient-to-b from-[#a0383b] to-[#c05051] text-white rounded-xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Restock Requisition</h3>
            <p className="text-sm opacity-80">
              Generate an automated order list for vendors.
            </p>
          </div>

          <button className="bg-white text-red-700 px-4 py-2 rounded-xl font-bold mt-6">
            Review Order
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="p-4 md:p-8 flex justify-between items-center border-b border-neutral-200">
          <h3 className="font-bold">Profit Margin per Menu</h3>

          <div className="flex gap-2">
            <button className="flex items-center text-xs md:text-sm text-red-700 font-bold px-3 py-2 hover:bg-red-50 rounded-lg">
              <Filter size={14} className="mr-1" />
              Filter
            </button>

            <button className="flex items-center text-xs md:text-sm text-red-700 font-bold px-3 py-2 hover:bg-red-50 rounded-lg">
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full text-xs md:text-sm">
          <thead className="bg-neutral-100 uppercase text-neutral-500">
            <tr>
              <th className="px-4 md:px-8 py-3 text-left">Menu Item</th>
              <th className="px-4 md:px-8 py-3 text-right">HPP</th>
              <th className="px-4 md:px-8 py-3 text-right">Selling Price</th>
              <th className="px-4 md:px-8 py-3 text-right">Margin %</th>
              <th className="px-4 md:px-8 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className=" hover:bg-neutral-50">
              <td className="px-4 md:px-8 py-4 font-bold">
                Mie Ayam Spesial Ma-Dyang
              </td>
              <td className="px-4 md:px-8 py-4 text-right text-neutral-500">
                Rp 12.500
              </td>
              <td className="px-4 md:px-8 py-4 text-right font-bold">
                Rp 28.000
              </td>
              <td className="px-4 md:px-8 py-4 text-right text-green-600 font-bold">
                55.4%
              </td>
              <td className="px-4 md:px-8 py-4">
                <span className="bg-green-100 text-green-600 text-[10px] md:text-xs px-2 py-1 rounded-full font-bold uppercase">
                  High Margin
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
