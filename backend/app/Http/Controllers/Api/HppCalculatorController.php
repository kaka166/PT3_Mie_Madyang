<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HppHistory;
use App\Models\HppHistoryDetail;
use Illuminate\Support\Facades\DB;

class HppCalculatorController extends Controller
{
    // Menampilkan Riwayat HPP
    public function index()
    {
        $history = HppHistory::with('details')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    // Hitung dan Simpan ke DB
    public function store(Request $request)
    {
        $request->validate([
            'nama_menu' => 'required|string',
            'bahan' => 'required|array',
            'target_penjualan' => 'required|numeric|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $totalHppBahan = 0;
            $bahanData = [];

            // 1. Kalkulasi Bahan
            foreach ($request->bahan as $b) {
                $hppPerPorsi = $b['harga_beli'] / $b['jumlah_porsi'];
                $totalHppBahan += $hppPerPorsi;

                $bahanData[] = [
                    'nama_bahan' => $b['nama'],
                    'harga_beli' => $b['harga_beli'],
                    'jumlah_porsi' => $b['jumlah_porsi'],
                    'hpp_per_porsi' => $hppPerPorsi,
                ];
            }

            // 2. Kalkulasi Beban Operasional
            $sewaPerPorsi = ($request->beban_sewa ?? 0) / $request->target_penjualan;
            $gajiPerPorsi = ($request->beban_gaji ?? 0) / $request->target_penjualan;
            $totalHppFinal = $totalHppBahan + $sewaPerPorsi + $gajiPerPorsi + ($request->beban_lain_lain ?? 0);

            // 3. Simpan Header
            $hppHistory = HppHistory::create([
                'nama_menu' => $request->nama_menu,
                'target_penjualan' => $request->target_penjualan,
                'beban_sewa' => $request->beban_sewa ?? 0,
                'beban_gaji' => $request->beban_gaji ?? 0,
                'beban_lain_per_porsi' => $request->beban_lain_lain ?? 0,
                'total_hpp' => $totalHppFinal,
            ]);

            // 4. Simpan Detail Bahan
            foreach ($bahanData as $detail) {
                $hppHistory->details()->create($detail);
            }

            return response()->json([
                'success' => true,
                'message' => 'HPP Berhasil dihitung dan disimpan ke history',
                'data' => $hppHistory->load('details')
            ]);
        });
    }
}