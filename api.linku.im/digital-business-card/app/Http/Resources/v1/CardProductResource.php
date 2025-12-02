<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardProductResource extends JsonResource
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
            'identifier' => $this->identifier,
            'modelType'=>'cardproduct',
            'name' => $this->name,
            'status'=>$this->status,
            'description' => $this->description,
            'stock' => $this->units()
                ->whereHas('license', function ($query) {
                    $query->whereNull('card_id');
                })
                ->count(),
            'image'=>media_path($this->files->path??''),
            'createdAt' => $this->created_at->toDateTimeString(),
        ];
    }
}
