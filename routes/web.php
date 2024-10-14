<?php

use App\Http\Controllers\InvoiceController;
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
    Route::post('Vendor/viewOffer', [TaskController::class, 'viewOffer'])->name('Vendor.viewOffer');
    Route::post('Vendor/viewJob', [TaskController::class, 'viewJob'])->name('Vendor.viewJob');
    Route::post('Vendor/cancelOffer', [TaskController::class, 'cancelOffer'])->name('Vendor.cancelOffer');
    Route::post('Vendor/acceptOffer', [TaskController::class, 'acceptOffer'])->name('Vendor.acceptOffer');
    Route::post('Vendor/acceptOfferList', [TaskController::class, 'acceptOfferList'])->name('Vendor.acceptOfferList');
    Route::post('Vendor/sendMessage', [TaskController::class, 'sendMessage'])->name('Vendor.sendMessage');
    Route::post('Vendor/finishJob', [TaskController::class, 'finishJob'])->name('Vendor.finishJob');
    Route::post('Vendor/planTaskReply', [TaskController::class, 'planTaskReply'])->name('Vendor.planTaskReply');
    Route::post('Vendor/allInvoices', [InvoiceController::class, 'allInvoices'])->name('Vendor.allInvoices');
    Route::post('Vendor/selectCompletedJobs', [InvoiceController::class, 'selectCompletedJobs'])->name('Vendor.selectCompletedJobs');
    Route::post('Vendor/getSelectedJobData', [InvoiceController::class, 'getSelectedJobData'])->name('Vendor.getSelectedJobData');
    Route::post('Vendor/saveInvoice', [InvoiceController::class, 'saveInvoice'])->name('Vendor.saveInvoice');
});

