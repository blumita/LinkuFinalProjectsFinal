<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends BaseFormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'discount' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'features' => ['sometimes', 'array'],
            'features.*.title' => ['sometimes', 'string'],
            'features.*.description' => ['nullable', 'string'],
            'active' => ['required', 'in:draft,active,inactive'],
            'popularity' => ['required', 'in:normal,recommended,highlighted'],
        ];
    }
}
