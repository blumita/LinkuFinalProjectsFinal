<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class CardVisitUpdateRequest extends BaseFormRequest
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
            'card_type' => 'sometimes|string|unique:card_products,identifier',
            'owner_name' => 'sometimes|string|max:255',
            'qr_link' => 'sometimes|string',
            'status' => 'in:active,inactive',
        ];
    }
}
