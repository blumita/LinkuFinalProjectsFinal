<?php

namespace App\Http\Resources\v1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            //initial data card
            'id' => $this->id,
            'slug'=>$this->slug,
            'isDefault'=>$this->is_default,
            //Card data
            'name'=>$this->card_name,
            'layoutMode'=>$this->layout_mode,
            'cover' => media_path($this->cover->path??''),
            'logo' => media_path($this->logo->path??''),
            'avatar' => media_path($this->avatar->path??''),
            'saveContact'=>$this->save_contact,
            'themeColor'=>$this->theme_color,
            'iconColor'=>$this->icon_color,
            'matchThemeColor'=>$this->match_theme_color,
            'removeBranding' => $this->creator?->remove_branding ?? false,
            'views' => $this->views->count(),
            'isActive'=>$this->is_active,
            'url'=>env('APP_URL').'/profile/'.$this->slug,

            //User card data
            'userName'=>$this->user?->name,
            'location'=>$this->user?->location,
            'job'=>$this->user?->job,
            'company'=>$this->user?->company,
            'bio'=>$this->user?->bio,

            //Links data list
            'leadCaptureMode' => $this->lead_capture_mode,
            'singleLink'=>$this->single_link,
            'linksDataList' => CardLinkResource::collection(
                $this->single_link
                    ? $this->links->partition(fn($link) => $link->asSelectedSingleLink)[0]
                    ->concat($this->links->partition(fn($link) => $link->asSelectedSingleLink)[1])
                    : $this->links
            ),
            //Lead setting data
            'formTitle'=>$this->leadSetting?->form_title,
            'fields'=>$this->leadSetting?->fields,
            'submitButtonText'=>$this->leadSetting?->submit_button_text,
            'formDisclaimer'=>$this->leadSetting?->form_disclaimer,

            //Lead card form data
            'isDefaultLead' => $this->leads()->where('is_default', true)->exists(),
            'leads'=>CardLeadResource::collection($this->leads),

             //Qr setting data
            'qrColor'=>$this->qr?->qr_color,
            'qrBgColor'=>$this->qr?->qr_bg_color,
            'qrLogoSize'=>$this->qr?->qr_logo_size,
            'qrLogoRadius'=>$this->qr?->qr_logo_radius,
            'qrSize'=>$this->qr?->qr_size,
            'qrMargin'=>$this->qr?->qr_margin,
            'qrLogo'=>$this->getQrLogoUrl(),



            //timestamp
            'createdAt'=>$this->created_at->format('Y-m-d'),
            'updatedAt'=>$this->updated_at->format('Y-m-d'),
            ];
    }

    //Get url logo qr
    public function getQrLogoUrl(): ?string
    {

        $logo = $this->qr?->logo->path??null;

        if (!$logo) {
            return null;
        }

        if (str_starts_with($logo, '/logo/')) {
            return $logo;
        }

        return media_path($logo);
    }
}
