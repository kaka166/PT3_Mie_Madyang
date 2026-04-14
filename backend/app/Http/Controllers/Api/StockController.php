<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StokMovement;
use App\Models\StokBahan;
use App\Models\Bahan;

class StockController extends Controller
{
    // ==========================
    // GET: List Bahan
    // ==========================
    public function bahan()
    {
        $data = Bahan::leftJoin('stok_bahan', 'bahan.id', '=', 'stok_bahan.bahan_id')
            ->select(
                'bahan.id',
                'bahan.nama_bahan as nama',
                'bahan.satuan',
                'stok_bahan.qty'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'satuan' => $item->satuan,
                    'qty' => $item->qty ?? 0
                ];
            });

        return response()->json($data);
    }

    // ==========================
    // GET: History per bahan
    // ==========================
    public function history($bahan_id)
    {
        $data = StokMovement::where('bahan_id', $bahan_id)
            ->latest()
            ->get();

        return response()->json($data);
    }

    // ==========================
    // POST: Penyesuaian / Restock / Produksi
    // ==========================
    public function store(Request $request)
    {
        // ==========================
        // HANDLE BAHAN BARU DULU
        // ==========================
        $bahanId = $request->bahan_id;

        if (!$bahanId) {
            $bahan = \App\Models\Bahan::create([
                'nama_bahan' => $request->nama,
                'satuan' => $request->satuan ?? 'Kg'
            ]);

            $bahanId = $bahan->id;
        }

        // ==========================
        // VALIDASI (SETELAH ADA bahan_id)
        // ==========================
        $data = $request->validate([
            'jumlah' => 'required|numeric',
            'tipe' => 'required|in:plus,minus',
            'satuan' => 'required|string',
            'kategori' => 'required|string',
            'alasan' => 'nullable|string',
        ]);

        $data['bahan_id'] = $bahanId;

        // ==========================
        // SIMPAN HISTORI
        // ==========================
        $movement = StokMovement::create([
            ...$data,
            'user_id' => 1
        ]);

        // ==========================
        // UPDATE STOK
        // ==========================
        $stok = StokBahan::where('bahan_id', $bahanId)->first();

        if (!$stok) {
            $stok = StokBahan::create([
                'bahan_id' => $bahanId,
                'qty' => 0
            ]);
        }

        if ($data['tipe'] === 'plus') {
            $stok->qty += $data['jumlah'];
        } else {
            $stok->qty -= $data['jumlah'];
        }

        $stok->save();

        // ==========================
        // RESPONSE
        // ==========================
        return response()->json([
            'message' => 'Berhasil disimpan',
            'data' => $movement
        ]);
    }

    public function produksi(Request $request)
    {
        $data = $request->validate([
            'hasil_id' => 'required|exists:bahan,id',
            'jumlah_hasil' => 'required|numeric',
            'satuan' => 'required|string',
            'bahan' => 'required|array'
        ]);

        // =========================
        // 1. TAMBAH STOCK HASIL
        // =========================
        $stokHasil = StokBahan::where('bahan_id', $data['hasil_id'])->first();
        if (!$stokHasil) {
            $stokHasil = StokBahan::create([
                'bahan_id' => $data['hasil_id'],
                'qty' => 0
            ]);
        }

        $stokHasil->qty += $data['jumlah_hasil'];
        $stokHasil->save();

        // simpan history hasil
        StokMovement::create([
            'bahan_id' => $data['hasil_id'],
            'jumlah' => $data['jumlah_hasil'],
            'tipe' => 'plus',
            'kategori' => 'produksi',
            'satuan' => $data['satuan'],
            'alasan' => 'Produksi',
            'user_id' => 1
        ]);

        // =========================
        // 2. KURANGI BAHAN BAKU
        // =========================
        foreach ($data['bahan'] as $bahan) {

            $stok = StokBahan::where('bahan_id', $bahan['id'])->first();

            $stok->qty -= $bahan['jumlah'];
            $stok->save();

            StokMovement::create([
                'bahan_id' => $bahan['id'],
                'jumlah' => $bahan['jumlah'],
                'tipe' => 'minus',
                'kategori' => 'produksi',
                'satuan' => $bahan['satuan'],
                'alasan' => 'Produksi',
                'user_id' => 1
            ]);
        }

        return response()->json(['message' => 'Produksi berhasil']);
    }

    public function stockList()
    {
        $data = \App\Models\Bahan::leftJoin('stok_bahan', 'bahan.id', '=', 'stok_bahan.bahan_id')
            ->select(
                'bahan.id',
                'bahan.nama_bahan as nama',
                'bahan.satuan',
                'stok_bahan.qty'
            )
            ->get()
            ->map(function ($item) {

                $qty = $item->qty ?? 0;

                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'jumlah' => $qty . ' ' . $item->satuan,
                    'status' => $qty <= 5 ? 'Kritis' : 'Aman',
                ];
            });

        return response()->json($data);
    }
    public function stockHistory()
    {
        $data = \App\Models\StokMovement::join('bahan', 'stok_movements.bahan_id', '=', 'bahan.id')
            ->select(
                'stok_movements.id',
                'stok_movements.bahan_id as itemId',
                'bahan.nama_bahan as nama',
                'stok_movements.kategori as tipe',
                'stok_movements.alasan',
                'stok_movements.jumlah',
                'stok_movements.satuan',
                'stok_movements.created_at',
                'stok_movements.user_id'
            )
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => '#' . str_pad($item->id, 6, '0', STR_PAD_LEFT),
                    'itemId' => $item->itemId,
                    'nama' => $item->nama,
                    'tipe' => ucfirst($item->tipe),
                    'alasan' => $item->alasan ?? '-',
                    'kuantiti' => $item->jumlah . ' ' . $item->satuan,
                    'waktu' => $item->created_at,
                    'pembuat' => 'User', // sementara
                ];
            });

        return response()->json($data);
    }
}