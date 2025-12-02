<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class FileManagerService
{
    protected string $disk;

    public function __construct()
    {
        $this->disk = config('file-manager.disk');
    }

    /**
     * @throws ValidationException
     */
    public function addFileToModel($data): Collection
    {
        $model = $this->findModelInstance(
            $this->resolveModelClass($data['modelType'])
            , $data['modelId']);

        $storedFiles = $this->handleRequestFiles($data, $data['modelType'], $model);

        return collect($storedFiles)->map(function ($fileData) use ($model) {
            return $model->files()->create([
                'path' => $fileData['path'],
                'original_name' => $fileData['original_name'],
                'mime_type' => $fileData['mime_type'],
                'size' => $fileData['size'],
                'field' => $fileData['field'],
            ]);
        });
    }

    public function editFileInModel($file)
    {

    }

    /**
     * @throws ValidationException
     */
    public function removeFileFromModel($fieldName, $model, $modelId): void
    {
        if (!$model instanceof Model) {

            $model = $this->findModelInstance(
                $this->resolveModelClass($model)
                , $modelId
            );
        }

        $existingFile = $model->files()->where('field', $fieldName)->first();
        if ($existingFile) {
            Storage::disk($this->disk)->delete($existingFile->path);
            $existingFile->delete();
        }


    }

    /**
     * @throws ValidationException
     */
    protected function resolveModelClass(string $alias): string
    {
        $modelMap = config('file-manager.model_map');

        if (!array_key_exists($alias, $modelMap)) {
            throw ValidationException::withMessages([
                'model_type' => [__('file-manager.invalid_model_type')],
            ]);
        }

        return $modelMap[$alias];
    }

    protected function findModelInstance(string $modelClass, int $id): Model
    {
        /** @var Model $modelClass */

        return $modelClass::findOrFail($id);
    }

    public function handleRequestFiles($request, string $context = null, $model = null): array
    {
        $stored = [];
        $index = 1;

        foreach ($request->allFiles() as $key => $fileOrFiles) {
            $files = is_array($fileOrFiles) ? $fileOrFiles : [$fileOrFiles];

            foreach ($files as $file) {
                if ($file instanceof UploadedFile) {
                    $field = $key ?: 'file_' . $index++;
                    $folder = $context ? "{$context}/{$field}" : $field;

                    if ($model) {
                        $existingFile = $model->files()->where('field', $field)->first();
                        if ($existingFile) {
                            Storage::disk($this->disk)->delete($existingFile->path);
                            $existingFile->delete();
                        }
                    }

                    $path = Storage::disk($this->disk)->putFile($folder, $file);

                    $stored[] = [
                        'field' => $field,
                        'original_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'path' => $path,
                    ];
                }
            }
        }
        return $stored;
    }

    function base64ToUploadedFile(string $base64, string $name = 'image.png'): UploadedFile
    {
        $decoded = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64));

        $tmpFile = tempnam(sys_get_temp_dir(), 'base64_');
        file_put_contents($tmpFile, $decoded);
        return new UploadedFile(
            $tmpFile,
            $name,
            null,
            null,
            true // Mark test mode for avoiding file existence check
        );
    }

}
