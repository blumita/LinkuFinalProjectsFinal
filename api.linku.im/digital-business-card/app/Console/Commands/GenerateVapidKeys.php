<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class GenerateVapidKeys extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'webpush:vapid {--show : Display the keys instead of modifying files}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate VAPID keys for Web Push notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // Generate VAPID keys
            $vapidKeys = VAPID::createVapidKeys();
            
            $publicKey = $vapidKeys['publicKey'];
            $privateKey = $vapidKeys['privateKey'];
            
            if ($this->option('show')) {
                // Just display the keys
                $this->info('VAPID Keys Generated:');
                $this->line('');
                $this->line('Public Key:');
                $this->comment($publicKey);
                $this->line('');
                $this->line('Private Key:');
                $this->comment($privateKey);
                $this->line('');
                $this->info('Add these to your .env file:');
                $this->line('VAPID_PUBLIC_KEY=' . $publicKey);
                $this->line('VAPID_PRIVATE_KEY=' . $privateKey);
                $this->line('VAPID_SUBJECT=mailto:admin@linku.im');
                
                return Command::SUCCESS;
            }

            // Update .env file
            $envPath = base_path('.env');
            
            if (!file_exists($envPath)) {
                $this->error('.env file not found!');
                return Command::FAILURE;
            }

            $envContent = file_get_contents($envPath);
            
            // Define the keys to update
            $updates = [
                'VAPID_PUBLIC_KEY' => $publicKey,
                'VAPID_PRIVATE_KEY' => $privateKey,
            ];

            // Add VAPID_SUBJECT if not exists
            if (!str_contains($envContent, 'VAPID_SUBJECT=')) {
                $updates['VAPID_SUBJECT'] = 'mailto:admin@linku.im';
            }

            foreach ($updates as $key => $value) {
                $pattern = "/^{$key}=.*/m";
                $replacement = "{$key}={$value}";
                
                if (preg_match($pattern, $envContent)) {
                    $envContent = preg_replace($pattern, $replacement, $envContent);
                    $this->info("Updated {$key} in .env file");
                } else {
                    $envContent .= "\n{$replacement}";
                    $this->info("Added {$key} to .env file");
                }
            }

            file_put_contents($envPath, $envContent);

            $this->newLine();
            $this->info('✅ VAPID keys generated successfully!');
            $this->newLine();
            $this->line('Public Key:');
            $this->comment($publicKey);
            $this->newLine();
            $this->line('Private Key:');
            $this->comment($privateKey);
            $this->newLine();
            $this->warn('⚠️  Run the following command to apply changes:');
            $this->comment('php artisan config:clear');
            $this->newLine();

            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error('Failed to generate VAPID keys: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
