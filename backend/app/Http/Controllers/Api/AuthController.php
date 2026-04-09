<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        $request->validate([
            'login'    => 'required|string',
            'password' => 'required|string',
        ]);


        $user = User::where('email', $request->login)
            ->orWhere('name', $request->login)
            ->first();


        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Kredensial (Email/Nama atau Password) salah.'
            ], 401);
        }


        $token = $user->createToken('ma_dyang_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login Berhasil',
            'data' => [
                'token' => $token,
                'user'  => $user
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil Logout'
        ]);
    }

    public function register(Request $request)
    {
        // 1. Validasi sesuai dengan JSON yang kamu kirim
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role'     => 'nullable|string',
            // 'username' & 'phone' divalidasi kalau kamu mau, 
            // tapi di sini kita simpan yang ada kolomnya saja di DB standar.
        ]);

        // 2. Simpan ke Database (Mapping field)
        $user = User::create([
            'name'     => $request->fullName, // fullName masuk ke kolom name
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            // Jika di DB kamu belum ada kolom 'role', baris di bawah ini dihapus saja:
            // 'role'  => $request->role, 
        ]);

        // 3. Buat Token
        $token = $user->createToken('ma_dyang_token')->plainTextToken;

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil didaftarkan',
            'data'    => [
                'token' => $token,
                'user'  => $user
            ]
        ], 201);
    }
}
