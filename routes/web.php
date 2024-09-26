<?php

use Illuminate\Support\Facades\Route;

Route::view('/{path?}', 'welcome')->where('path', '.*');

// Route::get('/', function () {
//     return view('welcome');
// });