<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LuckyWheelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'phone' => $this->phone,
            'result' => $this->result,
            'lotteryCode' => $this->lottery_code,
            'createdAt' => $this->created_at->toDateTimeString(),
            'readAt'=>$this->read_at
        ];
    }
}
