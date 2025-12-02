<?php

namespace App\Http\Controllers\v1;

use App\Http\Resources\v1\LuckyEggResultResource;
use App\Models\LuckyEggResult;
use App\Models\LuckyEggReward;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LuckyEggController extends Controller
{
    use HasApiResponses;

    public function resultCount($card): JsonResponse
    {
        $luckyEggLinks = $card->links->filter(function ($link) {
            return $link->luckyEgg()->exists();
        });

        $luckyEggs = $luckyEggLinks->map(function ($link) {
            return $link->luckyEgg;
        })->filter();


        $unreadEggResults = $luckyEggs->flatMap(function ($egg) {
            return $egg->results()->whereNull('read_at')->get();
        });


        $now = now();
        $unreadEggResults->each(function ($result) use ($now) {
            $result->update(['read_at' => $now]);
        });


        $unreadCount = $unreadEggResults->count();

        $totalCount = $luckyEggs->flatMap(function ($egg) {
            return $egg->results()->get();
        })->count();

        return $this->ok("تعداد کل افراد: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }
    public function allResults($card): JsonResponse
    {
        $luckyEggLinks = $card->links->filter(function ($link) {
            return $link->luckyEgg()->exists();
        });

        $luckyEggs = $luckyEggLinks->map(function ($link) {
            return $link->luckyEgg;
        })->filter();

        $allResults = $luckyEggs->flatMap(function ($egg) {
            return $egg->results()->get();
        });

        return $this->ok("لیست کامل نتایج تخم مرغ شانس", LuckyEggResultResource::collection($allResults), 200);
    }
    public function readAll($card): JsonResponse
    {
        $luckyEggLinks = $card->links->filter(function ($link) {
            return $link->luckyEgg()->exists();
        });

        $luckyEggs = $luckyEggLinks->map(function ($link) {
            return $link->luckyEgg;
        })->filter();

        $now = now();

        $luckyEggs->each(function ($egg) use ($now) {
            $egg->results()->whereNull('read_at')->update(['read_at' => $now]);
        });

        return $this->ok('همه نتایج خوانده‌نشده به‌روزرسانی شدند.');
    }
    public function check(Request $request, $link): JsonResponse
    {

        $userId = auth()->id();
        $ip = $request->ip();

        $luckyEgg = $link->luckyEgg()->latest()->first();

        if (!$luckyEgg) {
            return $this->fail('بازی تخم مرغ شانس برای این لینک تعریف نشده است', [], 404);
        }
        $alreadyLuckyEggResult = LuckyEggResult::where('lucky_egg_id', $luckyEgg->id)
            ->where(function ($query) use ($userId, $ip) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ip);
                }
            })->exists();

        if ($alreadyLuckyEggResult) {
            return $this->fail('شما قبلاً بازی کرده‌اید',null,403);

        }

        return $this->ok('شما مجاز به شرکت در بازی هستید',null, 200);

    }
    public function result(Request $request, $link): JsonResponse
    {
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'result' => 'required|string',
        ]);
        $ip = $request->ip();
        $country = geoip($ip)->country ?? '';

        $luckyEgg = $link->luckyEgg()->latest()->first();

        if (!$luckyEgg) {
            return $this->fail('بازی تخم مرغ شانس برای این لینک تعریف نشده است', [], 404);
        }

        $prizeText = 'متاسفانه اینبار برنده نشدی!';
        if ($request['result']=='true') {
            $prize = $luckyEgg->prizes()->inRandomOrder()->first();
            if ($prize) {
                $prizeText = $prize->text;

                // ذخیره جایزه در جدول rewards
                LuckyEggReward::create([
                    'lucky_egg_id' => $luckyEgg->id,
                    'phone' => $request->phone,
                    'reward_type' => 'text',
                    'reward_value' => $prizeText,
                ]);
            }
        }

        $eggResult = $luckyEgg->results()->create([
            'card_link_id' => $link->id,
            'phone' => $request->phone,
            'result' => $prizeText,
            'ip_address' => $ip,
            'country' => $country,
        ]);

        return $this->ok('نتیجه ذخیره شد', [
            'result' => new LuckyEggResultResource($eggResult),
            'reward' => $request['result'] ? [
                'type' => 'text',
                'value' => $prizeText,
            ] : null,
        ]);
    }
}
