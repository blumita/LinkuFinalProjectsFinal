<?php

namespace App\Services;

use App\Enums\UserActivityNotificationType;
use App\Models\Card;
use App\Models\User;
use App\Notifications\UserActivityNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserService
{
    protected CardService $cardService;
    protected CardLinkService $cardLinkService;

    public function __construct(CardService $cardService, CardLinkService $cardLinkService)
    {
        $this->cardService = $cardService;
        $this->cardLinkService = $cardLinkService;
    }

    public function assignReferralCode($user, $data)
    {

        if (!empty($data['referred_code'])) {

            $referrer = User::where('referral_code', $data['referred_code'])->first();

            if ($referrer && $referrer->id !== $user->id) {

                $user->referred_by = $referrer->id;
            }
        }

        $user->name = $data['name'];

        $user->save();

        return $user;

    }

    /**
     * @throws ValidationException
     */
    public function createDefaultProfile($user): Card
    {
        $defaultData = [
            'cardName' => 'کارت پیش فرض',
            'layout' => 'right',
            'saveContact' => 'ذخیره مخاطب',
            'isDefault' => true,
            'themeColor'=>'{"background":"#22C55E","text":"#000000"}',
            'iconColor'=>'{"background":"#22C55E","text":"#ffffff"}',
            'matchThemeColor'=>'0',
            'name' => $user->name,
            'location' => '',
            'job' => '',
            'company' => '',
            'bio' => ''];

        $card = $this->cardService->createCardForUser($defaultData, $user);

        // Add email link if user has email
        if (!empty($user->email)) {
            $emailLink = [
                "id" => uniqid() . "_" . bin2hex(random_bytes(6)),
                "name" => "ایمیل",
                "title" => "ایمیل",
                "type" => "link",
                "action" => "email",
                "description" => "ارسال ایمیل",
                "baseUrl" => "mailto:",
                "value" => $user->email,
                "enabled" => true,
                "icon" => json_encode([
                    "type" => "component",
                    "name" => "email"
                ], JSON_UNESCAPED_UNICODE),
                "placeholder" => json_encode([
                    "title" => "ایمیل",
                    "link"  => "آدرس ایمیل (مثلاً example@gmail.com)"
                ], JSON_UNESCAPED_UNICODE),
            ];

            $this->cardLinkService->addLinkToCard([
                'link' => json_encode($emailLink, JSON_UNESCAPED_UNICODE),
                'enabled' => true,
            ], $card);
        }

        // Add phone link if user has phone
        if (!empty($user->phone)) {
            $phoneLink = [
                "id" => uniqid() . "_" . bin2hex(random_bytes(6)),
                "name" => "تماس",
                "title" => "تماس",
                "type" => "link",
                "action" => "call",
                "description" => "برقراری تماس با شماره دلخواه",
                "baseUrl" => "tel:",
                "value" => $user->phone,
                "enabled" => true,
                "icon" => json_encode([
                    "type" => "component",
                    "name" => "call"
                ], JSON_UNESCAPED_UNICODE),
                "placeholder" => json_encode([
                    "title" => "تماس",
                    "link"  => "شماره تماس (مثلاً 09121234567)"
                ], JSON_UNESCAPED_UNICODE),
            ];

            $this->cardLinkService->addLinkToCard([
                'link' => json_encode($phoneLink, JSON_UNESCAPED_UNICODE),
                'enabled' => true,
            ], $card);
        }

        $cardInfo=['card'=>$card];

        $user->notify(new UserActivityNotification(UserActivityNotificationType::PROFILE,$cardInfo));

        return $card;


    }

    public function addAdmin($data): void
    {

        $user = User::create([
            'first_name'=>$data['firstName'],
            'last_name'=>$data['lastName'],
            'name'=>$data['fullName'],
            'user_name' => $data['username'],
            'password' => Hash::make($data['password']),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'role'=>'admin',
            'country_code' => $data['countryCode'],
            'status'=>$data['status']
        ]);

    }

}
