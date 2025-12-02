<?php

namespace App\Http\Controllers\v1;

use App\Http\Resources\v1\TransactionResource;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransactionController
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        // Remove null values from filters
        $filters = collect($request->all())->filter(function ($value) {
            return !is_null($value);
        });

        // Apply filters to user's transactions
        $transactions = $user->transactions()->filter($filters)->get();

        return TransactionResource::collection($transactions);
    }
    public function allTransactions(Request $request): AnonymousResourceCollection
    {

        // Remove null values from filters
        $filters = collect($request->all())->filter(function ($value) {
            return !is_null($value);
        });

        // Apply filters to user's transactions
        $transactions = Transaction::filter($filters)->get();

        return TransactionResource::collection($transactions);
    }
}
