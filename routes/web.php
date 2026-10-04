<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Rute preview khusus halaman 404
Route::get('/404', function () {
    return response()->view('errors.404', [], 404);
});

// Fallback untuk semua URL yang tidak terdaftar
Route::fallback(function () {
    return response()->view('errors.404', [], 404);
});
