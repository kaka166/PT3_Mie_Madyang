<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use App\Models\Menu;
use App\Models\StokPorsi;
use Illuminate\Support\Facades\DB;

class PenjualanController extends Controller
{
    public function index()
    {
        $penjualan = Penjualan::with('detail.menu')->get();
        return response()->json($penjualan);
    }

    public function store(Request $request)
    {
        $request->validate([
            'pesanan' => 'required|array|min:1',
            'pesanan.*.menu_id' => 'required|exists:menu,id',
            'pesanan.*.qty' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            $penjualan = Penjualan::create([
                'tanggal' => now(),
                'total' => 0, 
                'user_id' => 1
            ]);

            $grand_total = 0;

            foreach ($request->pesanan as $item) {
                $menu = Menu::find($item['menu_id']);
                $qty = $item['qty'];

                $stok = StokPorsi::where('menu_id', $menu->id)->first();
                if (!$stok || $stok->qty < $qty) {
                    DB::rollBack();
                    return response()->json(['error' => "Stok tidak cukup untuk menu: " . $menu->nama_menu], 400);
                }

                $subtotal = $menu->harga_jual * $qty;
                $grand_total += $subtotal;

                PenjualanDetail::create([
                    'penjualan_id' => $penjualan->id,
                    'menu_id' => $menu->id,
                    'qty' => $qty,
                    'harga' => $menu->harga_jual,
                    'subtotal' => $subtotal
                ]);

                $stok->qty -= $qty;
                $stok->save();
            }

            $penjualan->total = $grand_total;
            $penjualan->save();

            DB::commit();

            return response()->json([
                'message' => 'Penjualan berhasil dicatat!',
                'grand_total' => $grand_total,
                'data' => $penjualan->load('detail.menu')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'pesanan' => 'required|array|min:1',
            'pesanan.*.menu_id' => 'required|exists:menu,id',
            'pesanan.*.qty' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            $penjualan = Penjualan::with('detail')->findOrFail($id);

            foreach ($penjualan->detail as $itemLama) {
                $stokLama = StokPorsi::where('menu_id', $itemLama->menu_id)->first();
                if ($stokLama) {
                    $stokLama->qty += $itemLama->qty;
                    $stokLama->save();
                }
            }

            $penjualan->detail()->delete();

            $grand_total_baru = 0;

            foreach ($request->pesanan as $itemBaru) {
                $menu = Menu::find($itemBaru['menu_id']);
                $qty = $itemBaru['qty'];

                $stokBaru = StokPorsi::where('menu_id', $menu->id)->first();
                if (!$stokBaru || $stokBaru->qty < $qty) {
                    DB::rollBack();
                    return response()->json(['error' => "Update gagal! Stok tidak cukup untuk menu: " . $menu->nama_menu], 400);
                }

                $subtotal = $menu->harga_jual * $qty;
                $grand_total_baru += $subtotal;

                PenjualanDetail::create([
                    'penjualan_id' => $penjualan->id,
                    'menu_id' => $menu->id,
                    'qty' => $qty,
                    'harga' => $menu->harga_jual,
                    'subtotal' => $subtotal
                ]);

                $stokBaru->qty -= $qty;
                $stokBaru->save();
            }

            $penjualan->total = $grand_total_baru;
            $penjualan->save();

            DB::commit();

            return response()->json([
                'message' => 'Transaksi berhasil di-update!',
                'grand_total_baru' => $grand_total_baru,
                'data' => $penjualan->load('detail.menu')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }

    
    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $penjualan = Penjualan::with('detail')->findOrFail($id);

            foreach ($penjualan->detail as $item) {
                $stok = StokPorsi::where('menu_id', $item->menu_id)->first();
                if ($stok) {
                    $stok->qty += $item->qty;
                    $stok->save();
                }
            }

            $penjualan->detail()->delete();

            $penjualan->delete();

            DB::commit();

            return response()->json(['message' => 'Transaksi berhasil dibatalkan dan stok porsi telah dikembalikan.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }
}