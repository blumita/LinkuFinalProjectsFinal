<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\v1\Controller;
use App\Http\Resources\v1\SecurityReportResource;
use App\Models\SecurityReport;
use App\Services\UserReportService;
use App\Traits\HasApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
   use HasApiResponses;
    public function reports(Request $request): JsonResponse
    {
        $reports=SecurityReport::latest()->get();

        return $this->ok('',SecurityReportResource::collection($reports),200);

    }
    public function toggleStatus(Request $request,$id): JsonResponse
    {

        $report = SecurityReport::find($id);

        $report->status=$request->input('status');

        $report->save();

        return $this->ok('', new SecurityReportResource($report),200);

    }
}
