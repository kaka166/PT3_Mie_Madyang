<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuKategoriController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaxSettingController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\ProduksiController;
use App\Http\Controllers\Api\PengeluaranController;
use App\Http\Controllers\Api\HppCalculatorController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\LabaRugiController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\QrisSettingController;
use App\Http\Controllers\Api\EvidenceController;
use App\Http\Controllers\Api\LandingPageSettingController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (NO AUTH)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login-error', [AuthController::class, 'unauthenticated'])->name('login');
Route::get('/landing-page', [LandingPageSettingController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY (ROLE 1)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:1')->group(function () {

        // Menu Management
        Route::post('/menu', [MenuController::class, 'store']);
        Route::put('/menu/{id}', [MenuController::class, 'update']);
        Route::delete('/menu/{id}', [MenuController::class, 'destroy']);
        Route::put('/menu/{id}/toggle', [MenuController::class, 'toggle']);

        // Kategori
        Route::post('/kategori', [MenuKategoriController::class, 'store']);
        Route::put('/kategori/{id}', [MenuKategoriController::class, 'update']);
        Route::delete('/kategori/{id}', [MenuKategoriController::class, 'destroy']);
        Route::put('/kategori/{id}/toggle', [MenuKategoriController::class, 'toggleStatus']);
        Route::get('/hpp-history', [HppCalculatorController::class, 'index']);
        Route::post('/calculate-hpp', [HppCalculatorController::class, 'store']);
        Route::put('/hpp-history/{id}', [HppCalculatorController::class, 'update']);

        // Laba Rugi
        Route::get('/laba-rugi', [LabaRugiController::class, 'index']);

        // Laporan Detail
        Route::get('/laporan/pemasukan', [LaporanController::class, 'pemasukanDetail']);
        Route::get('/laporan/pengeluaran', [LaporanController::class, 'pengeluaranDetail']);
        Route::get('/laporan/users', [LaporanController::class, 'getUsers']);
        Route::get('/laporan/menu-items', [LaporanController::class, 'getMenuItems']);
        Route::get('/laporan/shifts', [LaporanController::class, 'getShifts']);
        Route::get('/laporan/download-evidence', [LaporanController::class, 'downloadEvidence']);

        // QRIS Settings
        Route::post('/qris-settings', [QrisSettingController::class, 'store']);
        Route::put('/qris-settings/{id}', [QrisSettingController::class, 'update']);
        Route::delete('/qris-settings/{id}', [QrisSettingController::class, 'destroy']);

        // User Management
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Pengeluaran (create)
        Route::post('/pengeluaran', [PengeluaranController::class, 'store']);

        // Session monitoring (admin)
        Route::get('/session/all-active', [SessionController::class, 'getAllActive']);

        // Landing Page Settings (Admin)
        Route::post('/landing-page', [LandingPageSettingController::class, 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | ALL ROLES (1,2,3)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:1,2,3')->group(function () {

        // Menu (READ ONLY)
        Route::get('/menu', [MenuController::class, 'index']);
        Route::get('/menu/{id}', [MenuController::class, 'show']);

        // Kategori
        Route::get('/kategori', [MenuKategoriController::class, 'index']);
        Route::get('/kategori/{id}', [MenuKategoriController::class, 'show']);

        // Pajak
        Route::get('/tax', [TaxSettingController::class, 'get']);
        Route::post('/tax', [TaxSettingController::class, 'update']);

        // Orders
        Route::get('/orders', [PenjualanController::class, 'index']);
        Route::post('/orders', [PenjualanController::class, 'store']);
        Route::patch('/orders/{id}/status', [PenjualanController::class, 'updateStatus']);

        // Stock
        Route::get('/bahan', [StockController::class, 'bahan']);
        Route::get('/stok-history/{bahan_id}', [StockController::class, 'history']);
        Route::post('/stok-movement', [StockController::class, 'store']);
        Route::post('/produksi-stock', [StockController::class, 'produksi']);
        Route::get('/stock-list', [StockController::class, 'stockList']);
        Route::get('/stock-history', [StockController::class, 'stockHistory']);

        // Pemasukan
        Route::get('/pemasukan', [PenjualanController::class, 'getPemasukan']);

        // Pengeluaran (read only for all roles)
        Route::get('/pengeluaran', [PengeluaranController::class, 'index']);
        Route::get('/pengeluaran/harian', [PengeluaranController::class, 'harian']);

        // QRIS Settings (read)
        Route::get('/qris-settings', [QrisSettingController::class, 'index']);

        // Stock menu
        Route::patch('/menu/{id}/stock', [MenuController::class, 'updateStock']);

        // Evidence
        Route::get('/evidence/{type}/{filename}', [EvidenceController::class, 'view']);
        Route::get('/evidence/{type}/{filename}/download', [EvidenceController::class, 'download']);

        // Session
        Route::post('/session/start', [SessionController::class, 'startSession']);
        Route::post('/session/end', [SessionController::class, 'endSession']);
        Route::get('/session/active', [SessionController::class, 'active']);
        Route::get('/session/last-recap', [SessionController::class, 'lastRecap']);

        // Attendance
        Route::get('/attendance/status', [AttendanceController::class, 'status']);
        Route::post('/attendance/check-in', [AttendanceController::class, 'checkIn']);
        Route::post('/attendance/check-out', [AttendanceController::class, 'checkOut']);
        Route::get('/attendance/history', [AttendanceController::class, 'history']);
    });
});
