<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کد تایید لینکو</title>
    <style>
        body {
            font-family: 'Tahoma', 'Vazir', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .otp-code {
            background-color: #f0f0f0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #333;
            font-family: monospace;
        }
        .message {
            color: #666;
            font-size: 14px;
            line-height: 1.8;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            font-size: 13px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 کد تایید لینکو</h1>
        </div>
        <div class="content">
            <p class="message">
                سلام! 👋<br>
                برای ورود به حساب کاربری خود از کد زیر استفاده کنید:
            </p>
            
            <div class="otp-code">
                {{ $otpCode }}
            </div>
            
            <p class="message">
                این کد تا <strong>۲ دقیقه</strong> معتبر است.
            </p>
            
            <div class="warning">
                ⚠️ اگر شما این درخواست را ارسال نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.
            </div>
        </div>
        <div class="footer">
            <p>با تشکر از انتخاب شما</p>
            <p>تیم لینکو - Linku</p>
        </div>
    </div>
</body>
</html>
