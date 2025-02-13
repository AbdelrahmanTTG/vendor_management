<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PortalAdminController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::view('/{path?}', 'welcome')->where('path', '.*');

// Route::get('/', function () {
//     return view('welcome');
// });


