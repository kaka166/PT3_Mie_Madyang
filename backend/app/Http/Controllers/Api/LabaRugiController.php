<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use App\Models\HppHistory;
use App\Models\Penjualan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabaRugiController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $pemasukanQuery = Pemasukan::query();
        $pengeluaranQuery = Pengeluaran::query();
        $penjualanQuery = Penjualan::where('status', 'done');

        if ($startDate) {
            $pemasukanQuery->whereDate('waktu', '>=', $startDate);
            $pengeluaranQuery->whereDate('tanggal', '>=', $startDate);
            $penjualanQuery->whereDate('tanggal', '>=', $startDate);
        }
        if ($endDate) {
            $pemasukanQuery->whereDate('waktu', '<=', $endDate);
            $pengeluaranQuery->whereDate('tanggal', '<=', $endDate);
            $penjualanQuery->whereDate('tanggal', '<=', $endDate);
        }

        $totalPemasukan = $pemasukanQuery->sum('total');
        $totalPengeluaran = $pengeluaranQuery->sum('jumlah');

        $totalPenjualan = $penjualanQuery->sum('total');
        $totalPorsiTerjual = $penjualanQuery->withSum('detail as qty_sum', 'qty')->get()->sum('qty_sum');

        $hppTerbaru = HppHistory::latest()->first();
        $hppPerPorsi = $hppTerbaru ? $hppTerbaru->total_hpp : 0;
        $totalHpp = $hppPerPorsi * $totalPorsiTerjual;

        $labaKotor = $totalPenjualan - $totalHpp;
        $labaBersih = $labaKotor - $totalPengeluaran;

        $riwayatPemasukan = $pemasukanQuery->latest()->get()->map(function ($p) {
            return [
                'id' => '#' . $p->id,
                'nama' => $p->nama,
                'total' => $p->total,
                'waktu' => $p->waktu,
                'metode' => $p->metode,
            ];
        });

        $riwayatPengeluaran = $pengeluaranQuery->latest()->get()->map(function ($p) {
            return [
                'id' => '#' . $p->id,
                'nama' => $p->nama_pengeluaran,
                'kategori' => $p->kategori ?? 'Operasional',
                'total' => $p->jumlah,
                'tanggal' => $p->tanggal,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'ringkasan' => [
                    'total_penjualan' => $totalPenjualan,
                    'total_pemasukan' => $totalPemasukan,
                    'total_pengeluaran' => $totalPengeluaran,
                    'total_hpp' => $totalHpp,
                    'hpp_per_porsi' => $hppPerPorsi,
                    'total_porsi_terjual' => $totalPorsiTerjual,
                    'laba_kotor' => $labaKotor,
                    'laba_bersih' => $labaBersih,
                ],
                'riwayat_pemasukan' => $riwayatPemasukan,
                'riwayat_pengeluaran' => $riwayatPengeluaran,
            ]
        ]);
    }
}
