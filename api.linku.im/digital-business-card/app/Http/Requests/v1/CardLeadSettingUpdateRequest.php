<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CardLeadSettingUpdateRequest extends BaseFormRequest
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

        return [
            'formTitle' => 'sometimes|string|max:255',
            'submitButtonText' => 'sometimes|string|max:255',
            'formDisclaimer' => 'sometimes|string|max:255',
            'fields' => 'required|array',
            'fields.*.id' => 'required|string',
            'fields.*.label' => 'required|string',
            'fields.*.name' => 'required|string',
            'fields.*.type' => 'required|string|in:text,textarea,dropdown,checkbox,file',
            'fields.*.required' => 'boolean',
            'fields.*.options' => 'nullable|array',
            //
        ];
    }
}
