<?php

namespace App\Http\Controllers\v1;

use App\Mail\SupportMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{

    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        Mail::to('matineali@gmail.com')->send(new SupportMessage($data));

        return response()->json(['success' => true,'message' => __('mail.support_sent')]);
    }

}
