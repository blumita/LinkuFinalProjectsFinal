<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardQrResource extends JsonResource
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
            'modelType'=>'cardqr',
            'cardId'=>$this->card_id,
            'qrColor'=>$this->qr_color,
            'qrBgColor'=>$this->qr_bg_color,
            'qrLogoSize'=>$this->qr_logo_size,
            'qrLogoRadius'=>$this->qr_logo_radius,
            //'qrLogo'=>$this->getQrLogoUrl(),
            'createdAt'=>$this->created_at,
            'updatedAt'=>$this->updated_at
        ];

    }
    //Get url logo qr
    public function getQrLogoUrl(): ?string
    {
        $logo = $this->logo->path;

        if (!$logo) {
            return null;
        }

        if (str_starts_with($logo, '/logo/')) {
            return $logo;
        }

        return media_path($logo);
    }
}
