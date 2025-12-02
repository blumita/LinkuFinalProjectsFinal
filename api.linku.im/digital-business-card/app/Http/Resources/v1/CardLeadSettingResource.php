<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardLeadSettingResource extends JsonResource
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
            'cardId'=>$this->card_id,
            'formTitle'=>$this->form_title,
            'fields'=>$this->fields,
            'submitButtonText'=>$this->submit_button_text,
            'formDisclaimer'=>$this->form_disclaimer,
            'createdAt'=>$this->created_at,
            'updatedAt'=>$this->updated_at

        ];
    }
}
