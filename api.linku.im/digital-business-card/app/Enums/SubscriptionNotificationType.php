<?php

namespace App\Enums;

enum SubscriptionNotificationType: string
{
    case PURCHASE_SUCCESS = 'purchase_success';
    case PURCHASE_FAILED = 'purchase_failed';
    case RENEWAL_REMINDER = 'renewal_reminder';
    case RENEWAL_SUCCESS = 'renewal_success';
    case RENEWAL_FAILED = 'renewal_failed';
    case SUBSCRIPTION_EXPIRED = 'subscription_expired';
    case GRACE_PERIOD = 'grace_period';

    public static function casesEnumValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}
