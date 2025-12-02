<?php

namespace App\Http\Controllers\v1;

use App\Exceptions\CustomException;
use App\Http\Requests\v1\PaymentRequest;
use App\Services\PaymentService;
use App\Traits\HasApiResponses;
use Exception;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Log;

class PaymentController
{
    //
    use HasApiResponses;

    protected PaymentService $service;

    public function __construct(PaymentService $service)
    {
        $this->service = $service;
    }

    public function initiatePayment(PaymentRequest $request): JsonResponse
    {
        $user = $request->user();

        try {

            $result = $this->service->pay($request->validated(), $user);

            $data = [
                'redirect_url' => $result['redirect_url'] ?? null,
            ];

            return $this->ok(__('messages.redirect_url_created'), $data, 200);

        } catch (Exception $e) {

            Log::error('Payment verification error', ['message' => $e->getMessage()]);

            return $this->fail(__('messages.redirect_url_not_created'), $e->getMessage(), 500);
        }


    }

    /**
     * @throws CustomException
     */
    public function callbackPayment(Request $request): Application|Redirector|RedirectResponse
    {
        try {

            $result = $this->service->verifyTransaction($request->all());

            if ($result) {

                return redirect(env('LINKU_ADDRESS') . '/dashboard/success?' . http_build_query([
                        //'status' => $result['status'],
                        'planLabel' => $result['planLabel'],
                        'phoneNumber' => $result['phoneNumber'],
                        'expireDate' => $result['expireDate'],
                        'daysLeft' => $result['daysLeft']
                    ]));

            } else {

                return throw new customException();
            }


        } catch (Exception $e) {

            Log::error('Payment verification error', ['message' => $e->getMessage()]);

            return throw new customException();
        }

    }
}
