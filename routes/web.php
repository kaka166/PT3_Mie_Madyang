<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\MenuKategoriController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\BahanController;
use App\Http\Controllers\ResepMenuController;
use App\Http\Controllers\PembelianBahanController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\PenjualanController;

use App\Models\User;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function(){

    Route::resource('kategori-menu', MenuKategoriController::class);
    Route::resource('menu', MenuController::class);
    Route::resource('bahan', BahanController::class);

    Route::resource('resep-menu', ResepMenuController::class);
    Route::resource('pembelian-bahan', PembelianBahanController::class);
    Route::resource('produksi', ProduksiController::class);

    Route::resource('penjualan', PenjualanController::class)
        ->only(['index','store']);

});


Route::get('/create-owner', function () {

    User::create([
        'name' => 'Owner',
        'email' => 'owner@test.com',
        'password' => Hash::make('123456'),
        'role' => 'owner'
    ]);

    return "Owner berhasil dibuat";
});
