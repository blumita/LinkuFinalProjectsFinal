<?php

namespace App\Http\Controllers\v1;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController
{
    public function monthlyRevenue(): \Illuminate\Http\JsonResponse
    {
        $monthlyRevenue = Order::where('status', 'paid')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->sum('amount');

        return response()->json([
            'month' => now()->format('F Y'),
            'revenue' => $monthlyRevenue,
        ]);
    }
    public function monthlyPurchases(): \Illuminate\Http\JsonResponse
    {
        $monthlyPurchases = Order::where('status', 'paid')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        return response()->json([
            'month' => now()->format('F Y'),
            'purchases' => $monthlyPurchases,
        ]);
    }

}
