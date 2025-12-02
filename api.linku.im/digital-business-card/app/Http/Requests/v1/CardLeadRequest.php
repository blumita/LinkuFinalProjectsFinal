<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use App\Models\CardLeadSetting;
use App\Rules\NoHtml;
use Illuminate\Contracts\Validation\ValidationRule;

class CardLeadRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $card=$this->route('card');

        return self::getRules($card->id);
    }

    public static function getRules($cardId): array
    {
        $settings = CardLeadSetting::where('card_id', $cardId)->first();
        $rules = [];

        if ($settings && is_array($settings->fields)) {
            foreach ($settings->fields as $field) {
                $r = [];

                $r[] = !empty($field['required']) ? 'required' : 'nullable';

                $type = $field['type'] ?? 'text';

                if ($type === 'email') {
                    $r[] = 'email';
                }

                if ($type === 'text') {
                    $r[] = 'string';
                    $r[] = 'max:255';
                    $r[] = new NoHtml();
                }

                if (!empty($field['name'])) {
                    $rules[$field['name']] = $r;
                }
            }
        }
        $rules['fieldLabels']='required';//|array;
        $rules['isDefault']='nullable|boolean';

        return $rules;
    }
}
