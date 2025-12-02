<?php

namespace App\Http\Controllers\v1;

use App\Models\Card;
use App\Models\CardLink;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Torann\GeoIP\GeoIP;
class PollController extends Controller
{
    use HasApiResponses;

    public function show(CardLink $link): JsonResponse
    {

        $poll = $link->poll;

        if (!$poll) {
            return response()->json(['message' => 'نظرسنجی‌ای برای این لینک وجود ندارد'], 404);
        }

        return response()->json([
            'poll' => $poll->load(['options' => function ($q) {
                $q->withCount('votes');
            }])
        ]);
    }

    public function vote(Request $request, CardLink $link, $optionId): JsonResponse
    {
        $poll = $link->poll;

        if (!$poll) {
            return response()->json(['message' => 'نظرسنجی‌ای برای این لینک وجود ندارد'], 404);
        }

        $option = $poll->options()->where('id', $optionId)->first();
        if (!$option) {
            return response()->json(['message' => 'گزینه معتبر نیست'], 422);
        }

        $userId = auth()->id();
        $ip = $request->ip();
        //$location = geoip($ip);
        $country ='';//$location->country;

        $alreadyVoted = PollVote::where('poll_id', $poll->id)
            ->where(function ($query) use ($userId, $ip) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ip);
                }
            })->exists();

        if ($alreadyVoted) {
            return response()->json(['message' => 'شما قبلاً رأی داده‌اید'], 403);
        }

        PollVote::create([
            'poll_id' => $poll->id,
            'poll_option_id' => $option->id,
            'user_id' => $userId,
            'ip_address' => $ip,
            'country' => $country,
        ]);

        return response()->json(['message' => 'رأی شما ثبت شد']);
    }
    public function votes(Request $request, Card $card): JsonResponse
    {

        $linksWithPolls = $card->links()->whereHas('poll')->with([
            'poll.options' => function ($query) {
                $query->withCount('votes');
            },
            'poll.votes'
        ])->get();

        $totalVotes = 0;
        $voters = [];

        $results = $linksWithPolls->map(function ($link) use (&$totalVotes, &$voters) {
            $poll = $link->poll;

            $options = $poll->options->map(function ($option) use (&$totalVotes) {
                $totalVotes += $option->votes_count;
                return [
                    'id' => $option->id,
                    'text' => $option->text,
                    'votes_count' => $option->votes_count,
                ];
            });

            $pollVoters = $poll->votes->map(function ($vote) {
                return [
                    'ip' => $vote->ip_address,
                    'country' => $vote->country,
                    'option_id' => $vote->poll_option_id
                ];
            });

            $voters = array_merge($voters, $pollVoters->toArray());

            return [
                'link_id' => $link->id,
                'question' => $poll->question,
                'options' => $options,
            ];
        });

        return response()->json([
            'polls' => $results,
            'total_votes' => $totalVotes,
            'voters' => $voters
        ]);
    }



    public function readAll($card): JsonResponse
    {

        $card->poll()->whereNull('read_at')->each(function ($poll) {
            $poll->update(['read_at' => now()]);
        });

        return $this->ok();
    }
}

