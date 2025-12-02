<?php

namespace App\Http\Controllers\v1;

use App\Http\Resources\v1\LuckyDiceResultResource;
use App\Models\CardLink;
use App\Models\LuckyDice;
use App\Models\LuckyDiceResult;
use App\Models\LuckyDiceReward;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LuckyDiceController
{
    use HasApiResponses;

    public function resultCount($card): JsonResponse
    {
        $luckyDiceLinks = $card->links->filter(function ($link) {
            return $link->luckyDice()->exists();
        });

        $luckyDices = $luckyDiceLinks->map(function ($link) {
            return $link->luckyDice;
        })->filter();

        // نتایج خوانده‌نشده
        $unreadDiceResults = $luckyDices->flatMap(function ($dice) {
            return $dice->results()->whereNull('read_at')->get();
        });

        // پر کردن read_at
        $now = now();
        $unreadDiceResults->each(function ($result) use ($now) {
            $result->update(['read_at' => $now]);
        });

        $unreadCount = $unreadDiceResults->count();

        // مجموع کل نتایج
        $totalCount = $luckyDices->flatMap(function ($dice) {
            return $dice->results()->get();
        })->count();

        return $this->ok("تعداد کل شرکت‌کننده‌ها: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }

    public function allResults($card): JsonResponse
    {
        $luckyDiceLinks = $card->links->filter(function ($link) {
            return $link->luckyDice()->exists();
        });

        $luckyDices = $luckyDiceLinks->map(function ($link) {
            return $link->luckyDice;
        })->filter();

        $allResults = $luckyDices->flatMap(function ($dice) {
            return $dice->results()->get();
        });

        return $this->ok("لیست کامل نتایج گردونه شانس", LuckyDiceResultResource::collection($allResults), 200);
    }
    public function readAll($card): JsonResponse
    {
        $luckyDiceLinks = $card->links->filter(function ($link) {
            return $link->luckyDice()->exists();
        });

        $luckyDices = $luckyDiceLinks->map(function ($link) {
            return $link->luckyDice;
        })->filter();

        $now = now();

        $luckyDices->each(function ($dice) use ($now) {
            $dice->results()->whereNull('read_at')->update(['read_at' => $now]);
        });

        return $this->ok('همه نتایج خوانده‌نشده به‌روزرسانی شدند.');
    }
    public function prizes(CardLink $link): JsonResponse
    {
        $luckyDice = $link->luckyDice()->first();

        if (!$luckyDice) {
            return $this->fail('بازی تاس شانس برای این لینک تعریف نشده', [], 404);
        }

        $prizes = $luckyDice->prizes()->orderBy('order')->get();

        return $this->ok('لیست جوایز بازی تاس شانس', $prizes);
    }
    public function check(Request $request, $link): JsonResponse
    {

        $userId = auth()->id();
        $ip = $request->ip();

        $luckyDice = $link->luckyDice()->latest()->first();

        if (!$luckyDice) {
            return $this->fail('بازی تاس شانس برای این لینک تعریف نشده است', [], 404);
        }
        $alreadyLuckyDiceResult = LuckyDiceResult::where('lucky_dice_id', $luckyDice->id)
            ->where(function ($query) use ($userId, $ip) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ip);
                }
            })->exists();

        if ($alreadyLuckyDiceResult) {
            return $this->fail('شما قبلاً بازی کرده‌اید',null,403);
        }

        return $this->ok('شما مجاز به شرکت در بازی هستید',null, 200);

    }
    public function result(Request $request, CardLink $link): JsonResponse
    {
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'result' => 'required|string',
        ]);

        $ip = $request->ip();
        $country = geoip($ip)->country ?? '';

        $luckyDice = $link->luckyDice()->latest()->first();

        if (!$luckyDice) {
            return $this->fail('بازی تاس شانس برای این لینک تعریف نشده است', [], 404);
        }


        $isWinner = is_numeric($request->result) && intval($request->result) >= 1 && intval($request->result) <= 6;


        $prizeText = 'متاسفانه اینبار برنده نشدی!';
        if ($isWinner) {
            $prize = $luckyDice->prizes()->inRandomOrder()->first();
            if ($prize) {
                $prizeText = $prize->text;

                // ذخیره جایزه در جدول rewards
                LuckyDiceReward::create([
                    'lucky_dice_id' => $luckyDice->id,
                    'phone' => $request->phone,
                    'reward_type' => 'text',
                    'reward_value' => $prizeText,
                ]);
            }
        }

        $diceResult = $luckyDice->results()->create([
            'card_link_id' => $link->id,
            'phone' => $request->phone,
            'result' => $prizeText,
            'ip_address' => $ip,
            'country' => $country,
        ]);

        return $this->ok('نتیجه ذخیره شد', [
            'result' => new LuckyDiceResultResource($diceResult),
            'reward' => $isWinner ? [
                'type' => 'text',
                'value' => $prizeText,
            ] : null,
        ]);
    }

}
