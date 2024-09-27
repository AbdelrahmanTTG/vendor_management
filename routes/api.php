<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group(['prefix' => 'auth'], function() {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});

Route::middleware(['auth:api'])->group(function() {
    Route::post('permission', [AuthController::class, 'userpermission']);
    Route::get('logout', [AuthController::class, 'logout']);
});

