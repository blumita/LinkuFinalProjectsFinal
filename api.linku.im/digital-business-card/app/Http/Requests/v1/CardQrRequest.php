<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class CardQrRequest extends BaseFormRequest
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
            //
            'color' => 'nullable|string',
            'bgColor' => 'nullable|string',
            'logoRadius' => 'nullable|integer',
            'logoSize' => 'nullable|integer',
        ];
    }
}
