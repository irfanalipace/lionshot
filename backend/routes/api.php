<?php

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecyclingController;

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

// Forgot password
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('guest')->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('guest')->name('password.reset');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->middleware('guest')->name('verify.otp');


Route::get('/email/verify', [AuthController::class, 'verificationNotice'])->middleware(['auth', 'verified'])->name('verification.notice');
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verificationVerify'])->name('verification.verify');

Route::post('/email/verification-notification', [AuthController::class, 'verificationLink'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
});

// Add routes with-in this group to comply with the auth;
//Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('get-user', [AuthController::class, 'getUser']);
    Route::post('get-access-token', [RecyclingController::class, 'getAccessToken']);
    Route::get('get-code', [RecyclingController::class, 'getCode']);
    Route::get('get-invoice-by-internal-id', [RecyclingController::class, 'getInvoiceByInternalId']);
    Route::get('get-invoice-by-date-range', [RecyclingController::class, 'getInvoiceByDateRange']);

//});
