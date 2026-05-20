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
            $totalBiayaBahan = 0;
            $bahanData = [];
            $target = $request->target_penjualan;

            // 1. Total biaya semua bahan
            foreach ($request->bahan as $b) {
                $totalBiayaBahan += $b['harga_beli'];

                $bahanData[] = [
                    'nama_bahan' => $b['nama'],
                    'harga_beli' => $b['harga_beli'],
                    'jumlah_porsi' => $b['jumlah_porsi'],
                    'hpp_per_porsi' => $target > 0 ? $b['harga_beli'] / $target : 0,
                ];
            }

            // 2. Total biaya operasional
            $totalOperasional = ($request->beban_sewa ?? 0) + ($request->beban_gaji ?? 0) + ($request->beban_lain_lain ?? 0);

            // 3. HPP per porsi = (total semua biaya) / target porsi
            $totalHppFinal = $target > 0 ? ($totalBiayaBahan + $totalOperasional) / $target : 0;

            // 4. Simpan Header
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

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_menu' => 'required|string',
            'bahan' => 'required|array',
            'target_penjualan' => 'required|numeric|min:1',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $hppHistory = HppHistory::findOrFail($id);

            $totalBiayaBahan = 0;
            $bahanData = [];
            $target = $request->target_penjualan;

            foreach ($request->bahan as $b) {
                $totalBiayaBahan += $b['harga_beli'];

                $bahanData[] = [
                    'nama_bahan' => $b['nama'],
                    'harga_beli' => $b['harga_beli'],
                    'jumlah_porsi' => $b['jumlah_porsi'],
                    'hpp_per_porsi' => $target > 0 ? $b['harga_beli'] / $target : 0,
                ];
            }

            $totalOperasional = ($request->beban_sewa ?? 0) + ($request->beban_gaji ?? 0) + ($request->beban_lain_lain ?? 0);
            $totalHppFinal = $target > 0 ? ($totalBiayaBahan + $totalOperasional) / $target : 0;

            $hppHistory->update([
                'nama_menu' => $request->nama_menu,
                'target_penjualan' => $request->target_penjualan,
                'beban_sewa' => $request->beban_sewa ?? 0,
                'beban_gaji' => $request->beban_gaji ?? 0,
                'beban_lain_per_porsi' => $request->beban_lain_lain ?? 0,
                'total_hpp' => $totalHppFinal,
            ]);

            $hppHistory->details()->delete();
            foreach ($bahanData as $detail) {
                $hppHistory->details()->create($detail);
            }

            return response()->json([
                'success' => true,
                'message' => 'HPP Berhasil diperbarui',
                'data' => $hppHistory->load('details')
            ]);
        });
    }
}