<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuKategoriController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\TaxSettingController;
use App\Http\Controllers\Api\PenjualanController;
use App\Http\Controllers\Api\StockController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:1')->group(function () {
        // CRUD Menu (Write Access)
        Route::post('/menu', [MenuController::class, 'store']);
        Route::put('/menu/{id}', [MenuController::class, 'update']);
        Route::delete('/menu/{id}', [MenuController::class, 'destroy']);
        Route::put('/menu/{id}/toggle', [MenuController::class, 'toggle']);

        Route::post('/kategori', [MenuKategoriController::class, 'store']);
        Route::put('/kategori/{id}', [MenuKategoriController::class, 'update']);
        Route::delete('/kategori/{id}', [MenuKategoriController::class, 'destroy']);
        Route::put('/kategori/{id}/toggle', [MenuKategoriController::class, 'toggleStatus']);
    });

    Route::middleware('role:1,2,3')->group(function () {
        Route::get('/menu', [MenuController::class, 'index']);
        Route::get('/menu/{id}', [MenuController::class, 'show']);
        
        Route::get('/kategori', [MenuKategoriController::class, 'index']);
        Route::get('/kategori/{id}', [MenuKategoriController::class, 'show']);

        //pengaturan pajak
        Route::get('/tax', [TaxSettingController::class, 'get']);
        Route::post('/tax', [TaxSettingController::class, 'update']);   

        //mencatat pesanan ke kitchen
        Route::get('/orders', [PenjualanController::class, 'index']);
        Route::post('/orders', [PenjualanController::class, 'store']);
        Route::patch('/orders/{id}/status', [PenjualanController::class, 'updateStatus']);

        //kelola stock
        Route::get('/bahan', [StockController::class, 'bahan']);
        Route::get('/stok-history/{bahan_id}', [StockController::class, 'history']);
        Route::post('/stok-movement', [StockController::class, 'store']);
        Route::post('/produksi', [StockController::class, 'produksi']);
        Route::get('/stock-list', [StockController::class, 'stockList']);
        Route::get('/stock-history', [StockController::class, 'stockHistory']);

        
    });

});