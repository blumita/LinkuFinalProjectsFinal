<?php

namespace App\Http\Controllers\v1;

use App\Exceptions\CustomException;
use App\Http\Requests\v1\CardLinkRequest;
use App\Http\Requests\v1\CardLinkUpdateRequest;
use App\Http\Resources\v1\CardFormResource;
use App\Http\Resources\v1\CardLinkResource;
use App\Http\Resources\v1\CardQuestionResource;
use App\Models\Card;
use App\Models\CardLink;
use App\Services\CardLinkService;
use App\Traits\HasApiResponses;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CardLinkController extends Controller
{
    use HasApiResponses, AuthorizesRequests;

    protected CardLinkService $service;

    public function __construct(CardLinkService $cardLinkService)
    {

        $this->service = $cardLinkService;
    }

    /**
     * Store a newly created resource in storage.
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function store(CardLinkRequest $request, $card): JsonResponse
    {

        $this->authorize('update', $card);

        $validateData = $request->validated();


        $decoded = is_string($validateData['link']) ?
            json_decode($validateData['link'], true) : $validateData['link'];

        if (!is_array($decoded)) {
            return $this->fail();
        }

        if (!isset($decoded['action'])) {
            return $this->fail();
        }

        $action = $decoded['action'];

        $typesWithLimit = ['luckyegg', 'luckywheel', 'luckydice', 'poll'];

        if (in_array($action, $typesWithLimit)) {
            $matchingLinks = $card->links->filter(function ($link) use ($action) {
                $data = is_string($link->data) ? json_decode($link->data, true) : $link->data;

                if (!is_array($data)) {
                    return false;
                }

                return isset($data['action']) && $data['action'] === $action;
            });

            if ($matchingLinks->isNotEmpty()) {
                return $this->fail("این کارت قبلاً یک لینک از نوع {$action} دارد و نمی‌تواند بیشتر از یکی داشته باشد.", [], 422);
            }
        }


        $link = $this->service->addLinkToCard($validateData, $card);

        $data = new CardLinkResource($link);

        return $this->ok(__('messages.link_saved'), $data, 200);
    }

    /**
     * @throws AuthorizationException
     */
    public function recordForm(Request $request, $link): JsonResponse
    {

        //
        $card = $link->card;
        $this->authorize('update', $card);

        $form = $this->service->saveForm(
            $request->all(),
            $link,
        );

        return $this->ok(__("messages.form_created"),
            new CardFormResource($form), 200);


    }

    /**
     * @throws AuthorizationException
     */
    public function recordQuestion(Request $request, $link): JsonResponse
    {

        //
        $card = $link->card;
        $this->authorize('update', $card);

        $question = $this->service->saveQuestion(
            $request->all(),
            $link,
        );

        return $this->ok(__("messages.form_created"),
            new CardQuestionResource($question), 200);


    }

    /**
     * @throws AuthorizationException
     */
    public function getQuestions(Request $request, $card): JsonResponse
    {

        //
        $this->authorize('update', $card);

        $questions = $this->service->getQuestions($card);

        return $this->ok(__("messages.form_created"),
            CardQuestionResource::collection($questions), 200);


    }

    /**
     * @throws AuthorizationException
     */
    public function questionsCount(Request $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        $unreadCount = $card->questionBoxes()->whereNull('read_at')->count();
        $totalCount = $card->questionBoxes()->count();

        return $this->ok("تعداد کل سوالات: {$totalCount} | خوانده‌نشده: {$unreadCount}", [
            'unreadCount' => $unreadCount,
            'totalCount' => $totalCount
        ], 200);
    }

    /**
     * @throws AuthorizationException
     */
    public function readAllQuestions(Request $request, $card): JsonResponse
    {
        $this->authorize('update', $card);

        $questions = $card->questionBoxes()->whereNull('read_at')->get();

        $now = now();
        $questions->each(function ($question) use ($now) {
            $question->update(['read_at' => $now]);
        });

        return $this->ok("همه سوالات خوانده‌نشده به‌روزرسانی شدند", CardQuestionResource::collection($questions), 200);
    }


    /**
     * @throws AuthorizationException
     * @throws CustomException
     */
    public function toggleSelectedAsSingleLink(Request $request, $card, $link): JsonResponse
    {
        $this->authorize('update', $card);

        try {

            CardLink::where('card_id', $card->id)
                ->update(['asSelectedSingleLink' => false]);


            $link->update(['asSelectedSingleLink' => true]);

            return $this->ok(__('messages.single_link_selected'), $link, 200);
        } catch (\Exception $e) {
            throw new CustomException(__('errors.unexpected_error'), 500);
        }
    }

    /**
     * Display the specified resource.
     * @throws AuthorizationException
     */
    public function toggleStatusLink(Request $request, $card, $cardLink): JsonResponse
    {

        //
        $this->authorize('update', $card);

        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $this->service->toggleEnabledDisabledLink($validated, $cardLink);

        $cardLink = $cardLink->refresh();

        $data = new CardLinkResource($cardLink);

        return $this->ok(__('messages.link_enabled'), $data);
    }

    /**
     * Update the specified resource in storage.
     * @throws AuthorizationException
     */
    public function update(CardLinkUpdateRequest $request, Card $card, CardLink $cardLink): JsonResponse
    {
        //
        $this->authorize('update', $card);

        $result = $this->service->updateLinkJsonData($request->validated(), $card, $cardLink);

        $data = new CardLinkResource($cardLink->refresh());

        return $this->ok(__('messages.link_updated'), $data, 200);
    }

    /**
     * Remove the specified resource from storage.
     * @throws AuthorizationException
     */
    public function destroy(Request $request, $card, $cardLink): JsonResponse
    {
        $this->authorize('update', $card);

        // Delete all associated files
        if ($cardLink->files()->exists()) {
            foreach ($cardLink->files as $file) {
                \Storage::disk(config('file-manager.disk'))->delete($file->path);
                $file->delete();
            }
        }

        // Delete the link itself
        $cardLink->delete();

        return $this->ok(__('messages.link_removed'));

    }

    /**
     * @throws CustomException
     */
    public function reorder(Request $request, $card): JsonResponse
    {
        try {
            $validated = $request->validate([
                'hashOrder' => 'required|array',
            ]);

            $this->service->sortLinksByHash($card, $validated['hashOrder']);

            return $this->ok(__('messages.links_reordered'));

        } catch (\Exception $e) {

            throw new CustomException(__('errors.unexpected_error'), 500);

        }

    }

    //---------------------------------- CardViews -----------------------------
    //--------------------------------------------------------------------------
    public function recordClick($link): JsonResponse
    {
        $this->service->incrementViews($link);

        $latestView = $link->views()->latest()->first();

        return $this->ok(__('messages.links_increase_views'),
            $latestView?->views_count ?? 0, 200);

    }

}
