<?php

namespace App\Services;

use App\Exceptions\CustomException;
use App\Models\CardLink;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CardLinkService
{
    public FileManagerService $service;

    public function __construct(FileManagerService $service)
    {
        $this->service = $service;
    }

    public function incrementViews($link): void
    {
        $today = now()->toDateString();

        $view = $link->views()->firstOrCreate(
            ['view_date' => $today],
            ['views_count' => 0]
        );

        $view->increment('views_count');
    }

    /**
     * @throws ValidationException
     */
    public function addLinkToCard($data, $card)
    {

        $lastOrder = $card->links()->max('order') ?? 0;



        $link=$card->links()->create([
            'data' => $data['link'],
            'enabled' => $data['enabled'] ?? true,
            'asSelectedSingleLink'=>$data['asSelectedSingleLink']??false,
            'clicks' => 0,
            'order' => $lastOrder + 1
        ]);

        if($this->hasActionPoll($data['link'])){

            $this->addPoll($link);
        }

        if($this->hasActionLuckyDice($data['link'])){

            $this->addLuckyDice($link);
        }
        if($this->hasActionLuckyEgg($data['link'])){

            $this->addLuckyEgg($link);
        }
        if($this->hasActionLuckyWheel($data['link'])){

            $this->addLuckyWheel($link);
        }

        return $link;
    }
    public function addPoll($link): void
    {
        $decoded = is_string($link->data) ? json_decode($link->data, true) : $link;

        if (!is_array($decoded)) {
            return;
        }

        if (!isset($decoded['options']) || !is_array($decoded['options'])) {
            return;
        }


        $poll = $link->poll()->create([
            'question' => $decoded['title'] ?? 'نظرسنجی بدون عنوان',
            'is_active' => $decoded['enabled'] ?? true,
        ]);


        foreach ($decoded['options'] as $index => $text) {
            $poll->options()->create([
                'text' => $text,
                'order' => $index,
            ]);
        }
    }
    public function hasActionPoll($data): bool
    {
        $decoded = is_string($data) ? json_decode($data, true) : $data;

        if (!is_array($decoded)) {
            return false;
        }

        return isset($decoded['action']) && $decoded['action'] === 'poll';
    }
    public function addLuckyDice(CardLink $link): void
    {
        $decoded = is_string($link->data) ? json_decode($link->data, true) : $link;

        if (!is_array($decoded) || !isset($decoded['prizes']) || !is_array($decoded['prizes'])) {
            return;
        }

        $luckyDice = $link->luckyDice()->create([
            'title' => $decoded['title'] ?? 'بازی تاس شانس',
            'is_active' => $decoded['enabled'] ?? true,
        ]);

        foreach ($decoded['prizes'] as $index => $text) {
            $luckyDice->prizes()->create([
                'text' => $text,
                'order' => $index,
            ]);
        }
    }
    public function hasActionLuckyDice($data): bool
    {
        $decoded = is_string($data) ? json_decode($data, true) : $data;

        if (!is_array($decoded)) {
            return false;
        }

        return isset($decoded['action']) && $decoded['action'] === 'luckydice';
    }
    public function addLuckyEgg(CardLink $link): void
    {
        $decoded = is_string($link->data) ? json_decode($link->data, true) : $link;

        if (!is_array($decoded) || !isset($decoded['prizes']) || !is_array($decoded['prizes'])) {
            return;
        }

        $luckyEgg = $link->luckyEgg()->create([
            'title' => $decoded['title'] ?? 'بازی تاس شانس',
            'is_active' => $decoded['enabled'] ?? true,
        ]);

        foreach ($decoded['prizes'] as $index => $text) {
            $luckyEgg->prizes()->create([
                'text' => $text,
                'order' => $index,
            ]);
        }
    }
    public function hasActionLuckyEgg($data): bool
    {
        $decoded = is_string($data) ? json_decode($data, true) : $data;

        if (!is_array($decoded)) {
            return false;
        }

        return isset($decoded['action']) && $decoded['action'] === 'luckyegg';
    }
    public function addLuckyWheel(CardLink $link): void
    {
        $decoded = is_string($link->data) ? json_decode($link->data, true) : $link;

        if (!is_array($decoded) || !isset($decoded['prizes']) || !is_array($decoded['prizes'])) {
            return;
        }

        $luckyWheel = $link->luckyWheel()->create([
            'title' => $decoded['title'] ?? 'بازی تاس شانس',
            'is_active' => $decoded['enabled'] ?? true,
        ]);

        foreach ($decoded['prizes'] as $index => $text) {
            $luckyWheel->prizes()->create([
                'text' => $text,
                'order' => $index,
            ]);
        }
    }
    public function hasActionLuckyWheel($data): bool
    {
        $decoded = is_string($data) ? json_decode($data, true) : $data;

        if (!is_array($decoded)) {
            return false;
        }

        return isset($decoded['action']) && $decoded['action'] === 'luckywheel';
    }


    /**
     * @throws ValidationException
     */
    public function removeLinkFromCard($fieldName, $model): void
    {
        $this->service->removeFileFromModel($fieldName, $model,$model->id);

        $model->delete();

    }

    public function toggleEnabledDisabledLink($validated, $link): void
    {

        $link->enabled = $validated['enabled'];

        $link->save();

    }

    public function updateLinkJsonData(mixed $data, $card,$link)
    {

        $link->update([
            'data' => $data['link'],
        ]);

        return $link;

    }

    public function saveForm(mixed $data, $link)
    {

        return $link->forms()->create([
            'data' => json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
        ]);

    }

    /**
     * @throws CustomException
     */
    public function sortLinksByHash($card, $data): void
    {

        $links = $card->links;

        if ($links->isEmpty()) {

            throw new CustomException(__('errors.no_links_found'), 404);

        }

        foreach ($data as $index => $hash) {
            $link = $links->firstWhere('hash', $hash);
            if ($link) {
                $link->update(['order' => $index]);
            }
        }

    }

    public function saveQuestion(array $all, $link)
    {
        $cardId=$link->card->id;

        return $link->questionBoxes()->create([
            'question' => $all['question'],
            'card_id'=>$cardId,
            'description' => '',
        ]);
    }

    public function getQuestions($card)
    {
        return $card->questionBoxes;
    }
}
