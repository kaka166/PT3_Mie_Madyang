<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PosSession;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{

    public function active()
    {
        $session = PosSession::where('user_id', Auth::id())
            ->whereNull('ended_at')
            ->latest()
            ->first();

        return response()->json([
            'data' => $session
        ]);
    }
    public function getAllActive()
    {
        $sessions = PosSession::with(['user' => function ($q) {
                $q->withTrashed()->select('id', 'name', 'username', 'role');
            }])
            ->whereNull('ended_at')
            ->latest('started_at')
            ->get()
            ->map(function ($s) {
                $totalTransaksi = $s->penjualan()->where('status', 'done')->count();
                $totalPemasukan = $s->penjualan()->where('status', 'done')->sum('total');
                return [
                    'id'              => $s->id,
                    'user_id'         => $s->user_id,
                    'user_name'       => $s->user ? $s->user->name : 'Unknown',
                    'user_role'       => $s->user ? $s->user->role : null,
                    'started_at'      => $s->started_at,
                    'opening_cash'    => $s->opening_cash,
                    'total_transaksi' => $totalTransaksi,
                    'total_pemasukan' => $totalPemasukan,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $sessions,
        ]);
    }

    public function startSession(Request $request)
    {
        // 🔥 HANDLE USER
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'opening_cash' => 'required|integer|min:0'
        ]);

        $existing = PosSession::where('user_id', Auth::id())
            ->whereNull('ended_at')
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Masih ada sesi aktif'
            ], 400);
        }

        $session = PosSession::create([
            'user_id' => Auth::id(),
            'started_at' => now(),
            'opening_cash' => $request->opening_cash
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sesi berhasil dimulai',
            'data' => $session
        ]);
    }

    public function lastRecap()
    {
        $session = PosSession::where('user_id', Auth::id())
            ->whereNotNull('ended_at')
            ->latest()
            ->first();

        if (!$session) {
            return response()->json(['data' => null]);
        }

        return response()->json([
            'data' => [
                'opening_cash' => $session->opening_cash,
                'total_pemasukan' => $session->total_pemasukan,
                'total_pengeluaran' => $session->total_pengeluaran,
                'closing_cash' => $session->closing_cash,
                'ended_at' => $session->ended_at,
            ]
        ]);
    }

    public function endSession(Request $request)
    {
        // 🔥 HANDLE USER
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->validate([
            'closing_cash' => 'required|integer|min:0'
        ]);

        return DB::transaction(function () use ($request) {

            $session = PosSession::where('user_id', Auth::id())
                ->whereNull('ended_at')
                ->latest()
                ->first();

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada sesi aktif'
                ], 400);
            }

            $totalPenjualan = $session->penjualan()->sum('total');
            $totalPengeluaran = $session->pengeluaran()->sum('jumlah');

            $expectedCash = $session->opening_cash + $totalPenjualan - $totalPengeluaran;
            $selisih = $request->closing_cash - $expectedCash;

            $session->update([
                'ended_at' => now(),
                'total_pemasukan' => $totalPenjualan,
                'total_pengeluaran' => $totalPengeluaran,
                'closing_cash' => $request->closing_cash,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sesi berhasil ditutup',
                'data' => [
                    'opening_cash' => $session->opening_cash,
                    'total_pemasukan' => $totalPenjualan,
                    'total_pengeluaran' => $totalPengeluaran,
                    'expected_cash' => $expectedCash,
                    'closing_cash' => $request->closing_cash,
                    'selisih' => $selisih
                ]
            ]);
        });
    }
}