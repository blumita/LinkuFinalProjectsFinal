<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ورود جدید به حساب کاربری</title>
</head>
<body style="margin: 0; padding: 0; font-family: Tahoma, Arial, sans-serif; background-color: #fafafa; direction: rtl;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- Logo -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <img src="https://i.ibb.co/JFb4JD2s/logoApp.png" alt="Linku" style="width: 120px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td style="padding: 10px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #000000; font-size: 20px; font-weight: bold;">
                                ورود جدید به حساب کاربری
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 10px;">
                            <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                                سلام {{ $userName }}،
                            </p>
                            <p style="margin: 15px 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                به حساب کاربری شما در لینکو دسترسی پیدا شد.
                            </p>
                        </td>
                    </tr>

                    <!-- Login Details -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; border: 1px solid #e0e0e0;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span style="color: #666666; font-size: 13px;">زمان ورود:</span>
                                            <span style="color: #000000; font-size: 13px; font-weight: bold; margin-right: 8px;">{{ $loginTime }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span style="color: #666666; font-size: 13px;">آدرس IP:</span>
                                            <span style="color: #000000; font-size: 13px; font-weight: bold; margin-right: 8px;">{{ $ipAddress }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span style="color: #666666; font-size: 13px;">دستگاه:</span>
                                            <span style="color: #000000; font-size: 13px; font-weight: bold; margin-right: 8px;">{{ $userAgent }}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Warning -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background-color: #f5f5f5; border-radius: 8px; padding: 16px; border: 1px solid #e0e0e0;">
                                <p style="margin: 0; color: #555555; font-size: 13px; line-height: 1.6; text-align: center;">
                                    اگر شما وارد حساب خود نشده‌اید، لطفاً فوراً رمز عبور خود را تغییر دهید.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                                تیم لینکو
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
