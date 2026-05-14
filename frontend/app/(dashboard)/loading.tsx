export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[80vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c93535]" />
        <p className="text-sm text-gray-400">Memuat halaman...</p>
      </div>
    </div>
  );
}
