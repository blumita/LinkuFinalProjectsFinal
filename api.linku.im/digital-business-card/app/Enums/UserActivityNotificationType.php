<?php
// app/Enums/UserActivityNotificationType.php
namespace App\Enums;

enum UserActivityNotificationType: string
{
    case LOGIN = 'login';
    case LOGOUT = 'logout';
    case REGISTER = 'register';
    case FIRST_LOGIN = 'first_login';
    case ADMIN_LOGIN='admin-login';
    case PROFILE='profile';
    case VIOLATION='violation';
    case SYSTEM='system';
}
