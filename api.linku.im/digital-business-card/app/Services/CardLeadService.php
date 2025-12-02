<?php

namespace App\Services;

class CardLeadService
{
    public FileManagerService $service;

    public function __construct(FileManagerService $service)
    {
        $this->service = $service;
    }

    public function getLeadsOfCard($card): array
    {

        $allLeads = $card->leads()->latest()->get();

        $unreadCount = $card->leads()->whereNull('read_at')->count();

        return [$allLeads,$unreadCount];

    }
    public function readAll($card): void
    {

        $card->leads()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

    }

    public function addLeadToCard($validData,$card,$fieldLabels)
    {

        $fieldLabels = is_string($fieldLabels) ?
            json_decode($fieldLabels, true) : $fieldLabels;

        if (isset($validData['fieldLabels'])) {
            unset($validData['fieldLabels']);
        }

        $data = [];
        foreach ($validData as $name => $value) {

            $label = $fieldLabels[$name] ?? $name;

            //$key = str_replace(' ', '_', $label);

            $data[$label] = $value;
        }

        if (!$validData["isDefault"]) {

            return $card->leads()->create(['data' => $data]);

        } else {

            $lead = $card->leads()->firstOrCreate(
                ['is_default' => true],
                ['data' => []]
            );
        }

        $lead->update(['data' => $data]);

        return $lead;
    }

}
