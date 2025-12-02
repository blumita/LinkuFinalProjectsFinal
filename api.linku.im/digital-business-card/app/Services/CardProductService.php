<?php

namespace App\Services;

use App\Exceptions\CustomException;
use App\Models\CardProduct;
use App\Models\ProductUnit;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CardProductService
{

    public function saveCardProduct($data)
    {

        return CardProduct::create([
            'identifier' => $data['identifier'],
            'name' => $data['name'],
            'description' => $data['description'],
            'url' => $data['url'] ?? '',
            'status' => $data['status'],
        ]);

    }

    public function updateCardProduct($data, $card): bool
    {

        return $card->update($data);

    }
}
