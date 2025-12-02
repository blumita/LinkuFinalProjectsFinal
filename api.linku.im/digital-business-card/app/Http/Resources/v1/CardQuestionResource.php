<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'modelType'=>'questionbox',
            'cardId'=>$this->card_id,
            'question' => $this->question,
            'createdAt'=>$this->created_at,
            'updatedAt'=>$this->updated_at
        ];
    }

}
