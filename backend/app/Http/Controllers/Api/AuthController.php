<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PosSession;
use App\Models\Penjualan;
use App\Models\Pemasukan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->login)
            ->orWhere('email', $request->login)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Username/Email atau password salah.'
            ], 401);
        }

        $token = $user->createToken('ma_dyang_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => $token,
                'user' => $user
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $session = PosSession::where('user_id', $user->id)
            ->whereNull('ended_at')
            ->latest()
            ->first();

        $recap = null;

        if ($session) {
            $penjualan = Penjualan::where('session_id', $session->id)
                ->where('status', 'done')
               ->get();

            $totalPenjualan = $penjualan->sum('total');
            $totalTransaksi = $penjualan->count();

            $recap = [
                'session_id' => $session->id,
                'total_penjualan' => $totalPenjualan,
                'total_transaksi' => $totalTransaksi,
                'message' => 'Sesi masih aktif! Tutup sesi terlebih dahulu untuk rekap lengkap.'
            ];
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Logout',
            'recap' => $recap
        ]);
    }

    public function register(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users,username',
            'fullName' => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'phone'    => 'nullable|string',
            'password' => 'required|string|min:8',
            'role'     => 'nullable|integer|in:1,2,3',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validasi gagal, lur!',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'username' => $request->username,
                'name'     => $request->fullName,
                'email'    => $request->email,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
                'role'     => $request->role ?? 2,
            ]);

            $token = $user->createToken('ma_dyang_token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'User berhasil didaftarkan!',
                'data'    => [
                    'token' => $token,
                    'user'  => $user
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Gagal mendaftar: ' . $e->getMessage()
            ], 500);
        }
    }
}
