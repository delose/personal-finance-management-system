<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExpenseController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Added the resource route
Route::apiResource('expenses', ExpenseController::class);

// Health check endpoint for Consul
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'service' => 'expense-service'
    ], 200);
});

// Optional: Add a more detailed health check
Route::get('/health/detailed', function () {
    $checks = [
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'cache' => Cache::get('health_check') !== null ? 'working' : 'not working',
    ];
    
    return response()->json([
        'status' => 'healthy',
        'checks' => $checks,
        'timestamp' => now()->toISOString()
    ], 200);
});
