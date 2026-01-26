<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Added the resource route
Route::apiResource('expenses', ExpenseController::class);

// Health check endpoint
Route::get('/expenses/health', function () {
    return response()->json(['status' => 'healthy', 'service' => 'expense-service']);
});
