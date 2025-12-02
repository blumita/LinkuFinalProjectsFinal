<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class CardLinkResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        //Log::info('enabled', [$this->enabled]);

        $response = [
            'id' => $this->id,
            'modelType' => 'cardlink',
            'cardId' => $this->card_id,
            'hash' => $this->hash,
            'customIcon' => media_path($this->customIcon->path ?? ''),
            'fileData' => media_path($this->fileData->path ?? ''),
            'backgroundImage'=>media_path($this->backgroundImage->path??''),
            'clicks' => $this->clicks,
            'enabled' => $this->enabled,
            'asSelectedSingleLink' => $this->asSelectedSingleLink,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        if ($this->customIcon?->path) {
            $response['customIcon'] = media_path($this->customIcon->path);
        }
         //Log:info('$this->fileData?->path',[$this->fileData?->path]);
        if ($this->fileData?->path) {
            $response['fileData'] = media_path($this->fileData->path);
        }

        if ($this->backgroundImage?->path) {
            $response['backgroundImage'] = media_path($this->backgroundImage->path);
        }

        $data = is_array($this->data) ? $this->data : json_decode($this->data, true) ?? [];

        $protectedKeys = ['card_id', 'enabled', 'created_at', 'updated_at'];
        foreach ($data as $key => $value) {
            if (!in_array($key, $protectedKeys)) {
                if ($key !== 'id') {
                    if ($key === 'icon' && is_array($value) && isset($value['path'])) {
                        $response['icon'] = $value['path'];
                    } else {
                        $response[$key] = $value;
                    }
                }
            }
        }

        return $response;
    }
}
