<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::view('/{path?}', 'welcome')->where('path', '.*');

// Route::get('/', function () {
//     return view('welcome');
// });

Route::group(['prefix' => 'Portal'], function () {

    Route::post('Vendor/allJobs', [TaskController::class, 'allJobs'])->name('Vendor.allJobs');
    Route::post('Vendor/allJobOffers', [TaskController::class, 'allJobOffers'])->name('Vendor.allJobs');
    Route::post('Vendor/allClosedJobs', [TaskController::class, 'allClosedJobs'])->name('Vendor.allClosedJobs');
    Route::post('Vendor/allPlannedJobs', [TaskController::class, 'allPlannedJobs'])->name('Vendor.allPlannedJobs');
    Route::post('Vendor/ViewOffer', [TaskController::class, 'ViewOffer'])->name('Vendor.ViewOffer');
    Route::post('Vendor/ViewJob', [TaskController::class, 'ViewJob'])->name('Vendor.ViewJob');
    Route::post('Vendor/cancelOffer', [TaskController::class, 'cancelOffer'])->name('Vendor.cancelOffer');

});

