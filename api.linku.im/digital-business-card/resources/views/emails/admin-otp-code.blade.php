<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کد ورود پنل مدیریت</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;900&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Vazirmatn', 'Tahoma', sans-serif;  direction: rtl;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center;">
                            <!-- Shield Icon -->
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 20px; display: inline-block; margin-bottom: 24px; box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.5);">
                                <table role="presentation" width="80" height="80" cellspacing="0" cellpadding="0" style="border-radius: 20px;">
                                    <tr>
                                        <td align="center" valign="middle">
                                            <span style="font-size: 36px;">🛡️</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <h1 style="margin: 0 0 8px; color: #f8fafc; font-size: 24px; font-weight: 700;">
                                پنل مدیریت لینکو
                            </h1>
                            <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                                درخواست ورود به پنل مدیریت
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="height: 1px; background: linear-gradient(90deg, transparent, #334155, transparent);"></div>
                        </td>
                    </tr>

                    <!-- Code Section -->
                    <tr>
                        <td style="padding: 32px 40px; text-align: center;">
                            <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 15px; line-height: 1.7;">
                                کد یکبار مصرف شما برای ورود به پنل مدیریت:
                            </p>
                            
                            <!-- OTP Code Box -->
                            <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0c1929 100%); border: 2px solid #3b82f6; border-radius: 16px; padding: 24px 32px; display: inline-block; margin: 8px 0;">
                                <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #60a5fa; font-family: 'Courier New', monospace; text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);">
                                    {{ $otpCode }}
                                </span>
                            </div>
                            
                            <p style="margin: 20px 0 0; color: #64748b; font-size: 13px;">
                                این کد تا <strong style="color: #f59e0b;">۲ دقیقه</strong> دیگر معتبر است
                            </p>
                        </td>
                    </tr>

                    <!-- Warning Section -->
                    <tr>
                        <td style="padding: 0 40px 32px;">
                            <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px 20px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="32" valign="top">
                                            <span style="font-size: 20px;">⚠️</span>
                                        </td>
                                        <td style="padding-right: 12px;">
                                            <p style="margin: 0; color: #fca5a5; font-size: 13px; line-height: 1.6;">
                                                <strong>هشدار امنیتی:</strong> این کد محرمانه است. هرگز آن را با دیگران به اشتراک نگذارید. تیم لینکو هیچگاه کد شما را نمی‌پرسد.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Info Section -->
                    <tr>
                        <td style="padding: 0 40px 32px;">
                            <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 16px 20px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="32" valign="top">
                                            <span style="font-size: 20px;">ℹ️</span>
                                        </td>
                                        <td style="padding-right: 12px;">
                                            <p style="margin: 0; color: #93c5fd; font-size: 13px; line-height: 1.6;">
                                                اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید و رمز عبور حساب خود را تغییر دهید.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: rgba(0, 0, 0, 0.3); padding: 24px 40px; text-align: center; border-top: 1px solid #1e293b;">
                            <p style="margin: 0 0 8px; color: #64748b; font-size: 12px;">
                                با احترام، تیم پشتیبانی لینکو
                            </p>
                            <p style="margin: 0; color: #475569; font-size: 11px;">
                                © {{ date('Y') }} Linku - تمامی حقوق محفوظ است
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
