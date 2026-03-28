<?php

namespace App\Http\Controllers;

use App\Models\StokRusak;
use App\Models\StokPorsi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StokRusakController extends Controller
{
    public function index()
    {
        $stokRusak = StokRusak::with('menu')->get();
        return response()->json($stokRusak);
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menu,id',
            'qty' => 'required|integer|min:1',
            'alasan' => 'required|string|max:255',
            'tanggal' => 'required|date'
        ]);

        DB::beginTransaction();

        try {
            $menu_id = $request->menu_id;
            $qty_rusak = $request->qty;

            $stokPorsi = StokPorsi::where('menu_id', $menu_id)->first();

            if (!$stokPorsi || $stokPorsi->qty < $qty_rusak) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Gagal! Jumlah stok rusak yang diinput melebihi sisa stok porsi yang ada di dapur.'
                ], 400);
            }

            $stokPorsi->qty -= $qty_rusak;
            $stokPorsi->save();

            $stokRusak = StokRusak::create([
                'menu_id' => $menu_id,
                'qty' => $qty_rusak,
                'alasan' => $request->alasan,
                'tanggal' => $request->tanggal
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Stok rusak berhasil dicatat dan stok porsi telah dipotong.',
                'data' => $stokRusak->load('menu')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $stokRusak = StokRusak::findOrFail($id);

            $stokPorsi = StokPorsi::where('menu_id', $stokRusak->menu_id)->first();
            if ($stokPorsi) {
                $stokPorsi->qty += $stokRusak->qty;
                $stokPorsi->save();
            }

            $stokRusak->delete();

            DB::commit();

            return response()->json(['message' => 'Catatan dibatalkan. Stok porsi telah dikembalikan ke dapur.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }
}