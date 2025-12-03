<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کد تایید لینکو</title>
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

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px 40px 30px; text-align: center;">
                            <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                                کد تایید شما:
                            </p>
                            
                            <!-- OTP Code -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; display: inline-block;">
                                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 16px; color: #000000; font-family: 'Courier New', monospace;">{{ $otpCode }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                این کد تا <strong style="color: #333333;">2 دقیقه</strong> معتبر است.
                            </p>
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
