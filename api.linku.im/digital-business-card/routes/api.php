<?php

use App\Http\Controllers\Admin\CardProductController;
use App\Http\Controllers\Admin\CardVisitController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\v1\CardController;
use App\Http\Controllers\v1\CardLeadController;
use App\Http\Controllers\v1\CardLeadSettingController;
use App\Http\Controllers\v1\CardLinkController;
use App\Http\Controllers\v1\CardQrController;
use App\Http\Controllers\v1\CardSettingController;
use App\Http\Controllers\v1\CardUserController;
use App\Http\Controllers\v1\FileManagerController;
use App\Http\Controllers\v1\LicenseController;
use App\Http\Controllers\v1\LuckyDiceController;
use App\Http\Controllers\v1\LuckyEggController;
use App\Http\Controllers\v1\LuckyWheelController;
use App\Http\Controllers\v1\OrderController;
use App\Http\Controllers\v1\OtpCodeController;
use App\Http\Controllers\v1\PaymentController;
use App\Http\Controllers\v1\PlanController;
use App\Http\Controllers\v1\PollController;
use App\Http\Controllers\v1\SubscriptionController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\TutorialController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\v1\TransactionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| This file defines all API endpoints for the application.
| Routes are versioned and grouped for scalability and maintainability.
|
*/

// Broadcasting Authentication (for Laravel Reverb / WebSocket)
Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::prefix('auth')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | OTP Authentication Routes
    |--------------------------------------------------------------------------
    |
    | Endpoints for sending and verifying one-time passwords (OTP) used for
    | secure user authentication via SMS. These routes are rate-limited to
    | prevent abuse and ensure reliable delivery.
    |
    */
    Route::middleware(['throttle:otp','log.activity'])->group(function () {

        // Phone OTP
        Route::post('/sendOtpCode', [OtpCodeController::class, 'sendOtpCode'])
            ->name('otp.send');

        Route::post('/verifyOtpCode', [OtpCodeController::class, 'verifyOtpCode'])
            ->name('otp.verify');

        Route::post('/verifyPhoneChange', [OtpCodeController::class, 'verifyPhoneChange'])
            ->name('otp.verifyPhoneChange')
            ->middleware('auth:sanctum');

        // Email OTP
        Route::post('/sendEmailOtp', [OtpCodeController::class, 'sendEmailOtp'])
            ->name('otp.email.send');

        Route::post('/verifyEmailOtp', [OtpCodeController::class, 'verifyEmailOtp'])
            ->name('otp.email.verify');

        // Admin Email OTP
        Route::post('/admin/sendOtpEmail', [OtpCodeController::class, 'sendAdminEmailOtp'])
            ->name('admin.otp.email.send');

        Route::post('/admin/verifyOtpEmail', [OtpCodeController::class, 'verifyAdminEmailOtp'])
            ->name('admin.otp.email.verify');

        // Admin Phone OTP
        Route::post('/admin/sendOtpSms', [OtpCodeController::class, 'sendAdminPhoneOtp'])
            ->name('admin.otp.sms.send');

        Route::post('/admin/verifyOtpSms', [OtpCodeController::class, 'verifyAdminPhoneOtp'])
            ->name('admin.otp.sms.verify');

        // Admin Password Login with 2FA
        Route::post('/admin/loginWithPassword', [OtpCodeController::class, 'adminLoginWithPassword'])
            ->name('admin.login.password');

        Route::post('/admin/verify2FA', [OtpCodeController::class, 'verifyAdmin2FA'])
            ->name('admin.verify.2fa');

        // Admin Direct Login (NO OTP) - برای ورود با نام کاربری
        Route::post('/admin/directLogin', [OtpCodeController::class, 'adminDirectLogin'])
            ->middleware(['throttle:admin.login', 'anti.bruteforce'])
            ->name('admin.direct.login');
    });

    Route::post('/login', [OtpCodeController::class, 'LoginWithPass'])
        ->middleware(['throttle:admin.login', 'anti.bruteforce'])
        ->name('admin.login');


});

/*
|--------------------------------------------------------------------------
| SmartPayment API Routes
|--------------------------------------------------------------------------
|
| These routes handle payment initiation and gateway callbacks.
| The `pay` route is protected by API authentication middleware,
| while the `callback` route is publicly accessible for gateway responses.
|
*/

// Handle payment gateway callback (publicly accessible)
Route::get('/callback/payment', [PaymentController::class, 'callbackPayment'])
    ->name('callback.payment');

Route::middleware(['auth:sanctum','log.activity'])
    ->group(function () {
    // Initiate a payment request (requires authentication)
    Route::post('/payment', [PaymentController::class, 'initiatePayment'])
        ->name('initiate.payment');
});


Route::middleware(['auth:sanctum','log.activity'])
    ->prefix('v1')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Digital Business Card Routes
    |--------------------------------------------------------------------------
    |
    | Endpoints for creating and managing digital business cards and their
    | associated resources such as users, leads, and QR codes.
    |
    */

    Route::prefix('cards')->group(function () {

        Route::post('/createDefaultCard', [CardController::class, 'createDefaultCard'])
            ->name('cards.createDefaultCard');

        // Create a new digital business card
        Route::post('/', [CardController::class, 'store'])
            ->name('cards.store');
        Route::get('/', [CardController::class, 'index'])
            ->name('cards.index');
        Route::get('/activateDevices', [LicenseController::class, 'activeDevices'])
            ->name('cards.active.devices');
        Route::get('{card}/votes', [PollController::class, 'votes'])
            ->name('card.votes')
            ->where('card', '[0-9]+');

        // Group routes for a specific card
        Route::middleware(['card.owner'])->prefix('{card}')->group(function () {

            Route::get('/', [CardController::class, 'show'])
                ->name('cards.show');

            Route::put('/update', [CardController::class, 'update'])
                ->name('cards.update');
            Route::put('/delete', [CardController::class, 'destroy'])
                ->name('cards.delete');

            // Attach a user to the specified card
            Route::post('/user', [CardUserController::class, 'store'])
                ->name('cards.user.store');

            // Generate or store a links code for the specified card
            Route::post('/links', [CardLinkController::class, 'store'])
                ->name('cards.links.store');
            Route::put('/links/{link}/update', [CardLinkController::class, 'update'])
                ->name('cards.links.update');
            Route::put('/links/{link}/toggleSelectedAsSingleLink', [CardLinkController::class, 'toggleSelectedAsSingleLink'])
                ->name('cards.links.toggleSelectedAsSingleLink');
            Route::delete('/links/{link}', [CardLinkController::class, 'destroy'])
                ->name('cards.links.delete');
            Route::post('/links/reorder', [CardLinkController::class, 'reorder'])
                ->name('cards.links.reorder');

            //forms
            Route::get('/forms', [FormController::class, 'index'])
                ->name('cards.forms.index');
            Route::get('/forms/formsCount', [FormController::class, 'formsCount'])
                ->name('cards.forms.formsCount');
            Route::get('/forms/readAll', [FormController::class, 'readAll'])
                ->name('cards.forms.readAll');


            // Submit a leads for the specified card
            Route::get('/leads', [CardLeadController::class, 'index'])
                ->name('cards.leads.index');
            Route::get('/leads/leadsCount', [CardLeadController::class, 'leadsCount'])
                ->name('cards.leads.leadsCount');
            Route::get('/leads/readAll', [CardLeadController::class, 'readAll'])
                ->name('cards.leads.readAll');
            Route::post('/leads', [CardLeadController::class, 'storeLeadDefault'])
                ->name('cards.leads.store');
            Route::put('/leads/{cardlead}/update', [CardLeadController::class, 'update'])
                ->name('cards.leads.update');
            Route::delete('/leads/{cardlead}', [CardLeadController::class, 'destroy'])
                ->name('cards.leads.delete');

            // Submit a leadsetting for the specified card
            Route::post('/leadsetting', [CardLeadSettingController::class, 'store'])
                ->name('cards.leadsetting.store');
            Route::put('/leadsetting/{leadsetting}/update', [CardLeadSettingController::class, 'update'])
                ->name('cards.leadsetting.update');
            Route::delete('/leadsetting/{leadsetting}', [CardLeadSettingController::class, 'destroy'])
                ->name('cards.leadsetting.delete');


            // Generate or store a QR code for the specified card
            Route::post('/qr', [CardQrController::class, 'store'])
                ->name('cards.qr.store');
            Route::put('/qr/{cardqr}/update', [CardQrController::class, 'update'])
                ->name('cards.qr.update');


            // -----------------------------------------------
            // Settings & Toggles for the specified card
            // -----------------------------------------------

            Route::patch('/singlelink', [CardSettingController::class, 'toggleSingleLink'])
                ->name('cards.singlelink.status.toggle');

            Route::patch('/leadcapture', [CardSettingController::class, 'toggleLeadCapture'])
                ->name('cards.leadcapture.status.toggle');

            Route::patch('/links/{link}', [CardLinkController::class, 'toggleStatusLink'])
                ->name('cards.links.status.toggle');

            // -----------------------------------------------
            // Active Devices
            // -----------------------------------------------

            Route::post('/activateDevice', [LicenseController::class, 'activateDevice'])
                ->name('cards.activate.device');
            Route::post('/deactivateDevice', [LicenseController::class, 'deactivateDevice'])
                ->name('cards.deactivate.device');
        });
    });
});

// Cards
Route::middleware(['log.activity'])
    ->prefix('cards')
    ->name('cards.')
    ->group(function () {

    Route::get('{slug}/preview', [CardController::class, 'preview'])
        ->name('preview');

    Route::get('{slug}/hasBlueTick', [CardController::class, 'hasBlueTick'])
        ->name('hasBlueTick');

    Route::get('{card}/views', [CardController::class, 'getViews'])
        ->name('views.index')
        ->middleware('auth:sanctum');

    Route::post('{slug}/recordViews', [CardController::class, 'recordView'])
        ->name('views.store');

});

// Links
Route::middleware(['log.activity'])
    ->prefix('links')
    ->name('links.')
    ->group(function () {

    Route::post('{link:hash}/recordClick', [CardLinkController::class, 'recordClick'])
        ->name('views.store.recordClick');
    Route::get('{link}/views', [CardLinkController::class, 'getViews'])
        ->name('views.index')
        ->middleware('auth:sanctum');

    Route::get('{link:hash}/polls', [PollController::class, 'show'])
        ->name('polls.show');

    Route::get('{link:hash}/votes/readAll', [PollController::class, 'readAll'])
        ->name('votes.readAll');

    Route::post('{link:hash}/vote/{optionId}', [PollController::class, 'vote'])
        ->name('vote');
});


Route::middleware(['log.activity'])
    ->prefix('file-manager')
    ->name('file-manager.')
    ->group(function () {

    /*
    |--------------------------------------------------------------------------
    | File Manager Routes
    |--------------------------------------------------------------------------
    |
    | These endpoints handle file operations such as uploading, updating,
    | and deleting files. All routes are grouped under the 'file-manager'
    | prefix and follow RESTful conventions. Middleware can be added to
    | enforce authentication, authorization, or rate limiting.
    |
    */

    Route::middleware(['auth:sanctum', 'model.owner'])->group(function () {

        // Upload a new file
        Route::post('{id}/upload', [FileManagerController::class, 'upload'])
            ->name('upload');

        // Update file metadata or replace content
        Route::post('{id}/update', [FileManagerController::class, 'update'])
            ->name('update');

        // Delete a file
        Route::delete('{id}/delete', [FileManagerController::class, 'delete'])
            ->name('delete');
    });

});

Route::middleware(['auth:sanctum','log.activity'])
    ->prefix('user')
    ->group(function () {

    Route::get('/logout', [UserController::class, 'logout'])
        ->name('user.logout');

    // Get user
    Route::get('/', [UserController::class, 'index'])
        ->name('user.index');

    Route::put('/update', [UserController::class, 'update'])
        ->name('user.update');

    Route::get('/checkUsername', [UserController::class, 'checkUsername'])
        ->name('user.checkUsername');

    Route::post('/setReferralCode', [UserController::class, 'setReferralCode'])
        ->name('user.setReferralCode');

    Route::get('/subscription/status', [SubscriptionController::class, 'check'])
        ->name('user.subscription.check');

    Route::post('/support/contact', [SupportController::class, 'send'])
        ->name('user.support.contact.send');

    // Push Subscription Management
    Route::post('/push-subscription', [PushSubscriptionController::class, 'store'])
        ->name('user.push-subscription.store');
    
    Route::delete('/push-subscription', [PushSubscriptionController::class, 'destroy'])
        ->name('user.push-subscription.destroy');

    // Role & Permission - User Routes
    Route::get('/menu', [RoleController::class, 'getUserMenuTree'])
        ->name('user.menu');
    
    Route::post('/check-permission', [RoleController::class, 'checkPermission'])
        ->name('user.check-permission');

    Route::prefix('notifications')->group(function () {

        Route::get('/', [NotificationController::class, 'index'])
            ->name('notify.index');

        Route::post('{id}/read', [NotificationController::class, 'read'])
            ->name('notify.read');

        Route::post('/readAll', [NotificationController::class, 'readAll'])
            ->name('notify.readAll');

    });
    
    // Push Subscription Routes for regular users
    Route::post('/push-subscription', [PushSubscriptionController::class, 'storeUserSubscription'])
        ->name('user.push-subscription.store');
    Route::delete('/push-subscription', [PushSubscriptionController::class, 'destroyUserSubscription'])
        ->name('user.push-subscription.destroy');
    Route::post('/push-subscription/test', [PushSubscriptionController::class, 'sendTestNotification'])
        ->name('user.push-subscription.test');


    Route::prefix('admin')->group(function () {

        Route::post('/generateLicense/{cardproduct}', [LicenseController::class, 'generateLicense'])
            /*->middleware(['role:admin'])*/;

        Route::get('/settings', [SettingsController::class, 'index']);
        Route::post('/settings', [SettingsController::class, 'store']);
        Route::post('/settings/change-password', [SettingsController::class, 'changePassword']);
        Route::get('/settings/sms', [SettingsController::class, 'getSmsSettings']);
        Route::post('/settings/sms', [SettingsController::class, 'updateSmsSettings']);
        Route::get('/settings/payment', [SettingsController::class, 'getPaymentSettings']);
        Route::post('/settings/payment', [SettingsController::class, 'updatePaymentSettings']);

        Route::get('/notifications', [NotificationController::class, 'adminNotifications'])
            ->name('admin.notify.notifications');

        Route::post('/notifications/send', [NotificationController::class, 'sendNotification'])
            ->name('admin.notify.send')
            ->middleware('auth:sanctum');

        Route::get('/notifications/history', [NotificationController::class, 'notificationHistory'])
            ->name('admin.notify.history');

        Route::get('/notifications/scheduled', [NotificationController::class, 'scheduledNotifications'])
            ->name('admin.notify.scheduled');

        Route::delete('/notifications/history/{id}', [NotificationController::class, 'deleteNotificationHistory'])
            ->name('admin.notify.delete');

        Route::put('/notifications/history/{id}', [NotificationController::class, 'updateNotificationHistory'])
            ->name('admin.notify.update');

        // Role & Permission Management
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])
                ->name('admin.roles.index');
            
            Route::post('/', [RoleController::class, 'store'])
                ->name('admin.roles.store');
            
            Route::get('/{id}', [RoleController::class, 'show'])
                ->name('admin.roles.show');
            
            Route::put('/{id}', [RoleController::class, 'update'])
                ->name('admin.roles.update');
            
            Route::delete('/{id}', [RoleController::class, 'destroy'])
                ->name('admin.roles.destroy');
            
            Route::post('/{id}/permissions', [RoleController::class, 'updatePermissions'])
                ->name('admin.roles.permissions.update');
        });

        Route::get('/permissions/tree', [RoleController::class, 'getPermissionsTree'])
            ->name('admin.permissions.tree');

        Route::get('/', [UserController::class, 'admins'])
            ->name('user.admin.admins');

        Route::get('/profiles', [UserController::class, 'profiles'])
            ->name('user.admin.profiles');

        Route::patch('/profiles/toggleStatus/{id}', [UserController::class, 'toggleStatus'])
            ->name('user.admin.profiles.toggleStatus');

        Route::get('/transactions/all', [TransactionController::class, 'allTransactions'])
            ->name('transactions.all');

        Route::put('/{id}', [UserController::class, 'adminsUpdate'])
            ->name('user.admin.update');

        Route::delete('/{id}', [UserController::class, 'removeRoleAdmin'])
            ->name('user.admin.removeRoleAdmin');

        Route::post('/addAdmin', [UserController::class, 'createAdmin'])
            ->name('user.admin.createAdmin');
        //
        Route::get('/premiumMembers', [UserController::class, 'premiumMembersCount'])
            ->name('user.admin.premiumMembersCount');

        Route::get('/monthlyRevenue', [OrderController::class, 'monthlyRevenue'])
            ->name('user.admin.monthlyRevenue');

        Route::get('/monthlyPurchases', [OrderController::class, 'monthlyPurchases'])
            ->name('user.admin.monthlyPurchases');

        Route::get('/userList', [UserController::class, 'userList'])
            ->name('admin.userList');

        Route::get('/reports', [ReportController::class, 'reports'])
            ->name('admin.reports');
        Route::patch('/reports/toggleStatus/{id}', [ReportController::class, 'toggleStatus'])
            ->name('admin.reports.toggleStatus');

        //Card product
        Route::prefix('cardProducts')->group(function () {

            Route::get('/', [CardProductController::class, 'index'])
                ->name('cardProducts.index');

            Route::post('/', [CardProductController::class, 'store'])
                ->name('cardProducts.store');

            Route::put('/{id}', [CardProductController::class, 'update'])
                ->name('cardProducts.update');

            Route::patch('/{id}/status', [CardProductController::class, 'toggleStatus'])
                ->name('cardProducts.toggleStatus');

            Route::delete('/{id}', [CardProductController::class, 'destroy'])
                ->name('cardProducts.destroy');

        });

        //Card visit
        Route::prefix('cardVisit')->group(function () {

            Route::get('/', [CardVisitController::class, 'index'])
                ->name('cardVisit.index');

            Route::post('/', [CardVisitController::class, 'store'])
                ->name('cardVisit.store');

            Route::put('/{id}', [CardVisitController::class, 'update'])
                ->name('cardVisit.update');

            Route::patch('/{id}/status', [CardVisitController::class, 'toggleStatus'])
                ->name('cardVisit.toggleStatus');

            Route::delete('/{id}', [CardVisitController::class, 'destroy'])
                ->where('id', '[0-9]+')
                ->name('cardVisit.destroy');

            Route::delete('/bulkDelete', [CardVisitController::class, 'destroyCustom'])
                ->name('cardVisit.destroyCustom');

        });

        //Plans
        Route::prefix('plan')->group(function () {

            Route::get('/list', [PlanController::class, 'adminIndex'])
                ->name('plan.admin.list');

            Route::get('/show/{id}', [PlanController::class, 'show'])
                ->name('plan.show');

            Route::post('/store', [PlanController::class, 'store'])
                ->name('plan.store')
                ->middleware('auth:sanctum');

            Route::put('/update/{id}', [PlanController::class, 'update'])
                ->name('plan.update')
                ->middleware('auth:sanctum');;

            Route::delete('/delete/{id}', [PlanController::class, 'destroy'])
                ->name('plan.delete')
                ->middleware('auth:sanctum');;
        });

        //Faqs
        Route::prefix('faq')->group(function () {

            Route::get('/list', [FaqController::class, 'adminIndex'])
                ->name('faq.admin.list');

            Route::get('/show/{id}', [FaqController::class, 'show'])
                ->name('faq.show');

            Route::post('/store', [FaqController::class, 'store'])
                ->name('faq.store')
                ->middleware('auth:sanctum');

            Route::put('/update/{id}', [FaqController::class, 'update'])
                ->name('faq.update')
                ->middleware('auth:sanctum');;

            Route::delete('/delete/{id}', [FaqController::class, 'destroy'])
                ->name('faq.delete')
                ->middleware('auth:sanctum');;
        });

        //Features (ویژگی‌ها)
        Route::prefix('feature')->group(function () {

            Route::get('/list', [FeatureController::class, 'adminIndex'])
                ->name('feature.admin.list');

            Route::get('/show/{id}', [FeatureController::class, 'show'])
                ->name('feature.show');

            Route::post('/store', [FeatureController::class, 'store'])
                ->name('feature.store')
                ->middleware('auth:sanctum');

            Route::put('/update/{id}', [FeatureController::class, 'update'])
                ->name('feature.update')
                ->middleware('auth:sanctum');

            Route::patch('/{id}/status', [FeatureController::class, 'toggleStatus'])
                ->name('feature.toggleStatus')
                ->middleware('auth:sanctum');

            Route::post('/reorder', [FeatureController::class, 'reorder'])
                ->name('feature.reorder')
                ->middleware('auth:sanctum');

            Route::delete('/delete/{id}', [FeatureController::class, 'destroy'])
                ->name('feature.delete')
                ->middleware('auth:sanctum');
        });

        //Support
        Route::prefix('support')->group(function () {

            Route::get('/info', [SupportController::class, 'show'])
                ->name('support.admin.show');

            Route::put('/update', [SupportController::class, 'update'])
                ->name('support.admin.update')
                ->middleware('auth:sanctum');;
        });

        //Discounts
        Route::prefix('discount')->group(function () {

            // List all discount codes
            Route::get('/', [DiscountController::class, 'index'])
                ->name('discount.index');

            // Create a new discount code
            Route::post('/', [DiscountController::class, 'store'])
                ->name('discount.store');

            // Update an existing discount code
            Route::put('/update/{id}', [DiscountController::class, 'update'])
                ->name('discount.update');

            // Toggle active/inactive status
            Route::patch('/{id}/status', [DiscountController::class, 'toggleStatus'])
                ->name('discount.toggleStatus');

            // Delete a single discount code
            Route::delete('delete/{id}', [DiscountController::class, 'destroy'])
                ->where('id', '[0-9]+')
                ->name('discount.destroy');

            // Bulk delete multiple discount codes
            Route::delete('/bulkDelete', [DiscountController::class, 'destroyBulk'])
                ->name('discount.destroyBulk');

            // Preview the impact of a discount code on pricing
            Route::post('/preview', [DiscountController::class, 'preview'])
                ->name('discount.preview');

            // Assign a discount code to a specific user
            Route::post('/assign', [DiscountController::class, 'assignToUser'])
                ->name('discount.assignToUser');

        });

        //Tutorials (ویدیوهای آموزشی)
        Route::prefix('tutorial')->group(function () {

            Route::get('/list', [TutorialController::class, 'adminIndex'])
                ->name('tutorial.admin.list');

            Route::get('/show/{id}', [TutorialController::class, 'show'])
                ->name('tutorial.show');

            Route::get('/categories', [TutorialController::class, 'categories'])
                ->name('tutorial.categories');

            Route::post('/store', [TutorialController::class, 'store'])
                ->name('tutorial.store')
                ->middleware('auth:sanctum');

            Route::put('/update/{id}', [TutorialController::class, 'update'])
                ->name('tutorial.update')
                ->middleware('auth:sanctum');

            Route::patch('/{id}/status', [TutorialController::class, 'toggleStatus'])
                ->name('tutorial.toggleStatus')
                ->middleware('auth:sanctum');

            Route::post('/reorder', [TutorialController::class, 'reorder'])
                ->name('tutorial.reorder')
                ->middleware('auth:sanctum');

            Route::delete('/delete/{id}', [TutorialController::class, 'destroy'])
                ->name('tutorial.delete')
                ->middleware('auth:sanctum');
        });

        //Backup & Export/Import
        Route::prefix('backup')->group(function () {
            // Export endpoints
            Route::get('/export/cards', [BackupController::class, 'exportCards'])
                ->name('backup.export.cards');
            Route::get('/export/users', [BackupController::class, 'exportUsers'])
                ->name('backup.export.users');
            
            // Import endpoints
            Route::post('/import/cards', [BackupController::class, 'importCards'])
                ->name('backup.import.cards');
            Route::post('/import/users', [BackupController::class, 'importUsers'])
                ->name('backup.import.users');
            
            // Database backup
            Route::post('/create', [BackupController::class, 'createBackup'])
                ->name('backup.create');
            Route::get('/download', [BackupController::class, 'downloadBackup'])
                ->name('backup.download');
            Route::post('/restore', [BackupController::class, 'restoreBackup'])
                ->name('backup.restore');
            
            // Backup settings
            Route::get('/settings', [BackupController::class, 'getBackupSettings'])
                ->name('backup.settings.get');
            Route::post('/settings', [BackupController::class, 'saveBackupSettings'])
                ->name('backup.settings.save');
            
            // Backup history
            Route::get('/history', [BackupController::class, 'getBackupHistory'])
                ->name('backup.history');
            
            // Run backup now
            Route::post('/run-now', [BackupController::class, 'runBackupNow'])
                ->name('backup.run-now');
            
            // Test connections
            Route::post('/test/github', [BackupController::class, 'testGithubConnection'])
                ->name('backup.test.github');
            Route::post('/test/sftp', [BackupController::class, 'testSftpConnection'])
                ->name('backup.test.sftp');
        });

    });
});
Route::get('support/info', [SupportController::class, 'show'])
    ->name('support.show');
Route::get('plan/list', [PlanController::class, 'index'])
    ->name('plan.list');
Route::get('/user/discounts', [DiscountController::class, 'index'])
    ->name('discount.user.index');
Route::get('faq/list', [FaqController::class, 'index'])
    ->name('faq.list');

// Public Features API
Route::get('features', [FeatureController::class, 'index'])
    ->name('features.index');
Route::get('features/{idOrSlug}', [FeatureController::class, 'show'])
    ->name('features.show');

// Public Tutorials API
Route::get('tutorials', [TutorialController::class, 'index'])
    ->name('tutorials.index');
Route::get('tutorials/categories', [TutorialController::class, 'categories'])
    ->name('tutorials.categories');
Route::get('tutorials/{idOrSlug}', [TutorialController::class, 'show'])
    ->name('tutorials.show');

// Validate a discount code before applying
Route::post('discount/validate', [DiscountController::class, 'validateCode'])
    ->name('discount.validate');
// Apply a discount code to an order or user
Route::post('discount/apply', [DiscountController::class, 'apply'])
    ->name('discount.apply');

Route::middleware(['auth:sanctum','log.activity'])
    ->prefix('transactions')
    ->group(function () {

    Route::get('/list', [TransactionController::class, 'index'])
        ->name('transactions.index');
});

Route::middleware(['auth:sanctum','log.activity'])
    ->prefix('club')
    ->group(function () {

    Route::post('{link:hash}/recordForm', [CardLinkController::class, 'recordForm'])
        ->name('views.store.form');

    Route::post('{link:hash}/recordQuestion', [CardLinkController::class, 'recordQuestion'])
        ->name('views.store.question');
    Route::get('{card}/questions', [CardLinkController::class, 'getQuestions'])
        ->name('views.question');
    Route::get('{card}/questions/questionsCount', [CardLinkController::class, 'questionsCount'])
        ->name('views.questionsCount');
    Route::get('{card}/questions/readAllQuestions', [CardLinkController::class, 'readAllQuestions'])
        ->name('views.readAllQuestions');



    Route::get('{card}/luckyEgg/resultCount', [LuckyEggController::class, 'resultCount'])
        ->name('links.lucyEgg.resultCount');
    Route::get('{card}/luckyEgg/allResults', [LuckyEggController::class, 'allResults'])
        ->name('links.lucyEgg.allResults');
    Route::get('{card}/luckyEgg/readAll', [LuckyEggController::class, 'readAll'])
        ->name('links.luckyEgg.readAll');
    Route::post('{link:hash}/luckyEgg/result', [LuckyEggController::class, 'result'])
        ->name('links.lucyEgg.result');
    Route::get('{link:hash}/luckyEgg/prizes', [LuckyEggController::class, 'prizes'])
        ->name('links.luckyEgg.prizes');
    Route::get('{link:hash}/luckyEgg/check', [LuckyEggController::class, 'check'])
        ->name('links.luckyEgg.check');


    Route::get('{card}/luckyWheel/resultCount', [LuckyWheelController::class, 'resultCount'])
        ->name('links.luckyWheel.resultCount');
    Route::get('{card}/luckyWheel/allResults', [LuckyWheelController::class, 'allResults'])
        ->name('links.luckyWheel.allResults');
    Route::get('{card}/luckyWheel/readAll', [LuckyWheelController::class, 'readAll'])
        ->name('links.luckyWheel.readAll');
    Route::post('{link:hash}/luckyWheel/result', [LuckyWheelController::class, 'result'])
        ->name('links.luckyWheel.result');
    Route::get('{link:hash}/luckyWheel/prizes', [LuckyWheelController::class, 'prizes'])
        ->name('links.luckyWheel.prizes');
    Route::get('{link:hash}/luckyWheel/check', [LuckyWheelController::class, 'check'])
        ->name('links.luckyWheel.check');

    Route::get('{card}/luckyDice/allResults', [LuckyDiceController::class, 'allResults'])
        ->name('links.luckyDice.allResults');
    Route::get('{card}/luckyDice/resultCount', [LuckyDiceController::class, 'resultCount'])
        ->name('links.luckyDice.resultCount');
    Route::get('{card}/luckyDice/readAll', [LuckyDiceController::class, 'readAll'])
        ->name('links.luckyDice.readAll');
    Route::post('{link:hash}/luckyDice/result', [LuckyDiceController::class, 'result'])
        ->name('links.luckyDice.result');
    Route::get('{link:hash}/luckyDice/prizes', [LuckyDiceController::class, 'prizes'])
        ->name('links.luckyDice.prizes');
    Route::get('{link:hash}/luckyDice/check', [LuckyDiceController::class, 'check'])
        ->name('links.luckyDice.check');
});


/*
|--------------------------------------------------------------------------
| Admin User Profile Route
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/me', [UserController::class, 'adminMe'])
            ->name('admin.me');
        
        // Security Dashboard Routes
        Route::prefix('security')->group(function () {
            Route::get('/stats', [SecurityController::class, 'getSecurityStats'])
                ->name('admin.security.stats');
            Route::post('/unblock-ip', [SecurityController::class, 'unblockIP'])
                ->name('admin.security.unblock');
            Route::post('/clear-blocked', [SecurityController::class, 'clearAllBlocked'])
                ->name('admin.security.clear');
        });
    });

Route::middleware(['auth:sanctum'])
    ->prefix('user')
    ->group(function () {
        Route::get('/admin/me', [UserController::class, 'adminMe'])
            ->name('user.admin.me'); // Keep for backward compatibility
        
        // Admin Management Routes
        Route::get('/admin', [UserController::class, 'admins'])
            ->name('user.admins.list');
        Route::post('/admin/addAdmin', [UserController::class, 'adminsCreate'])
            ->name('user.admins.create');
        Route::put('/admin/{id}', [UserController::class, 'adminsUpdate'])
            ->name('user.admins.update');
        Route::delete('/admin/{id}', [UserController::class, 'adminsDelete'])
            ->name('user.admins.delete');
        
        // Push Subscription Routes
        Route::post('/admin/push-subscription', [PushSubscriptionController::class, 'store'])
            ->name('user.admin.push-subscription.store');
        Route::get('/admin/push-subscriptions', [PushSubscriptionController::class, 'index'])
            ->name('user.admin.push-subscriptions.index');
        Route::delete('/admin/push-subscription/{id?}', [PushSubscriptionController::class, 'destroy'])
            ->name('user.admin.push-subscription.destroy');
        Route::delete('/admin/push-subscription-by-endpoint', [PushSubscriptionController::class, 'destroyByEndpoint'])
            ->name('user.admin.push-subscription.destroy-by-endpoint');
    });


///////// UNAUTHORIZED ROUTES ////////////

Route::post('cards/{card:slug}/leadAddToCard', [CardLeadController::class, 'storeLead'])
    ->name('cards.leads.storeLead');


/*
|--------------------------------------------------------------------------
| Fallback Route
|--------------------------------------------------------------------------
|
| Handles undefined API endpoints with a standardized JSON response.
|
*/

Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found.',
        'status' => 404,
    ], 404);
});
