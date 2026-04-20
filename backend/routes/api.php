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

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (NO AUTH)
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


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

        // Pengeluaran
        Route::get('/pengeluaran', [PengeluaranController::class, 'index']);

        // Stock menu
        Route::patch('/menu/{id}/stock', [MenuController::class, 'updateStock']);

        // Session
        Route::post('/session/start', [SessionController::class, 'startSession']);
        Route::post('/session/end', [SessionController::class, 'endSession']);
        Route::get('/session/active', [SessionController::class, 'active']);
    });
});