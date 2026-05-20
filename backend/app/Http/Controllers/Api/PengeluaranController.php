<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengeluaran::with(['user' => function ($q) {
            $q->withTrashed();
        }])->latest();

        if ($request->start_date) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }
        if ($request->kategori) {
            $query->where('kategori', $request->kategori);
        }
        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        $data = $query->get()->map(function ($item) {
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

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pengeluaran' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'kategori' => 'nullable|string|max:100',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'nullable|date',
            'session_id' => 'nullable|integer|exists:pos_sessions,id',
            'evidence' => 'nullable|file|mimes:jpg,jpeg,png,pdf,zip|max:10240',
        ]);

        $data = [
            'nama_pengeluaran' => $request->nama_pengeluaran,
            'jumlah' => $request->jumlah,
            'user_id' => Auth::id(),
            'session_id' => $request->session_id,
            'tanggal' => $request->tanggal ?? now()->toDateString(),
            'kategori' => $request->kategori ?? 'Operasional',
            'deskripsi' => $request->deskripsi ?? '',
        ];

        if ($request->hasFile('evidence')) {
            $file = $request->file('evidence');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('evidence/pengeluaran', $filename, 'public');
            $data['evidence_file'] = $filename;
        }

        $pengeluaran = Pengeluaran::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil dicatat',
            'data' => $pengeluaran
        ], 201);
    }

    public function harian(Request $request)
    {
        $tanggal = $request->query('tanggal', now()->toDateString());

        $pengeluaran = Pengeluaran::whereDate('tanggal', $tanggal)
            ->with(['user' => function ($q) {
                $q->withTrashed();
            }])
            ->latest()
            ->get()
            ->map(function ($item) {
                $user = $item->user;
                return [
                    'id' => '#' . str_pad($item->id, 5, '0', STR_PAD_LEFT),
                    'nama' => $item->nama_pengeluaran,
                    'kategori' => $item->kategori ?? 'Operasional',
                    'jumlah' => $item->jumlah,
                    'user' => $user ? $user->name : 'Unknown',
                    'waktu' => $item->tanggal,
                ];
            });

        $total = Pengeluaran::whereDate('tanggal', $tanggal)->sum('jumlah');

        return response()->json([
            'success' => true,
            'tanggal' => $tanggal,
            'total' => $total,
            'data' => $pengeluaran
        ]);
    }
}
