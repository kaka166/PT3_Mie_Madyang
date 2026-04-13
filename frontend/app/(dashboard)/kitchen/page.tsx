"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/services/penjualanService";
import {
  Search,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Fungsi bantuan untuk menentukan warna badge status
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Antri":
      return "bg-gray-300 text-gray-600";
    case "Dimasak":
      return "bg-yellow-400 text-yellow-800";
    case "Ready":
      return "bg-green-300 text-green-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export default function KitchenDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 3000); // realtime polling
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = [...orders]
    .sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime())
    .filter((item) => {
      const orderDate = new Date(item.waktu).toISOString().split("T")[0];

      const matchDate = selectedDate ? orderDate === selectedDate : true;

      const matchSearch = searchId
        ? item.id.replace("#", "").includes(searchId)
        : true;

      return matchDate && matchSearch;
    });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  return (
    <div className="h-full w-full overflow-y-auto bg-gray-100 p-6 pb-12 font-sans text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-700 mb-1">
          Kitchen Dashboard
        </h1>
        <p className="text-gray-400 text-sm font-medium">
          Real Time, Track Pesanan
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar Card */}
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold text-gray-900">Pesanan</h2>

          <div className="flex gap-3">
            {/* Filter Tanggal Bawaan Browser */}
            <div className="relative flex items-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium w-44 cursor-pointer"
              />
            </div>

            {/* Input Pencarian */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari Pesanan (ID)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="bg-gray-200 text-gray-700 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="text-gray-400 border-b bg-white">
              <tr>
                <th className="py-4 px-4 font-medium">Order ID</th>
                <th className="py-4 px-4 font-medium">Waktu</th>
                <th className="py-4 px-4 font-medium">Customer</th>
                <th className="py-4 px-4 font-medium">Total Item</th>
                <th className="py-4 px-4 font-medium">Total Harga</th>
                <th className="py-4 px-4 font-medium">Kondisi</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-0 even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    <div>{new Date(item.waktu).toLocaleDateString()}</div>
                    <div>{new Date(item.waktu).toLocaleTimeString()}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.customer}
                  </td>
                  <td className="py-4 px-4 font-medium">{item.items}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.harga}
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-800">
                    {item.kondisi}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block w-24 text-center ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 flex justify-center items-center h-full">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={async () => {
                          await updateOrderStatus(
                            Number(item.id.replace("#", "")),
                            "cooking",
                          );

                          fetchOrders();
                        }}
                        className="text-yellow-600 text-xs font-bold">
                        Masak
                      </button>

                      <button
                        onClick={async () => {
                          await updateOrderStatus(
                            Number(item.id.replace("#", "")),
                            "done",
                          );

                          fetchOrders();
                        }}
                        className="text-green-600 text-xs font-bold">
                        Selesai
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-4 border-t flex justify-between items-center text-sm text-gray-500 bg-white">
          <span className="font-medium text-gray-500">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
            Transaction
          </span>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border rounded text-sm">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            {/* LEFT */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}>
              <ChevronLeft size={16} />
            </button>

            {/* NUMBER */}
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    currentPage === page
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}>
                  {page}
                </button>
              );
            })}

            {/* RIGHT */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
