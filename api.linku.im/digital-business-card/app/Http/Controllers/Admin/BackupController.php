<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Card;
use App\Models\User;
use App\Models\BackupSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class BackupController extends Controller
{
    /**
     * Export cards to JSON/CSV
     */
    public function exportCards(Request $request)
    {
        $request->validate([
            'format' => 'required|in:json,csv',
            'from' => 'nullable|integer|min:1',
            'to' => 'nullable|integer|min:1',
        ]);

        $format = $request->input('format', 'json');
        $from = $request->input('from', 1);
        $to = $request->input('to');

        $query = Card::with(['user', 'cardUser'])->orderBy('id');

        if ($to) {
            $cards = $query->skip($from - 1)->take($to - $from + 1)->get();
        } else {
            $cards = $query->get();
        }

        $exportData = $cards->map(function ($card) {
            return [
                'id' => $card->id,
                'user_id' => $card->user_id,
                'slug' => $card->slug,
                'title' => $card->title,
                'description' => $card->description,
                'status' => $card->status,
                'card_number' => $card->card_number ?? null,
                'card_user' => $card->cardUser ? [
                    'first_name' => $card->cardUser->first_name,
                    'last_name' => $card->cardUser->last_name,
                    'email' => $card->cardUser->email,
                    'phone' => $card->cardUser->phone,
                    'job_title' => $card->cardUser->job_title,
                    'company' => $card->cardUser->company,
                    'bio' => $card->cardUser->bio,
                ] : null,
                'created_at' => $card->created_at?->toDateTimeString(),
                'updated_at' => $card->updated_at?->toDateTimeString(),
            ];
        });

        if ($format === 'csv') {
            return $this->exportToCsv($exportData->toArray(), 'cards');
        }

        return response()->json([
            'success' => true,
            'data' => $exportData,
            'count' => $exportData->count(),
            'exported_at' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Import cards from JSON/CSV
     */
    public function importCards(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json,csv,txt',
            'mode' => 'required|in:append,replace',
        ]);

        $file = $request->file('file');
        $mode = $request->input('mode', 'append');
        $content = file_get_contents($file->getPathname());
        $extension = $file->getClientOriginalExtension();

        try {
            if ($extension === 'csv') {
                $data = $this->parseCsv($content);
            } else {
                $decoded = json_decode($content, true);
                $data = $decoded['data'] ?? $decoded;
            }

            if ($mode === 'replace') {
                Card::truncate();
            }

            $imported = 0;
            $errors = [];

            foreach ($data as $index => $cardData) {
                try {
                    $this->createOrUpdateCard($cardData, $mode);
                    $imported++;
                } catch (Exception $e) {
                    $errors[] = "Row {$index}: " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$imported} cards",
                'imported' => $imported,
                'errors' => $errors,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Export users to JSON/CSV
     */
    public function exportUsers(Request $request)
    {
        $request->validate([
            'format' => 'required|in:json,csv',
            'from' => 'nullable|integer|min:1',
            'to' => 'nullable|integer|min:1',
        ]);

        $format = $request->input('format', 'json');
        $from = $request->input('from', 1);
        $to = $request->input('to');

        $query = User::orderBy('id');

        if ($to) {
            $users = $query->skip($from - 1)->take($to - $from + 1)->get();
        } else {
            $users = $query->get();
        }

        $exportData = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'email_verified_at' => $user->email_verified_at?->toDateTimeString(),
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ];
        });

        if ($format === 'csv') {
            return $this->exportToCsv($exportData->toArray(), 'users');
        }

        return response()->json([
            'success' => true,
            'data' => $exportData,
            'count' => $exportData->count(),
            'exported_at' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Import users from JSON/CSV
     */
    public function importUsers(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json,csv,txt',
            'mode' => 'required|in:append,replace',
        ]);

        $file = $request->file('file');
        $mode = $request->input('mode', 'append');
        $content = file_get_contents($file->getPathname());
        $extension = $file->getClientOriginalExtension();

        try {
            if ($extension === 'csv') {
                $data = $this->parseCsv($content);
            } else {
                $decoded = json_decode($content, true);
                $data = $decoded['data'] ?? $decoded;
            }

            if ($mode === 'replace') {
                // Keep admin users
                User::where('role', '!=', 'admin')->delete();
            }

            $imported = 0;
            $errors = [];

            foreach ($data as $index => $userData) {
                try {
                    $this->createOrUpdateUser($userData, $mode);
                    $imported++;
                } catch (Exception $e) {
                    $errors[] = "Row {$index}: " . $e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully imported {$imported} users",
                'imported' => $imported,
                'errors' => $errors,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create full database backup
     */
    public function createBackup(Request $request)
    {
        $request->validate([
            'destination' => 'required|in:local,sftp,github',
            'github_repo' => 'nullable|string',
            'github_token' => 'nullable|string',
            'github_branch' => 'nullable|string',
            'sftp_path' => 'nullable|string',
        ]);

        $destination = $request->input('destination');
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$timestamp}.sql";

        try {
            // Create SQL dump
            $sqlContent = $this->createSqlDump();

            // Save based on destination
            switch ($destination) {
                case 'local':
                    $path = $this->saveLocalBackup($sqlContent, $filename);
                    break;
                case 'sftp':
                    $sftpPath = $request->input('sftp_path', '/backups');
                    $path = $this->saveSftpBackup($sqlContent, $filename, $sftpPath);
                    break;
                case 'github':
                    $path = $this->saveGithubBackup(
                        $sqlContent,
                        $filename,
                        $request->input('github_repo'),
                        $request->input('github_token'),
                        $request->input('github_branch', 'main')
                    );
                    break;
            }

            // Log backup
            $this->logBackup($destination, $path, strlen($sqlContent));

            return response()->json([
                'success' => true,
                'message' => 'Backup created successfully',
                'path' => $path,
                'size' => $this->formatBytes(strlen($sqlContent)),
                'created_at' => now()->toDateTimeString(),
            ]);

        } catch (Exception $e) {
            Log::error('Backup failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Backup failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download backup file
     */
    public function downloadBackup(Request $request)
    {
        try {
            $sqlContent = $this->createSqlDump();
            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $filename = "backup_{$timestamp}.sql";

            return response($sqlContent)
                ->header('Content-Type', 'application/sql')
                ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Download failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Restore database from backup
     */
    public function restoreBackup(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:sql,txt',
        ]);

        $file = $request->file('file');
        $sqlContent = file_get_contents($file->getPathname());

        try {
            DB::unprepared($sqlContent);

            return response()->json([
                'success' => true,
                'message' => 'Database restored successfully',
            ]);

        } catch (Exception $e) {
            Log::error('Restore failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Restore failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get backup settings
     */
    public function getBackupSettings()
    {
        $settings = BackupSetting::first() ?? new BackupSetting();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Save backup settings
     */
    public function saveBackupSettings(Request $request)
    {
        $request->validate([
            'auto_backup_enabled' => 'required|boolean',
            'backup_frequency' => 'required|in:hourly,daily,weekly,monthly',
            'backup_time' => 'nullable|string',
            'backup_day' => 'nullable|integer|min:0|max:6',
            'backup_destinations' => 'required|array',
            'backup_destinations.*' => 'in:local,sftp,github',
            'github_repo' => 'nullable|string',
            'github_token' => 'nullable|string',
            'github_branch' => 'nullable|string',
            'github_is_private' => 'nullable|boolean',
            'sftp_enabled' => 'nullable|boolean',
            'sftp_host' => 'nullable|string',
            'sftp_username' => 'nullable|string',
            'sftp_password' => 'nullable|string',
            'sftp_path' => 'nullable|string',
            'retention_days' => 'nullable|integer|min:1|max:365',
        ]);

        $settings = BackupSetting::first() ?? new BackupSetting();
        $settings->fill($request->all());
        $settings->save();

        // Update scheduler if needed
        $this->updateBackupSchedule($settings);

        return response()->json([
            'success' => true,
            'message' => 'Backup settings saved successfully',
            'data' => $settings,
        ]);
    }

    /**
     * Get backup history
     */
    public function getBackupHistory()
    {
        $history = DB::table('backup_logs')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    /**
     * Run manual backup now
     */
    public function runBackupNow(Request $request)
    {
        $settings = BackupSetting::first();

        if (!$settings) {
            return response()->json([
                'success' => false,
                'message' => 'Please configure backup settings first',
            ], 400);
        }

        $results = [];
        $destinations = $settings->backup_destinations ?? ['local'];
        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$timestamp}.sql";

        try {
            $sqlContent = $this->createSqlDump();

            foreach ($destinations as $destination) {
                try {
                    switch ($destination) {
                        case 'local':
                            $path = $this->saveLocalBackup($sqlContent, $filename);
                            break;
                        case 'sftp':
                            $path = $this->saveSftpBackup($sqlContent, $filename, $settings->sftp_path ?? '/backups');
                            break;
                        case 'github':
                            $path = $this->saveGithubBackup(
                                $sqlContent,
                                $filename,
                                $settings->github_repo,
                                $settings->github_token,
                                $settings->github_branch ?? 'main'
                            );
                            break;
                    }

                    $this->logBackup($destination, $path, strlen($sqlContent));
                    $results[$destination] = ['success' => true, 'path' => $path];
                } catch (Exception $e) {
                    $results[$destination] = ['success' => false, 'error' => $e->getMessage()];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Backup completed',
                'results' => $results,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Backup failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test GitHub connection
     */
    public function testGithubConnection(Request $request)
    {
        $request->validate([
            'repo' => 'required|string',
            'token' => 'required|string',
            'branch' => 'nullable|string',
        ]);

        try {
            $repo = $request->input('repo');
            $token = $request->input('token');
            $branch = $request->input('branch', 'main');

            $client = new \GuzzleHttp\Client();
            $response = $client->get("https://api.github.com/repos/{$repo}", [
                'headers' => [
                    'Authorization' => "token {$token}",
                    'Accept' => 'application/vnd.github.v3+json',
                ],
            ]);

            $repoInfo = json_decode($response->getBody(), true);

            return response()->json([
                'success' => true,
                'message' => 'Connection successful',
                'repo_name' => $repoInfo['full_name'],
                'is_private' => $repoInfo['private'],
                'default_branch' => $repoInfo['default_branch'],
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Test SFTP connection
     */
    public function testSftpConnection(Request $request)
    {
        $request->validate([
            'host' => 'required|string',
            'username' => 'required|string',
            'password' => 'required|string',
            'path' => 'nullable|string',
        ]);

        try {
            $host = $request->input('host');
            $username = $request->input('username');
            $password = $request->input('password');
            $path = $request->input('path', '/');

            // Configure temporary SFTP disk
            config(['filesystems.disks.sftp_test' => [
                'driver' => 'sftp',
                'host' => $host,
                'username' => $username,
                'password' => $password,
                'port' => 22,
                'root' => $path,
                'timeout' => 10,
            ]]);

            // Test connection by listing directory
            $disk = Storage::disk('sftp_test');
            $directories = $disk->directories('/');

            return response()->json([
                'success' => true,
                'message' => 'SFTP connection successful',
                'directories' => $directories,
            ]);

        } catch (Exception $e) {
            Log::error('SFTP test failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    // ============ Private Helper Methods ============

    private function createSqlDump(): string
    {
        $tables = DB::select('SHOW TABLES');
        $dbName = config('database.connections.mysql.database');
        $tableKey = "Tables_in_{$dbName}";

        $sql = "-- Linku Database Backup\n";
        $sql .= "-- Generated: " . now()->toDateTimeString() . "\n";
        $sql .= "-- Database: {$dbName}\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            // Get create table statement
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
            $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

            // Get table data
            $rows = DB::table($tableName)->get();
            if ($rows->count() > 0) {
                $columns = array_keys((array)$rows->first());
                $columnNames = implode('`, `', $columns);

                foreach ($rows as $row) {
                    $values = array_map(function ($value) {
                        if (is_null($value)) return 'NULL';
                        return "'" . addslashes($value) . "'";
                    }, (array)$row);

                    $sql .= "INSERT INTO `{$tableName}` (`{$columnNames}`) VALUES (" . implode(', ', $values) . ");\n";
                }
                $sql .= "\n";
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";
        return $sql;
    }

    private function saveLocalBackup(string $content, string $filename): string
    {
        $path = storage_path("app/backups/{$filename}");
        $dir = dirname($path);

        if (!File::exists($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($path, $content);
        return $path;
    }

    private function saveSftpBackup(string $content, string $filename, string $remotePath): string
    {
        $settings = BackupSetting::first();

        $host = $settings->sftp_host ?? config('filesystems.disks.sftp.host') ?? env('STORE_FILE_SERVER_HOST');
        $username = $settings->sftp_username ?? config('filesystems.disks.sftp.username') ?? env('STORE_FILE_SERVER_USERNAME');
        $password = $settings->sftp_password ?? config('filesystems.disks.sftp.password') ?? env('STORE_FILE_SERVER_PASSWORD');

        // Configure SFTP disk dynamically
        config(['filesystems.disks.sftp_backup' => [
            'driver' => 'sftp',
            'host' => $host,
            'username' => $username,
            'password' => $password,
            'port' => 22,
            'root' => $remotePath,
            'timeout' => 30,
        ]]);

        $disk = Storage::disk('sftp_backup');
        $disk->put($filename, $content);

        return rtrim($remotePath, '/') . '/' . $filename;
    }

    private function saveGithubBackup(string $content, string $filename, string $repo, string $token, string $branch): string
    {
        $client = new \GuzzleHttp\Client();
        $path = "backups/{$filename}";

        // Check if file exists (to get SHA for update)
        $sha = null;
        try {
            $response = $client->get("https://api.github.com/repos/{$repo}/contents/{$path}?ref={$branch}", [
                'headers' => [
                    'Authorization' => "token {$token}",
                    'Accept' => 'application/vnd.github.v3+json',
                ],
            ]);
            $fileInfo = json_decode($response->getBody(), true);
            $sha = $fileInfo['sha'] ?? null;
        } catch (Exception $e) {
            // File doesn't exist, that's OK
        }

        // Create/Update file
        $payload = [
            'message' => "Backup: {$filename}",
            'content' => base64_encode($content),
            'branch' => $branch,
        ];

        if ($sha) {
            $payload['sha'] = $sha;
        }

        $client->put("https://api.github.com/repos/{$repo}/contents/{$path}", [
            'headers' => [
                'Authorization' => "token {$token}",
                'Accept' => 'application/vnd.github.v3+json',
            ],
            'json' => $payload,
        ]);

        return "github:{$repo}/{$path}";
    }

    private function logBackup(string $destination, string $path, int $size): void
    {
        DB::table('backup_logs')->insert([
            'destination' => $destination,
            'path' => $path,
            'size' => $size,
            'status' => 'success',
            'created_at' => now(),
        ]);
    }

    private function exportToCsv(array $data, string $type)
    {
        if (empty($data)) {
            return response()->json(['error' => 'No data to export'], 400);
        }

        $headers = array_keys($data[0]);
        $csv = implode(',', $headers) . "\n";

        foreach ($data as $row) {
            $values = array_map(function ($val) {
                if (is_array($val)) {
                    $val = json_encode($val);
                }
                return '"' . str_replace('"', '""', $val ?? '') . '"';
            }, array_values($row));
            $csv .= implode(',', $values) . "\n";
        }

        $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "{$type}_{$timestamp}.csv";

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    private function parseCsv(string $content): array
    {
        $lines = explode("\n", trim($content));
        $headers = str_getcsv(array_shift($lines));
        $data = [];

        foreach ($lines as $line) {
            if (empty(trim($line))) continue;
            $values = str_getcsv($line);
            $data[] = array_combine($headers, $values);
        }

        return $data;
    }

    private function createOrUpdateCard(array $data, string $mode): void
    {
        $cardData = [
            'user_id' => $data['user_id'] ?? auth()->id(),
            'slug' => $data['slug'] ?? Str::uuid(),
            'title' => $data['title'] ?? 'Imported Card',
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'active',
        ];

        if ($mode === 'append' && isset($data['id'])) {
            $existing = Card::find($data['id']);
            if ($existing) {
                $cardData['slug'] = $data['slug'] . '_' . Str::random(4);
            }
        }

        Card::create($cardData);
    }

    private function createOrUpdateUser(array $data, string $mode): void
    {
        // Normalize phone if provided
        $phone = null;
        if (!empty($data['phone'])) {
            try {
                $otpService = app(\App\Services\OtpService::class);
                $phone = $otpService->normalizePhone($data['phone']);
            } catch (\Exception $e) {
                // If phone is invalid, keep it null
                $phone = null;
            }
        }

        $userData = [
            'name' => $data['name'] ?? 'Imported User',
            'email' => $data['email'] ?? null,
            'phone' => $phone,
            'role' => $data['role'] ?? 'user',
            'status' => $data['status'] ?? 'active',
            'password' => bcrypt(Str::random(12)),
        ];

        if ($mode === 'append' && isset($data['email'])) {
            $existing = User::where('email', $data['email'])->first();
            if ($existing) {
                throw new Exception("User with email {$data['email']} already exists");
            }
        }

        User::create($userData);
    }

    private function updateBackupSchedule(BackupSetting $settings): void
    {
        // This would typically update a cron job or scheduler
        // For now, we'll rely on Laravel's scheduler in Console/Kernel.php
        Log::info('Backup schedule updated', ['settings' => $settings->toArray()]);
    }

    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }
}
