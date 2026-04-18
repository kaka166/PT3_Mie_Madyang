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

            $total = $session->penjualan()->sum('total');

            $expectedCash = $session->opening_cash + $total;
            $selisih = $request->closing_cash - $expectedCash;

            $session->update([
                'ended_at' => now(),
                'total_pemasukan' => $total,
                'closing_cash' => $request->closing_cash,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sesi berhasil ditutup',
                'data' => [
                    'opening_cash' => $session->opening_cash,
                    'total_pemasukan' => $total,
                    'expected_cash' => $expectedCash,
                    'closing_cash' => $request->closing_cash,
                    'selisih' => $selisih
                ]
            ]);
        });
    }
}