<?php

namespace App\Http\Resources\v1;

use App\Models\License;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardVisitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $licenseCode = $this->unit?->license?->license_code;
        $license = License::where('license_code', $licenseCode)->first();
        $isUsed = false;
        $activatedBy = null;

        if ($license) {
            $isUsed = (bool)$license->card;

            // اطلاعات کاربر فعال‌کننده کارت
            if ($license->card && $license->card->creator) {
                $creator = $license->card->creator;
                $activatedBy = [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                    'mobile' => $creator->mobile ?? null,
                    'cardSlug' => $license->card->slug,
                ];
            }
        }

        return [
            'id' => $this->id,
            'identifier' => 'CV-' . str_pad($this->sequence_number, 5, '0', STR_PAD_LEFT), // شماره مرتب به جای ID
            'mobile' => $this->mobile,
            'ownerName' => $this->owner_name,
            'qrLink' => $this->qr_link,
            'license' => $this->unit?->license?->license_code ?? null,
            'status' => $this->status,
            'cardType' => $this->card_type,
            'isUsed' => $isUsed,
            'activatedBy' => $activatedBy,
            'createdAt' => $this->created_at?->format('Y/m/d H:i') ?? null,
        ];
    }
}
