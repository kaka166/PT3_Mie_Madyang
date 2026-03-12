<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuKategoriController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\BahanController;
use App\Http\Controllers\ResepMenuController;
use App\Http\Controllers\PembelianBahanController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\PengeluaranController;

Route::get('/', function () { return view('welcome'); });


Route::prefix('dashboard')->group(function() {
    Route::get('/', [MenuController::class, 'dashboardGeneral'])->name('dashboard');

    Route::resource('kategori-menu', MenuKategoriController::class);
    Route::resource('menu', MenuController::class);
    Route::resource('bahan', BahanController::class);
    Route::resource('resep-menu', ResepMenuController::class);

    Route::prefix('kasir')->group(function() {
        Route::get('/', [PenjualanController::class, 'index'])->name('kasir.index');
        Route::resource('penjualan', PenjualanController::class);
        Route::resource('pengeluaran', PengeluaranController::class);
    });

    Route::prefix('dapur')->group(function() {
        Route::get('/', [ProduksiController::class, 'index'])->name('dapur.index');
        Route::resource('pembelian-bahan', PembelianBahanController::class);
        Route::resource('produksi', ProduksiController::class);
    });
});