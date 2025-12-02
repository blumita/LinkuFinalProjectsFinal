<?php

namespace App\Http\Requests\v1;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;

class FileRequest extends BaseFormRequest
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
            // Ensure modelType is a valid class name
            'modelType' => ['required', 'string'],

            // Validate that modelId exists in the corresponding modelType table
            'modelId' => ['required','integer'],

            // Validate profile image (max 2MB)
            'profileImage' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',

            // Validate cover image (max 4MB)
            'coverImage' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:4096',

            // Validate logo image (max 1MB)
            'logoImage' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:1024',

            // Validate logo image (max 1MB)
            'customIcon' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:1024',

            // Validate logo image (max 2MB)
            'imageCardProduct' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',

            // Validate logo image (max 5MB)
            'fileData' => 'sometimes|mimes:jpeg,png,jpg,webp,pdf|max:6144',
        ];
    }
}
