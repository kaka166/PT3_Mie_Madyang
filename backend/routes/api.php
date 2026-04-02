<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\MenuKategoriController;

Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);
Route::post('/menu', [MenuController::class, 'store']);
Route::put('/menu/{id}', [MenuController::class, 'update']);
Route::delete('/menu/{id}', [MenuController::class, 'destroy']);
Route::get('/kategori', [MenuController::class, 'kategori']);


Route::get('/kategori', [MenuKategoriController::class, 'index']);
Route::get('/kategori/{id}', [MenuKategoriController::class, 'show']);
Route::post('/kategori', [MenuKategoriController::class, 'store']);
Route::put('/kategori/{id}', [MenuKategoriController::class, 'update']);
Route::delete('/kategori/{id}', [MenuKategoriController::class, 'destroy']);
