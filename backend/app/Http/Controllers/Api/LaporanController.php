<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use App\Models\Penjualan;
use App\Models\PosSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class LaporanController extends Controller
{
    public function pemasukanDetail(Request $request)
    {
        $query = Pemasukan::with('penjualan.detail.menu', 'penjualan.user');

        if ($request->user_id) {
            $query->whereHas('penjualan', function ($q) use ($request) {
                $q->where('user_id', $request->user_id);
            });
        }

        if ($request->start_date) {
            $query->whereDate('waktu', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('waktu', '<=', $request->end_date);
        }

        if ($request->metode) {
            $query->where('metode', $request->metode);
        }

        $data = $query->latest()->get()->map(function ($p) {
            $penjualan = $p->penjualan;
            return [
                'id' => '#' . $p->id,
                'no_transaksi' => '#' . $p->penjualan_id,
                'nama' => $penjualan->customer_name ?? 'Guest',
                'waktu' => $p->waktu,
                'kasir' => $p->kasir,
                'kasir_id' => $penjualan->user_id ?? null,
                'metode' => $p->metode,
                'jumlah' => $p->total,
                'items' => $penjualan->detail->map(function ($d) {
                    return [
                        'nama_menu' => $d->menu->nama_menu ?? '-',
                        'qty' => $d->qty,
                        'harga' => $d->harga,
                        'subtotal' => $d->subtotal,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function pengeluaranDetail(Request $request)
    {
        $query = Pengeluaran::with(['user' => function ($q) {
            $q->withTrashed();
        }]);

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->start_date) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }

        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        $data = $query->latest()->get()->map(function ($item) {
            $user = $item->user;
            return [
                'id' => '#' . str_pad($item->id, 5, '0', STR_PAD_LEFT),
                'nama' => $item->nama_pengeluaran,
                'kategori' => $item->kategori ?? 'Operasional',
                'deskripsi' => $item->deskripsi ?? '',
                'user_id' => $user ? $user->name : 'Unknown',
                'waktu' => $item->tanggal,
                'jumlah' => $item->jumlah,
                'evidence_file' => $item->evidence_file,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function getUsers()
    {
        $users = User::select('id', 'username', 'name', 'email', 'phone', 'role')->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function getShifts(Request $request)
    {
        $query = PosSession::with(['user' => function ($q) {
            $q->withTrashed();
        }]);

        if ($request->start_date) {
            $query->whereDate('started_at', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('started_at', '<=', $request->end_date);
        }

        $data = $query->latest('started_at')->get()->map(function ($s) {
            $durasi = '-';
            if ($s->ended_at) {
                $diff = $s->started_at->diff($s->ended_at);
                $jam = $diff->h + ($diff->days * 24);
                $menit = $diff->i;
                $durasi = $jam > 0 ? "{$jam}j {$menit}m" : "{$menit}m";
            }

            $user = $s->user;

            return [
                'id'                => '#' . $s->id,
                'user_id'           => $s->user_id,
                'nama'              => $user ? $user->name : 'Unknown',
                'role'              => $user ? $user->role : null,
                'mulai'             => $s->started_at,
                'selesai'           => $s->ended_at,
                'durasi'            => $durasi,
                'opening_cash'      => $s->opening_cash ?? 0,
                'total_pemasukan'   => $s->total_pemasukan,
                'total_pengeluaran' => $s->total_pengeluaran,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function getMenuItems()
    {
        $items = \App\Models\Menu::select('id', 'nama_menu')->get();
        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function downloadEvidence(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', now()->toDateString());
        $type = $request->query('type', 'all');

        $zip = new ZipArchive();
        $zipFileName = 'evidence_' . $startDate . '_' . $endDate . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFileName);

        if (!is_dir(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return response()->json(['success' => false, 'message' => 'Gagal membuat file ZIP'], 500);
        }

        $addedCount = 0;

        if ($type === 'all' || $type === 'pengeluaran') {
            $pengeluaranData = Pengeluaran::whereNotNull('evidence_file')
                ->whereDate('tanggal', '>=', $startDate)
                ->whereDate('tanggal', '<=', $endDate)
                ->get();

            foreach ($pengeluaranData as $item) {
                $filePath = 'evidence/pengeluaran/' . $item->evidence_file;
                if (Storage::disk('public')->exists($filePath)) {
                    $zip->addFile(
                        Storage::disk('public')->path($filePath),
                        'pengeluaran/' . $item->evidence_file
                    );
                    $addedCount++;
                }
            }
        }

        if ($type === 'all' || $type === 'pemasukan') {
            $pemasukanData = Pemasukan::whereNotNull('evidence_file')
                ->whereDate('waktu', '>=', $startDate)
                ->whereDate('waktu', '<=', $endDate)
                ->get();

            foreach ($pemasukanData as $item) {
                $filePath = 'evidence/pemasukan/' . $item->evidence_file;
                if (Storage::disk('public')->exists($filePath)) {
                    $zip->addFile(
                        Storage::disk('public')->path($filePath),
                        'pemasukan/' . $item->evidence_file
                    );
                    $addedCount++;
                }
            }
        }

        $zip->close();

        if ($addedCount === 0) {
            unlink($zipPath);
            return response()->json(['success' => false, 'message' => 'Tidak ada evidence untuk periode ini'], 404);
        }

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
