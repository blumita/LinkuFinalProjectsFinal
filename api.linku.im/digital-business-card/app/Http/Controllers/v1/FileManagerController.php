<?php

namespace App\Http\Controllers\v1;

use App\Http\Requests\v1\FileRequest;
use App\Services\FileManagerService;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class FileManagerController
{
    use HasApiResponses;

    protected FileManagerService $service;

    public function __construct(FileManagerService $service)
    {
        $this->service = $service;
    }

    /**
     * @throws ValidationException
     */
    public function upload(FileRequest $request): JsonResponse
    {

        $saved = $this->service->addFileToModel($request);

        $response = [];

        foreach ($saved as $file) {
            $response[$file['field']] = [
                'url' => media_path($file['path']),
            ];
        }

        return $this->ok(__('messages.file-manager.upload_success'), $response, 200);

    }

    public function update(FileRequest $request): void
    {

        $this->service->editFileInModel($request->validated());

    }

    /**
     * @throws ValidationException
     */
    public function delete(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'fieldName'     => ['required', 'string'],
            'modelType' => ['required', 'string'],
            'modelId'   => ['required', 'integer'],
        ]);

        $this->service->removeFileFromModel( $validated['fieldName'],
            $validated['modelType'],
            $validated['modelId']
        );

        return $this->ok('تصویر با موفقیت حذف شد',null,200);

    }
}
