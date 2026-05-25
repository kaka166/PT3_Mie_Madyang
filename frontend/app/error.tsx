"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-gray-500 font-medium mb-6">
          {error.message || "Something went wrong"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#F53E1B] text-white rounded-xl font-bold hover:bg-[#d93515] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
