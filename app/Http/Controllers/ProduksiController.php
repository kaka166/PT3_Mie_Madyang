<?php

namespace App\Http\Controllers;

use App\Models\Produksi;
use Illuminate\Http\Request;
use App\Models\Menu;
use App\Models\StokBahan;
use App\Models\PembelianBahan;
use App\Models\StokPorsi;
use Illuminate\Support\Facades\DB;

class ProduksiController extends Controller
{
    public function index()
    {
        return Produksi::with('menu')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menu,id',
            'jumlah_porsi' => 'required|integer|min:1',
            'created_by' => 'required|exists:users,id'
        ]);

        $menu = Menu::with('resep')->find($request->menu_id);

        if (!$menu) {
            return response()->json(['error' => 'Menu tidak ditemukan'], 404);
        }

        $jumlah_porsi = $request->jumlah_porsi;
        $total_hpp = 0;

        DB::beginTransaction();

        try {
            foreach ($menu->resep as $resep) {
                $kebutuhan = $resep->qty * $jumlah_porsi;

                $hargaData = PembelianBahan::where('bahan_id', $resep->bahan_id)
                    ->latest()
                    ->first();

                if (!$hargaData) {
                    DB::rollBack();
                    return response()->json(['error' => 'Harga bahan belum ada untuk bahan ID: ' . $resep->bahan_id], 400);
                }

                $harga = $hargaData->harga_per_satuan;
                $hpp_bahan = $kebutuhan * $harga;
                $total_hpp += $hpp_bahan;

                $stok = StokBahan::where('bahan_id', $resep->bahan_id)->first();

                if (!$stok || $stok->qty < $kebutuhan) {
                    DB::rollBack();
                    return response()->json(['error' => 'Stok bahan tidak cukup untuk bahan ID: ' . $resep->bahan_id], 400);
                }

                $stok->qty -= $kebutuhan;
                $stok->save();
            }

            $hpp_per_porsi = $total_hpp / $jumlah_porsi;

            Produksi::create([
                'menu_id' => $request->menu_id,
                'tanggal_produksi' => now(),
                'jumlah_porsi' => $jumlah_porsi,
                'hpp_per_porsi' => $hpp_per_porsi,
                'created_by' => $request->created_by
            ]);

            $stokPorsi = StokPorsi::where('menu_id', $menu->id)->first();

            if (!$stokPorsi) {
                StokPorsi::create([
                    'menu_id' => $menu->id,
                    'qty' => $jumlah_porsi
                ]);
            } else {
                $stokPorsi->qty += $jumlah_porsi;
                $stokPorsi->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Produksi berhasil!',
                'hpp_per_porsi' => $hpp_per_porsi
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }
}