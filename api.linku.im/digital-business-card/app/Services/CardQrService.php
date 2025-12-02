<?php

namespace App\Services;

use App\Models\CardQr;

class CardQrService
{
    public FileManagerService $service;

    public function __construct(FileManagerService $service)
    {
        $this->service = $service;
    }

    public function storeOrUpdateQrForCard($data, $card): CardQr
    {
        $updateData = [];
        
        // Support both naming conventions (color/bgColor from QR page, qrColor/qrBgColor from card update)
        if (isset($data['color']) || isset($data['qrColor'])) {
            $updateData['qr_color'] = $data['color'] ?? $data['qrColor'] ?? null;
        }
        if (isset($data['bgColor']) || isset($data['qrBgColor'])) {
            $updateData['qr_bg_color'] = $data['bgColor'] ?? $data['qrBgColor'] ?? null;
        }
        if (isset($data['logoSize'])) {
            $updateData['qr_logo_size'] = $data['logoSize'];
        }
        if (isset($data['logoRadius'])) {
            $updateData['qr_logo_radius'] = $data['logoRadius'];
        }
        
        return $card->qr()->updateOrCreate(
            ['card_id' => $card->id],
            $updateData
        );
    }

}
