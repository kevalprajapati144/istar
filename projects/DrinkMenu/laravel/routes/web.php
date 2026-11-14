<?php

use App\Http\Controllers\DrinkController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/drinks');
Route::resource('drinks', DrinkController::class)->except(['show']);
