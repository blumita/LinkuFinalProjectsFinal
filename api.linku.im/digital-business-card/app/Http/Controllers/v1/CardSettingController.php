<?php

namespace App\Http\Controllers\v1;

use App\Exceptions\CustomException;
use App\Models\CardSetting;
use App\Traits\HasApiResponses;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CardSettingController extends Controller
{

    use AuthorizesRequests,HasApiResponses;

    /**
     * @throws AuthorizationException
     * @throws CustomException
     */
    public function toggleSingleLink(Request $request, $card): JsonResponse
    {

        $this->authorize('update', $card);

        //$leadCaptureMode=!$request->input('is_single_link');

        try {
            // Update the lead capture setting
            $card->update([
                'single_link' => $request->input('is_single_link'),
                //'lead_capture_mode'=>$leadCaptureMode

            ]);
            return $this->ok(__('messages.single_link_updated'),$card,200);

        } catch (Exception $e) {
            //Log::error('Error updating lead capture setting: ' . $e->getMessage());
            throw new CustomException(__('errors.unexpected_error'), 500);
        }


    }

    /**
     * @throws AuthorizationException
     * @throws CustomException
     */
    public function toggleLeadCapture(Request $request, $card): JsonResponse
    {

        $this->authorize('update', $card);

        try {
            $enabled = $request->input('is_lead_capture_enabled');

            $card->update([
                'lead_capture_mode' => $enabled,
            ]);

            $messageKey = $enabled ? 'lead_capture_enabled' : 'lead_capture_disabled';

            return $this->ok(__('messages.' . $messageKey), $card, 200);

        } catch (Exception $e) {
            throw new CustomException(__('errors.unexpected_error'), 500);
        }
    }


}
