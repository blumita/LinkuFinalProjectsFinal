<?php
// app/Enums/SystemNotificationType.php
namespace App\Enums;

enum SystemNotificationType: string
{
    case GENERAL = 'general';
    case SECURITY = 'security';
    case UPDATE = 'update';
    case WARNING = 'warning';
    case PROFILE='profile';
    case VIOLATION='violation';
    case SYSTEM='system';

    public static function casesEnumValues(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }
}

