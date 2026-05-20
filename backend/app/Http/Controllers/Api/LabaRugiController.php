<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use App\Models\Penjualan;
use App\Models\PenjualanDetail;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LabaRugiController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        // ── Pemasukan ──────────────────────────────────────
        $pemasukanQuery = Pemasukan::query();
        if ($startDate) $pemasukanQuery->whereDate('waktu', '>=', $startDate);
        if ($endDate)   $pemasukanQuery->whereDate('waktu', '<=', $endDate);
        $totalPemasukan = (clone $pemasukanQuery)->sum('total');

        // ── Pengeluaran ────────────────────────────────────
        $pengeluaranQuery = Pengeluaran::query();
        if ($startDate) $pengeluaranQuery->whereDate('tanggal', '>=', $startDate);
        if ($endDate)   $pengeluaranQuery->whereDate('tanggal', '<=', $endDate);
        $totalPengeluaran = (clone $pengeluaranQuery)->sum('jumlah');

        // ── Penjualan selesai ──────────────────────────────
        $penjualanQuery = Penjualan::where('status', 'done');
        if ($startDate) $penjualanQuery->whereDate('tanggal', '>=', $startDate);
        if ($endDate)   $penjualanQuery->whereDate('tanggal', '<=', $endDate);

        $totalPenjualan    = (clone $penjualanQuery)->sum('total');
        $penjualanIds      = (clone $penjualanQuery)->pluck('id');

        // Total porsi terjual
        $totalPorsiTerjual = PenjualanDetail::whereIn('penjualan_id', $penjualanIds)->sum('qty');

        // ── HPP per menu dari kolom hpp_default ────────────
        $perMenu = PenjualanDetail::whereIn('penjualan_id', $penjualanIds)
            ->select('menu_id', DB::raw('SUM(qty) as total_qty'))
            ->groupBy('menu_id')
            ->get();

        $menuHpps  = Menu::pluck('hpp_default', 'id');
        $totalHpp  = $perMenu->sum(fn($item) => ($menuHpps[$item->menu_id] ?? 0) * $item->total_qty);
        $hppPerPorsi = $totalPorsiTerjual > 0 ? round($totalHpp / $totalPorsiTerjual, 2) : 0;

        $labaKotor = $totalPenjualan - $totalHpp;
        $labaBersih = $labaKotor - $totalPengeluaran;

        // ── Riwayat ────────────────────────────────────────
        $riwayatPemasukan = (clone $pemasukanQuery)->latest('waktu')->take(50)->get()->map(function ($p) {
            return [
                'id'     => '#' . $p->id,
                'nama'   => $p->nama,
                'total'  => $p->total,
                'waktu'  => $p->waktu,
                'metode' => $p->metode,
            ];
        });

        $riwayatPengeluaran = (clone $pengeluaranQuery)->latest('tanggal')->take(50)->get()->map(function ($p) {
            return [
                'id'       => '#' . $p->id,
                'nama'     => $p->nama_pengeluaran,
                'kategori' => $p->kategori ?? 'Operasional',
                'total'    => $p->jumlah,
                'tanggal'  => $p->tanggal,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => [
                'ringkasan' => [
                    'total_penjualan'    => $totalPenjualan,
                    'total_pemasukan'    => $totalPemasukan,
                    'total_pengeluaran'  => $totalPengeluaran,
                    'total_hpp'          => $totalHpp,
                    'hpp_per_porsi'      => $hppPerPorsi,
                    'total_porsi_terjual' => $totalPorsiTerjual,
                    'laba_kotor'         => $labaKotor,
                    'laba_bersih'        => $labaBersih,
                ],
                'riwayat_pemasukan'   => $riwayatPemasukan,
                'riwayat_pengeluaran' => $riwayatPengeluaran,
            ]
        ]);
    }
}
