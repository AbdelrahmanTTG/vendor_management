<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VmCodeTableController;
use App\Http\Controllers\CodingTableController;


Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('permission', [AuthController::class, 'userpermission']);
    Route::get('logout', [AuthController::class, 'logout']);
    Route::post('tableDate', [VmCodeTableController::class,'SelectDataTable']);
    Route::get('SelectDatat', [CodingTableController::class, 'SelectDatatTable']);
    Route::post('SubmetData', [CodingTableController::class, 'store']);
    Route::delete('/deleteData', [CodingTableController::class, 'destroy']);


    // Route::get('Service', [SelectorController::class, 'Service']);


});

