<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VmCodeTableController;
use App\Http\Controllers\CodeingTableController;


Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('permission', [AuthController::class, 'userpermission']);
    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('tableDate', [VmCodeTableController::class,'SelectDataTable']);
    Route::get('SelectDatat', [CodeingTableController::class, 'SelectDatatTable']);
    Route::post('SubmetDatat', [CodeingTableController::class, 'store']);

    // Route::get('Service', [SelectorController::class, 'Service']);


});

