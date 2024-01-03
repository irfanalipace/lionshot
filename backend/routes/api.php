<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth routes;
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
 
// Add routes with-in this group to comply with the auth;
Route::middleware('auth:api')->group(function () {
    Route::get('get-user', [AuthController::class, 'getUser']);
    Route::post('logout', [AuthController::class, 'logout']);
});