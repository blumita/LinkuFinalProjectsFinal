<?php

namespace App\Services;

use App\Exceptions\CustomException;
use App\Models\CardLeadSetting;
use Exception;

class CardLeadSettingService
{

    public function storeLeadSettingsForCard($data, $card): CardLeadSetting
    {
        return $card->leadsetting()->updateOrCreate([], [
            'form_title' => $data['formTitle'],
            'fields' => $data['fields'],
            'submit_button_text' => $data['submitButtonText'],
            'form_disclaimer' => $data['formDisclaimer'],
        ]);
    }

    /**
     * @throws Exception
     */
    public function updateLeadSettingsForCard($data, $card): CardLeadSetting
    {
        if (!$card->leadsetting) {
            throw new CustomException('Lead setting not found for this card.');
        }

        $card->leadsetting->update([
            'form_title' => $data['formTitle'] ?? $card->leadsetting->form_title,
            'fields' => $data['fields'] ?? $card->leadsetting->fields,
            'submit_button_text' => $data['submitButtonText'] ?? $card->leadsetting->submit_button_text,
            'form_disclaimer' => $data['formDisclaimer'] ?? $card->leadsetting->form_disclaimer,
        ]);

        return $card->leadsetting->refresh();
    }

}
