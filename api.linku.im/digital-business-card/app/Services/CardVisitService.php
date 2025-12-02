<?php

namespace App\Services;

use App\Exceptions\CustomException;
use App\Models\CardProduct;
use App\Models\CardVisit;
use App\Models\License;
use App\Models\ProductUnit;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CardVisitService
{

    public function saveCardVisit($data)
    {
        //$license = License::where('license_code', $data['licenseId'])->first();

        return CardVisit::create([
            'card_type' => $data['cardType'],
            'mobile' => $data['mobile'],
            'owner_name' => $data['ownerName'],
            'qr_link' => $data['qrLink'],
            'status' => $data['status'] ?? 'active',
            'product_unit_id' =>$data['product_unit_id'] //$license?->product_unit_id,
        ]);

    }

    public function updateCardVisit($data, $card): bool
    {

    }
}
