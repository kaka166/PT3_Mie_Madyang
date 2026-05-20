<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // ==========================================
    // 1. GET STATUS ABSENSI HARI INI
    // ==========================================
    public function status()
    {
        $userId = Auth::id();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $userId)
            ->where('tanggal', $today)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'checked_in' => $attendance ? true : false,
                'checked_out' => ($attendance && $attendance->jam_keluar) ? true : false,
                'attendance' => $attendance
            ]
        ]);
    }

    // ==========================================
    // 2. ABSEN MASUK (CLOCK IN)
    // ==========================================
    public function checkIn(Request $request)
    {
        $userId = Auth::id();
        $today = now()->toDateString();

        // Cek apakah sudah ada absensi hari ini
        $already = Attendance::where('user_id', $userId)
            ->where('tanggal', $today)
            ->exists();

        if ($already) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen masuk hari ini!'
            ], 400);
        }

        $request->validate([
            'keterangan' => 'nullable|string',
            'status' => 'nullable|string|in:hadir,izin,sakit'
        ]);

        $attendance = Attendance::create([
            'user_id' => $userId,
            'tanggal' => $today,
            'jam_masuk' => now()->toTimeString(),
            'status' => $request->status ?? 'hadir',
            'keterangan' => $request->keterangan
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen masuk berhasil direkam!',
            'data' => $attendance
        ], 201);
    }

    // ==========================================
    // 3. ABSEN KELUAR (CLOCK OUT)
    // ==========================================
    public function checkOut(Request $request)
    {
        $userId = Auth::id();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $userId)
            ->where('tanggal', $today)
            ->first();

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan lakukan absen masuk terlebih dahulu!'
            ], 400);
        }

        if ($attendance->jam_keluar) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen keluar hari ini!'
            ], 400);
        }

        $attendance->update([
            'jam_keluar' => now()->toTimeString()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Absen keluar berhasil direkam!',
            'data' => $attendance
        ]);
    }

    // ==========================================
    // 4. RIWAYAT ABSENSI
    // ==========================================
    public function history()
    {
        $user = Auth::user();

        // Jika Admin (Role 1), ambil semua riwayat absensi beserta nama staf
        if ($user->role === 1) {
            $data = Attendance::with('user')
                ->latest('tanggal')
                ->get();
        } else {
            // Jika staf biasa (Role 2 / 3), ambil riwayat absensinya sendiri
            $data = Attendance::where('user_id', $user->id)
                ->latest('tanggal')
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
}
