<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>پیام جدید از پشتیبانی</title>
    <style>
        body {
            font-family: 'Vazirmatn', Tahoma, sans-serif;
            direction: rtl;
            text-align: right;
            background-color: #f8f9fa;
            padding: 2rem;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            padding: 2rem;
            margin: auto;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        h2 {
            color: #333333;
            margin-bottom: 1.5rem;
            font-size: 22px;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 1rem;
        }
        .row {
            margin-bottom: 1rem;
        }
        .label {
            color: #666;
            font-weight: bold;
            display: inline-block;
            width: 120px;
        }
        .value {
            color: #333;
        }
        .message {
            background-color: #f1f3f5;
            padding: 1rem;
            border-radius: 6px;
            line-height: 1.8;
            white-space: pre-line;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>📨 پیام جدید از پشتیبانی</h2>

    <div class="row">
        <span class="label">نام:</span>
        <span class="value">{{ $data['name'] }}</span>
    </div>

    <div class="row">
        <span class="label">شماره تماس:</span>
        <span class="value">{{ $data['phone'] }}</span>
    </div>

    <div class="row">
        <span class="label">ایمیل:</span>
        <span class="value">{{ $data['email'] }}</span>
    </div>

    <div class="row">
        <span class="label">پیام:</span>
        <div class="message">
            {{ $data['message'] }}
        </div>
    </div>
</div>
</body>
</html>
