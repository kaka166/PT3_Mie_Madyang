<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StokMovement;
use App\Models\StokBahan;
use App\Models\Bahan;
use App\Models\Pengeluaran;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
                'stok_bahan.qty',
                'bahan.stock_limit',
                'bahan.harga'
            )
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'satuan' => $item->satuan,
                    'qty' => $item->qty ?? 0,
                    'stock_limit' => $item->stock_limit ?? 5,
                    'harga' => $item->harga ?? 0,
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
        DB::beginTransaction();

        try {
            // ==========================
            // HANDLE BAHAN BARU DULU
            // ==========================
            $bahanId = $request->bahan_id;

            if (!$bahanId) {
                $bahan = Bahan::create([
                    'nama_bahan' => $request->nama,
                    'satuan' => $request->satuan ?? 'Kg',
                    'stock_limit' => $request->stock_limit ?? 5,
                    'harga' => $request->harga ?? 0,
                ]);

                $bahanId = $bahan->id;
            }

            if ($bahanId && $request->stock_limit !== null) {
                Bahan::where('id', $bahanId)->update([
                    'stock_limit' => $request->stock_limit
                ]);
            }

            if ($bahanId && $request->harga !== null) {
                Bahan::where('id', $bahanId)->update([
                    'harga' => $request->harga
                ]);
            }

            // ==========================
            // VALIDASI (SETELAH ADA bahan_id)
            // ==========================
            $data = $request->validate([
                'jumlah' => 'required|numeric|min:0',
                'tipe' => 'required|in:plus,minus',
                'satuan' => 'required|string',
                'kategori' => 'required|string',
                'alasan' => 'nullable|string',
                'stock_limit' => 'nullable|integer|min:0',
                'harga' => 'nullable|numeric|min:0',
            ]);

            $data['bahan_id'] = $bahanId;

            // ==========================
            // SIMPAN HISTORI
            // ==========================
            $movement = StokMovement::create([
                ...$data,
                'user_id' => Auth::id()
            ]);

            // ==========================
            // MASUKKAN KE PENGELUARAN (KHUSUS RESTOCK)
            // ==========================
            if ($request->kategori === 'restock') {
                Pengeluaran::create([
                    'nama_pengeluaran' => $request->nama ?? 'Restock Bahan',
                    'jumlah' => ($request->harga ?? 0) * $request->jumlah,
                    'user_id' => Auth::id(),
                    'tanggal' => now()->toDateString(),
                ]);
            }

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
                if ($stok->qty < $data['jumlah']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Stok tidak mencukupi. Sisa stok: ' . $stok->qty . ' ' . $data['satuan']
                    ], 400);
                }
                $stok->qty -= $data['jumlah'];
            }

            $stok->save();
            DB::commit();

            return response()->json([
                'message' => 'Berhasil disimpan',
                'data' => $movement
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan stok'], 500);
        }
    }

    public function produksi(Request $request)
    {
        $data = $request->validate([
            'hasil_id' => 'required|exists:bahan,id',
            'jumlah_hasil' => 'required|numeric|min:0',
            'satuan' => 'required|string',
            'bahan' => 'required|array',
            'bahan.*.id' => 'required|exists:bahan,id',
            'bahan.*.jumlah' => 'required|numeric|min:0',
            'bahan.*.satuan' => 'required|string',
        ]);

        DB::beginTransaction();

        try {
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

            StokMovement::create([
                'bahan_id' => $data['hasil_id'],
                'jumlah' => $data['jumlah_hasil'],
                'tipe' => 'plus',
                'kategori' => 'produksi',
                'satuan' => $data['satuan'],
                'alasan' => 'Produksi',
                'user_id' => Auth::id()
            ]);

            // =========================
            // 2. KURANGI BAHAN BAKU
            // =========================
            foreach ($data['bahan'] as $bahan) {
                $stok = StokBahan::where('bahan_id', $bahan['id'])->first();

                if (!$stok || $stok->qty < $bahan['jumlah']) {
                    DB::rollBack();
                    $nama = Bahan::find($bahan['id'])->nama_bahan ?? 'Unknown';
                    return response()->json([
                        'message' => "Stok bahan '$nama' tidak mencukupi."
                    ], 400);
                }

                $stok->qty -= $bahan['jumlah'];
                $stok->save();

                StokMovement::create([
                    'bahan_id' => $bahan['id'],
                    'jumlah' => $bahan['jumlah'],
                    'tipe' => 'minus',
                    'kategori' => 'produksi',
                    'satuan' => $bahan['satuan'],
                    'alasan' => 'Produksi',
                    'user_id' => Auth::id()
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Produksi berhasil']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyimpan produksi'], 500);
        }
    }

    public function stockList()
    {
        $data = \App\Models\Bahan::leftJoin('stok_bahan', 'bahan.id', '=', 'stok_bahan.bahan_id')
            ->select(
                'bahan.id',
                'bahan.nama_bahan as nama',
                'bahan.satuan',
                'stok_bahan.qty',
                'bahan.stock_limit'
            )
            ->get()
            ->map(function ($item) {

                $qty = $item->qty ?? 0;

                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'jumlah' => $qty . ' ' . $item->satuan,
                    'stock_limit' => $item->stock_limit ?? 5,
                    'status' => $qty <= ($item->stock_limit ?? 5) ? 'Kritis' : 'Aman',
                ];
            });

        return response()->json($data);
    }
    public function stockHistory()
    {
        $data = \App\Models\StokMovement::with(['user' => function ($q) {
            $q->withTrashed();
        }])
            ->join('bahan', 'stok_movements.bahan_id', '=', 'bahan.id')
            ->select(
                'stok_movements.id',
                'stok_movements.bahan_id as itemId',
                'bahan.nama_bahan as nama',
                'stok_movements.kategori as tipe',
                'stok_movements.alasan',
                'stok_movements.jumlah',
                'stok_movements.satuan',
                'stok_movements.created_at',
                'stok_movements.user_id',
            )
            ->latest()
            ->get()
            ->map(function ($item) {
                $user = $item->user;
                return [
                    'id' => '#' . str_pad($item->id, 3, '0', STR_PAD_LEFT),
                    'itemId' => $item->itemId,
                    'nama' => $item->nama,
                    'tipe' => ucfirst($item->tipe),
                    'alasan' => $item->alasan ?? '-',
                    'kuantiti' => $item->jumlah . ' ' . $item->satuan,
                    'waktu' => $item->created_at,
                    'pembuat' => $user ? $user->name : 'Unknown',
                ];
            });

        return response()->json($data);
    }
}