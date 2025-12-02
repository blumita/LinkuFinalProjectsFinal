<?php
namespace App\Http\Controllers\v1;

use App\Services\SubscriptionService;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Order;

class SubscriptionController extends Controller
{
    use HasApiResponses;

    protected SubscriptionService $service;

    public function __construct(SubscriptionService $service)
    {
        $this->service = $service;
    }

    public function check(Request $request): JsonResponse
    {
        $user = $request->user();

        $data=$this->service->checkStatus($user);

        return $this->ok('عضویت بررسی شد',$data,200);
    }
}
