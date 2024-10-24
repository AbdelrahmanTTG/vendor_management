<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VmCodeTableController;
use App\Http\Controllers\CodingTableController;
use App\Http\Controllers\VendorProfileController;
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
    Route::post('/updateeData', [CodingTableController::class, 'update']);
    Route::get('/GetCountry', [VendorProfileController::class, 'findCountry']);
    Route::post('/PersonalInformation', [VendorProfileController::class, 'store']);
    Route::post('/updatePersonalInformation', [VendorProfileController::class, 'updatePersonalInfo']);
    Route::post('/storeBilling', [VendorProfileController::class, 'storeBilling']);

});
Route::middleware(['auth:vendor'])->group(function () {

});
Route::middleware([App\Http\Middleware\VendorOrUser::class])->group(function () {
    Route::get('/dashboard', function () {
        return "data";
    });
});
    Route::post('/Vendors', [VendorProfileController::class,'Vendors']);
