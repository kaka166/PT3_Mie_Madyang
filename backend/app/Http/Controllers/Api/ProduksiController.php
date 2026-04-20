<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Produksi;
use App\Models\ProduksiDetail;
use App\Models\Bahan;
use App\Models\Menu;
use Illuminate\Support\Facades\DB;

class ProduksiController extends Controller
{
    // 🔹 GET semua produksi (buat tabel)
    public function index()
    {
        $data = Produksi::with(['menu', 'details.bahan'])
            ->latest()
            ->get();

        return response()->json($data);
    }

    // 🔹 GET bahan
    public function getBahan()
    {
        return response()->json(Bahan::all());
    }

    // 🔹 GET menu
    public function getMenu()
    {
        return response()->json(Menu::where('is_active', 1)->get());
    }

    // 🔥 POST produksi
    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menu,id',
            'tanggal_produksi' => 'required|date',
            'jumlah_porsi' => 'required|integer|min:1',
            'bahan' => 'required|array|min:1',
            'bahan.*.bahan_id' => 'required|exists:bahan,id',
            'bahan.*.qty' => 'required|numeric|min:0',
            'bahan.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;

            // 🔹 hitung total HPP
            foreach ($request->bahan as $item) {
                $subtotal = $item['qty'] * $item['harga_satuan'];
                $total += $subtotal;
            }

            $hpp = $total / $request->jumlah_porsi;

            // 🔹 simpan produksi
            $produksi = Produksi::create([
                'menu_id' => $request->menu_id,
                'tanggal_produksi' => $request->tanggal_produksi,
                'jumlah_porsi' => $request->jumlah_porsi,
                'hpp_per_porsi' => $hpp,
                'created_by' => 1 // nanti bisa pakai auth()
            ]);

            // 🔹 simpan detail bahan
            foreach ($request->bahan as $item) {

                if (!$item['bahan_id']) continue;

                $subtotal = $item['qty'] * $item['harga_satuan'];

                ProduksiDetail::create([
                    'produksi_id' => $produksi->id,
                    'bahan_id' => $item['bahan_id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal' => $subtotal
                ]);
            }

            Menu::where('id', $request->menu_id)
                ->update(['hpp_default' => $hpp]);

            DB::commit();

            return response()->json([
                'message' => 'Produksi berhasil disimpan',
                'hpp_per_porsi' => $hpp,
                'data' => Produksi::with('details.bahan')->find($produksi->id)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal simpan produksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔥 OPTIONAL (buat detail modal nanti)
    public function show($id)
    {
        $data = Produksi::with(['menu', 'details.bahan'])->findOrFail($id);

        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $produksi = Produksi::findOrFail($id);

            $total = 0;

            foreach ($request->bahan as $item) {
                $subtotal = $item['qty'] * $item['harga_satuan'];
                $total += $subtotal;
            }

            $hpp = $total / $request->jumlah_porsi;

            // 🔥 update produksi
            $produksi->update([
                'menu_id' => $request->menu_id,
                'tanggal_produksi' => $request->tanggal_produksi,
                'jumlah_porsi' => $request->jumlah_porsi,
                'hpp_per_porsi' => $hpp,
            ]);

            // 🔥 hapus detail lama
            ProduksiDetail::where('produksi_id', $id)->delete();

            // 🔥 insert ulang detail
            foreach ($request->bahan as $item) {
                ProduksiDetail::create([
                    'produksi_id' => $id,
                    'bahan_id' => $item['bahan_id'],
                    'qty' => $item['qty'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal' => $item['qty'] * $item['harga_satuan']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Produksi berhasil diupdate'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}