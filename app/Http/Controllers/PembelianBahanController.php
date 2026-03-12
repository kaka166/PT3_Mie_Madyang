<?php

namespace App\Http\Controllers;

use App\Models\PembelianBahan;
use App\Models\StokBahan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Wajib di-import untuk transaction

class PembelianBahanController extends Controller
{
    public function index()
    {
        return PembelianBahan::with('bahan')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'bahan_id' => 'required|exists:bahan,id',
            'qty' => 'required|numeric|min:0.1',
            'harga_total' => 'required|numeric|min:0',
            'user_id' => 'required|exists:users,id', // Siapa yang catat (Dapur/Kasir)
            'tanggal' => 'required|date'
        ]);

        $harga_per_satuan = $request->harga_total / $request->qty;

        DB::beginTransaction();

        try {
            PembelianBahan::create([
                'bahan_id' => $request->bahan_id,
                'qty' => $request->qty,
                'harga_total' => $request->harga_total,
                'harga_per_satuan' => $harga_per_satuan,
                'user_id' => $request->user_id,
                'tanggal' => $request->tanggal
            ]);

            $stok = StokBahan::firstOrCreate(
                ['bahan_id' => $request->bahan_id],
                ['qty' => 0] 
            );

            $stok->qty += $request->qty;
            $stok->save();

            DB::commit();

            return "Pembelian berhasil dicatat dan stok bahan otomatis bertambah.";

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem: ' . $e->getMessage()], 500);
        }
    }
}