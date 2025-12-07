export default defineEventHandler(() => {
  return {
    "categories": [
      {
        "title": "ایرانی",
        "type": "block",
        "items": [
          {
            "id": "eitaa",
            "name": "ایتا",
            "type": "link",
            "action": "eitaa",
            "description": "",
            "baseUrl": "https://eitaa.com/",
            "icon": {
              "type": "component",
              "name": "eitaa"
            },
            "placeholder": {
              "title": "ایتا",
              "link": "لینک ایتا",
              "description": ""
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "rubika",
            "name": "روبیکا",
            "type": "link",
            "action": "rubika",
            "description": "",
            "icon": {
              "type": "component",
              "name": "rubika"
            },
            "baseUrl": "https://rubika.ir/",
            "placeholder": {
              "title": "روبیکا",
              "link": "لینک روبیکا"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "bale",
            "name": "بله",
            "type": "link",
            "action": "bale",
            "description": "",
            "icon": {
              "type": "component",
              "name": "bale"
            },
            "baseUrl": "https://ble.ir/",
            "placeholder": {
              "title": "صفحه بله",
              "link": "لینک بله"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "igap",
            "name": "آی‌گپ",
            "type": "link",
            "action": "igap",
            "description": "",
            "icon": {
              "type": "component",
              "name": "igap"
            },
            "baseUrl": "https://igap.net/",
            "placeholder": {
              "title": "صفحه آی‌گپ",
              "link": "لینک آی‌گپ"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "divar",
            "name": "دیوار",
            "type": "link",
            "action": "divar",
            "description": "",
            "icon": {
              "type": "component",
              "name": "divar"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "صفحه دیوار",
              "link": "لینک صفحه دیوار"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "snapp",
            "name": "اسنپ",
            "type": "link",
            "action": "snapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapp"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "پروفایل اسنپ",
              "link": "لینک پروفایل اسنپ"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "balad",
            "name": "بلد",
            "type": "link",
            "action": "balad",
            "description": "",
            "icon": {
              "type": "component",
              "name": "balad"
            },
            "baseUrl": "https://balad.ir/p/",
            "placeholder": {
              "title": "نقشه بلد",
              "link": "لینک بلد"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "neshan",
            "name": "نشان",
            "type": "link",
            "action": "neshan",
            "description": "",
            "icon": {
              "type": "component",
              "name": "nshan"
            },
            "baseUrl": "https://neshan.org/maps/@",
            "placeholder": {
              "title": "نقشه نشان",
              "link": "لینک نشان"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "aparat",
            "name": "آپارات",
            "type": "link",
            "action": "aparat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "aparat"
            },
            "baseUrl": "https://aparat.com/",
            "placeholder": {
              "title": "اپارات",
              "link": "یوزرنیم یا آدرس کانال آپارات (مثلاً @channelname یا c/ChannelName)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "virgool",
            "name": "ویرگول",
            "type": "link",
            "action": "virgool",
            "description": "",
            "icon": {
              "type": "component",
              "name": "virgool"
            },
            "baseUrl": "https://virgool.io/@",
            "placeholder": {
              "title": "ویرگول",
              "link": "یوزرنیم یا لینک ویرگول"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zarinpal",
            "name": "زرین‌پال",
            "type": "link",
            "action": "zarinpal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zarinpal"
            },
            "baseUrl": "https://zarinp.al/",
            "placeholder": {
              "title": "زرین‌پال",
              "link": "لینک درگاه زرین‌پال"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "raymit",
            "name": "ری‌میت",
            "type": "link",
            "action": "raymit",
            "description": "",
            "icon": {
              "type": "component",
              "name": "remit"
            },
            "baseUrl": "https://raymit.ir/",
            "placeholder": {
              "title": "ری‌میت",
              "link": "لینک درگاه ری‌میت"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "اطلاعات تماس",
        "type": "block",
        "items": [
          {
            "id": "number",
            "name": " اس ام اس",
            "type": "link",
            "action": "number",
            "description": "",
            "icon": {
              "type": "component",
              "name": "number"
            },
            "baseUrl": "sms:",
            "placeholder": {
              "title": "شماره تماس",
              "link": "شماره تلفن (مثلاً 09121234567)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "contactcard",
            "name": "کارت تماس",
            "type": "block",
            "action": "contactcard",
            "description": "",
            "icon": {
              "type": "component",
              "name": "contactcard"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "کارت تماس",
              "link": "لینک کارت تماس"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "call",
            "name": "تماس",
            "type": "link",
            "action": "call",
            "description": "",
            "icon": {
              "type": "component",
              "name": "call"
            },
            "baseUrl": "tel:",
            "placeholder": {
              "title": "تماس",
              "link": "شماره تماس (مثلاً 09121234567)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "eitaa",
            "name": "ایتا",
            "type": "link",
            "action": "eitaa",
            "description": "",
            "baseUrl": "https://eitaa.com/",
            "icon": {
              "type": "component",
              "name": "eitaa"
            },
            "placeholder": {
              "title": "ایتا",
              "link": "لینک ایتا",
              "description": ""
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "telegram",
            "name": "تلگرام",
            "type": "link",
            "action": "telegram",
            "description": "",
            "icon": {
              "type": "component",
              "name": "telegram"
            },
            "baseUrl": "https://t.me/",
            "placeholder": {
              "title": "تلگرام",
              "link": "یوزرنیم تلگرام (مثلاً johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "email",
            "name": "ایمیل",
            "type": "link",
            "action": "email",
            "description": "",
            "icon": {
              "type": "component",
              "name": "email"
            },
            "baseUrl": "mailto:",
            "placeholder": {
              "title": "ایمیل",
              "link": "آدرس ایمیل (مثلاً test@email.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "facetime",
            "name": "فیس‌تایم",
            "type": "link",
            "action": "facetime",
            "description": "",
            "icon": {
              "type": "component",
              "name": "facetime"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "فیس‌تایم",
              "link": "آدرس تماس فیس‌تایم"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "whatsapp",
            "name": "واتساپ",
            "type": "link",
            "action": "whatsapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "whatsapp"
            },
            "baseUrl": "https://wa.me/",
            "placeholder": {
              "title": "واتساپ",
              "link": "شماره واتس آپ رو وارد کنید"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "address",
            "name": "آدرس",
            "type": "link",
            "action": "address",
            "description": "",
            "icon": {
              "type": "component",
              "name": "address",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "آدرس",
              "link": "لینک آدرس"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "map",
            "name": "نقشه",
            "type": "block",
            "action": "map",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linkumap"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "نقشه",
              "link": "موقعیت مکانی"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "شبکه‌های اجتماعی",
        "type": "block",
        "items": [
          {
            "id": "instagram",
            "name": "اینستاگرام",
            "type": "link",
            "action": "instagram",
            "description": "",
            "icon": {
              "type": "component",
              "name": "instagram"
            },
            "baseUrl": "https://instagram.com/",
            "placeholder": {
              "title": "اینستاگرام",
              "link": "یوزرنیم اینستاگرام (مثلاً johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "facebook",
            "name": "فیسبوک",
            "type": "link",
            "action": "facebook",
            "description": "",
            "icon": {
              "type": "component",
              "name": "facebook",
            },
            "baseUrl": "https://facebook.com/",
            "placeholder": {
              "title": "فیسبوک",
              "link": "یوزرنیم فیسبوک (مثلاً johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "tiktok",
            "name": "تیک‌تاک",
            "type": "link",
            "action": "tiktok",
            "description": "",
            "icon": {
              "type": "component",
              "name": "tiktok",
            },
            "baseUrl": "https://www.tiktok.com/@",
            "placeholder": {
              "title": "تیک‌تاک",
              "link": "لینک تیک‌تاک"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "threads",
            "name": "تردز",
            "type": "link",
            "action": "threads",
            "description": "",
            "icon": {
              "type": "component",
              "name": "threads",
            },
            "baseUrl": "https://www.threads.net/@",
            "placeholder": {
              "title": "تردز",
              "link": "لینک تردز"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "clubhouse",
            "name": "کلاب‌هاوس",
            "type": "link",
            "action": "clubhouse",
            "description": "",
            "icon": {
              "type": "component",
              "name": "clubhouse",
            },
            "baseUrl": "https://www.clubhouse.com/@",
            "placeholder": {
              "title": "کلاب‌هاوس",
              "link": "لینک کلاب‌هاوس"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "pinterest",
            "name": "پینترست",
            "type": "link",
            "action": "pinterest",
            "description": "",
            "icon": {
              "type": "component",
              "name": "pinterest",
            },
            "baseUrl": "https://pinterest.com/",
            "placeholder": {
              "title": "پینترست",
              "link": "لینک پینترست"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "linkedin",
            "name": "لینکدین",
            "type": "link",
            "action": "linkedin",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linkedin",
            },
            "baseUrl": "https://linkedin.com/in/",
            "placeholder": {
              "title": "لینکدین",
              "link": "یوزرنیم لینکدین (مثلاً johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "youtube",
            "name": "یوتیوب",
            "type": "link",
            "action": "youtube",
            "description": "",
            "icon": {
              "type": "component",
              "name": "youtube",
            },
            "baseUrl": "https://youtube.com/",
            "placeholder": {
              "title": "یوتیوب",
              "link": "یوزرنیم یا آدرس کانال یوتیوب (مثلاً @channelname یا c/ChannelName)"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "wechat",
            "name": "وی‌چت",
            "type": "link",
            "action": "wechat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "wechat",
            },
            "baseUrl": "https://weixin.qq.com/",
            "placeholder": {
              "title": "وی‌چت",
              "link": "آیدی وی‌چت"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "aparat",
            "name": "آپارات",
            "type": "link",
            "action": "aparat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "aparat",
            },
            "baseUrl": "https://aparat.com/",
            "placeholder": {
              "title": "اپارات",
              "link": "یوزرنیم یا آدرس کانال آپارات (مثلاً @channelname یا c/ChannelName)"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "x",
            "name": "اکس",
            "type": "link",
            "action": "twitter",
            "description": "",
            "icon": {
              "type": "component",
              "name": "x",
            },
            "baseUrl": "https://x.com/",
            "placeholder": {
              "title": "اکس",
              "link": "لینک اکانت اکس"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "snapchat",
            "name": "اسنپ‌چت",
            "type": "link",
            "action": "snapchat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapchat",
            },
            "baseUrl": "https://snapchat.com/add/",
            "placeholder": {
              "title": "اسنپ‌چت",
              "link": "لینک اسنپ‌چت"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "twitch",
            "name": "توییچ",
            "type": "link",
            "action": "twitch",
            "description": "",
            "icon": {
              "type": "component",
              "name": "twitch",
            },
            "baseUrl": "https://twitch.tv/",
            "placeholder": {
              "title": "توییچ",
              "link": "لینک توییچ"
            },
            "value": "",
            "enabled": true,
          },
          {
            "id": "rubika",
            "name": "روبیکا",
            "type": "link",
            "action": "rubika",
            "description": "",
            "icon": {
              "type": "component",
              "name": "rubika",
            },
            "baseUrl": "https://rubika.ir/",
            "placeholder": {
              "title": "روبیکا",
              "link": "لینک روبیکا"
            },
            "value": "",
            "enabled": true,
          }
        ]
      },
      {
        "title": "کسب‌وکار",
        "type": "block",
        "items": [
          {
            "id": "app_link",
            "name": "لینک اپلیکیشن",
            "type": "link",
            "action": "app_link",
            "description": "اپلیکیشن رسمی ما در گوگل پلی",
            "icon": {
              "type": "component",
              "name": "app_link",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "لینک اپلیکیشن",
              "link": "لینک دانلود اپلیکیشن"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "booksy",
            "name": "بوکسی",
            "type": "link",
            "action": "booksy",
            "description": "",
            "icon": {
              "type": "component",
              "name": "booksy",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "بوکسی",
              "link": "لینک بوکسی"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "calendly",
            "name": "کلندلی",
            "type": "link",
            "action": "calendly",
            "description": "",
            "icon": {
              "type": "component",
              "name": "calendly",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "کلندلی",
              "link": "لینک کلندلی"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "chili-piper",
            "name": "چیلی پایپر",
            "type": "link",
            "action": "chili-piper",
            "description": "",
            "icon": {
              "type": "component",
              "name": "chili",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "چیلی پایپر",
              "link": "لینک چیلی پایپر"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "etsy",
            "name": "اتسی",
            "type": "link",
            "action": "etsy",
            "description": "",
            "icon": {
              "type": "component",
              "name": "etsy",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "اتسی",
              "link": "لینک اتسی"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "microsoft-bookings",
            "name": "مایکروسافت بوکینگ",
            "type": "link",
            "action": "microsoft-bookings",
            "description": "",
            "icon": {
              "type": "component",
              "name": "microsoft-bookings",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "مایکروسافت بوکینگ",
              "link": "لینک مایکروسافت بوکینگ"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "reviews",
            "name": "نظرات",
            "type": "link",
            "action": "reviews",
            "description": "",
            "icon": {
              "type": "component",
              "name": "reviews",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "نظرات",
              "link": "لینک نظرات"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "safari",
            "name": "وبسایت",
            "type": "link",
            "action": "safari",
            "description": "",
            "icon": {
              "type": "component",
              "name": "website",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "وبسایت",
              "link": "آدرس کامل وبسایت (مثلاً https://example.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "square",
            "name": "اسکوئر",
            "type": "link",
            "action": "square",
            "description": "",
            "icon": {
              "type": "component",
              "name": "square",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "اسکوئر",
              "link": "لینک اسکوئر"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "yelp",
            "name": "یِلپ",
            "type": "link",
            "action": "yelp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "yelp",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "یِلپ",
              "link": "لینک یِلپ"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "zillow",
            "name": "زیلو",
            "type": "link",
            "action": "zillow",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zillow",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "پروفایل زیلو",
              "link": "لینک پروفایل زیلو"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "divar",
            "name": "دیوار",
            "type": "link",
            "action": "divar",
            "description": "",
            "icon": {
              "type": "component",
              "name": "divar",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "صفحه دیوار",
              "link": "لینک صفحه دیوار"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "snapp",
            "name": "اسنپ",
            "type": "link",
            "action": "snapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapp",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "پروفایل اسنپ",
              "link": "لینک پروفایل اسنپ"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "neshan",
            "name": "نشان",
            "type": "link",
            "action": "neshan",
            "description": "",
            "icon": {
              "type": "component",
              "name": "nshan",
            },
            "baseUrl": "https://neshan.org/maps/@",
            "placeholder": {
              "title": "نقشه نشان",
              "link": "لینک نشان"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "balad",
            "name": "بلد",
            "type": "link",
            "action": "balad",
            "description": "",
            "icon": {
              "type": "component",
              "name": "balad"
            },
            "baseUrl": "https://balad.ir/p/",
            "placeholder": {
              "title": "نقشه بلد",
              "link": "لینک بلد"
            },
            "value": "",
            "enabled": true
          },
          {
            "type": "block",
            "name": "شماره کارت",
            "action": "bankcard",
            "enabled": true,
            "id": "card-number-001",
            "title": "شماره کارت",
            "value": "6037991234567890",
            "accountHolder": "علی رضایی",
            "bankName": "ملت",
            "accountNumber": "1234567890",
            "ibanNumber": "IR820540102680020817909002",
            "description": "کارت حقوق شرکت",
            "icon": {
              "type": "component",
              "name": "card"
            }
          },
          {
            "type": "block",
            "name": "ساعات کاری",
            "action": "workhours",
            "enabled": true,
            "id": "workhours-001",
            "title": "ساعات کاری",
            "value": "",
            "icon": {
              "type": "component",
              "name": "clock"
            }
          }
        ]
      },
      {
        "title": "محتوا",
        "type": "block",
        "items": [
          {
            "type": "block",
            "name": "ویدیو ",
            "icon": {
              "type": "component",
              "name": "embeddedvideo",
            },
            "action": "embeddedvideo",
            "enabled": true,
            "access": "pro",
            "id": "video-789",
            "title": "ویدیوی تستی",
            "value": "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            "type": "block",
            "name": "نمونه فایل",
            "icon": { "type": "component", "name": "file" },
            "action": "file",
            "enabled": true,
            "access": "pro",
            "id": "file-202",
            "title": "نمونه فایل",
            "value": "",
          },
          {
            "type": "block",
            "name": "نظرسنجی",
            "icon": { "type": "component", "name": "poll" },
            "action": "poll",
            "enabled": true,
            "access": "pro",
            "id": "poll-123",
            "title": "نظر شما درباره سایت؟",
            "options": ["عالی", "خوب", "متوسط"],
          },
          {
            "type": "block",
            "name": "متن سربرگ",
            "icon": { "type": "component", "name": "textsection" },
            "action": "textsection",
            "enabled": true,
            //"access": "pro",
            "id": "textsection-001",
            "title": "متن سربرگ",
            "value": "",
          },
          {
            "type": "block",
            "name": "باکس پرسش",
            "icon": { "type": "component", "name": "questionbox" },
            "action": "questionbox",
            "enabled": true,
            "access": "pro",
            "id": "question-456",
            "title": "از من سوال بپرس!",
            "avatar": "https://example.com/avatar.jpg",
          },
          {
            "type": "block",
            "name": "توضیحات بیشتر",
            "icon": { "type": "component", "name": "dropdown" },
            "action": "expandabletext",
            "enabled": true,
            "access": "pro",
            "id": "text-101",
            "title": "توضیحات بیشتر",
            "value": "این یک متن تستی برای نمایش قابلیت نمایش و مخفی‌سازی متن بلند است.",
          }
        ]
      },
      {
        "title": "باشگاه مشتریان",
        "type": "block",
        "items": [
          {
            "type": "block",
            "name": "فرم",
            "icon": { "type": "component", "name": "form" },
            "action": "builder",
            "enabled": true,
            "access": "pro",
            "id": "form-001",
            "title": "فرم ثبت‌نام",
            "description": "فرم ساده برای دریافت اطلاعات کاربر",
            "fields": ["نام", "ایمیل", "شماره تماس"]
          },
          {
            "type": "block",
            "name": "تاس شانس",
            "icon": { "type": "component", "name": "luckydice" },
            "action": "luckydice",
            "enabled": true,
            "access": "pro",
            "id": "dice-001",
            "title": "بازی شانس تاس",
            "description": "با انداختن تاس جایزه بگیر!",
            "outcomes": ["1 = هیچی", "6 = برنده‌شدی!", "3 = کد تخفیف"]
          },
          {
            "type": "block",
            "name": "گردونه شانس",
            "icon": { "type": "component", "name": "luckywheel" },
            "action": "luckywheel",
            "enabled": true,
            "access": "pro",
            "id": "wheel-001",
            "title": "گردونه شانس",
            "description": "گردونه رو بچرخون و شانست رو امتحان کن",
            "segments": ["هدیه", "کد تخفیف", "ارسال رایگان", "دفعه بعد"]
          },
          {
            "type": "block",
            "name": "تخم‌مرغ شانس",
            "icon": { "type": "component", "name": "luckyegg" },
            "action": "luckyegg",
            "enabled": true,
            "access": "pro",
            "id": "egg-001",
            "title": "تخم‌مرغ شانس",
            "description": "برای شکستن تخم‌مرغ کلیک کن و جایزه بگیر!",
            "prizes": ["10% تخفیف", "ارسال رایگان", "کد هدیه"]
          }
        ]
      },
      {
        "title": "پرداخت‌ها",
        "type": "block",
        "items": [
          {
            "id": "cashapp",
            "name": "کش‌اپ",
            "type": "link",
            "action": "cashapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "cashapp",
            },
            "baseUrl": "https://cash.app/$",
            "placeholder": {
              "title": "کش‌اپ",
              "link": "لینک درگاه کش‌اپ"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "paypal",
            "name": "پی‌پال",
            "type": "link",
            "action": "paypal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "paypal",
            },
            "baseUrl": "https://paypal.me/",
            "placeholder": {
              "title": "پی‌پال",
              "link": "لینک درگاه پی‌پال"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "raymit",
            "name": "ری‌میت",
            "type": "link",
            "action": "raymit",
            "description": "",
            "icon": {
              "type": "component",
              "name": "remit",
            },
            "baseUrl": "https://raymit.ir/",
            "placeholder": {
              "title": "ری‌میت",
              "link": "لینک درگاه ری‌میت"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zelle",
            "name": "زل",
            "type": "link",
            "action": "zelle",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zelle",
            },
            "baseUrl": "https://zellepay.com/",
            "placeholder": {
              "title": "زل",
              "link": "لینک درگاه زل"
            },
            "value": "",
            "enabled": true,
          },

          {
            "id": "zarinpal",
            "name": "زرین‌پال",
            "type": "link",
            "action": "zarinpal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zarinpal",
            },
            "baseUrl": "https://zarinp.al/",
            "placeholder": {
              "title": "زرین‌پال",
              "link": "لینک درگاه زرین‌پال"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "trustwallet",
            "name": "تراست‌ولت",
            "type": "link",
            "action": "trustwallet",
            "description": "",
            "icon": {
              "type": "component",
              "name": "trustwallet",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "تراست‌ولت",
              "link": "لینک درگاه تراست‌ولت"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          }
        ]
      },
      {
        "title": "موزیک و سرگرمی",
        "type": "block",
        "items": [
          {
            "id": "spotify",
            "name": "اسپاتیفای",
            "type": "link",
            "action": "spotify",
            "description": "",
            "icon": {
              "type": "component",
              "name": "spotify"
            },
            "baseUrl": "https://open.spotify.com/",
            "placeholder": {
              "title": "اسپاتیفای",
              "link": "لینک پلی‌لیست یا آرتیست اسپاتیفای"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "apple_music",
            "name": "اپل موزیک",
            "type": "link",
            "action": "apple_music",
            "description": "",
            "icon": {
              "type": "component",
              "name": "apple_music"
            },
            "baseUrl": "https://music.apple.com/",
            "placeholder": {
              "title": "اپل موزیک",
              "link": "لینک پلی‌لیست یا آرتیست اپل موزیک"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "youtube_music",
            "name": "یوتیوب موزیک",
            "type": "link",
            "action": "youtube_music",
            "description": "",
            "icon": {
              "type": "component",
              "name": "youtube_music"
            },
            "baseUrl": "https://music.youtube.com/",
            "placeholder": {
              "title": "یوتیوب موزیک",
              "link": "لینک پلی‌لیست یا آرتیست یوتیوب موزیک"
            },
            "value": "",
            "enabled": true
          },
        ]
      },
      {
        "title": "بیشتر",
        "type": "block",
        "items": [
              {
            "id": "featuredlink",
            "name": "لینک برجسته",
            "type": "block",
            "action": "featuredlink",
            "description": "لینک ویژه",
              "access": "pro",
            "icon": {
              "type": "component",
              "name": "featured",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "لینک برجسته",
              "link": "لینک برجسته (مثلاً https://example.com)"
            },
            "value": "",
            "enabled": true
          },
             {
            "id": "customlink",
            "name": "لینک سفارشی",
            "type": "link",
            "action": "customlink",
             "access": "pro",
            "description": "افزودن هر لینک دلخواه",
            "icon": {
              "type": "component",
              "name": "customlink"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "لینک سفارشی",
              "link": "آدرس کامل لینک (مثلاً https://example.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "igap",
            "name": "آی‌گپ",
            "type": "link",
            "action": "igap",
            "description": "",
            "icon": {
              "type": "component",
              "name": "igap",
            },
            "baseUrl": "https://igap.net/",
            "placeholder": {
              "title": "صفحه آی‌گپ",
              "link": "لینک آی‌گپ"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "discord",
            "name": "دیسکورد",
            "type": "link",
            "action": "discord",
            "description": "",
            "icon": {
              "type": "component",
              "name": "discord",
            },
            "baseUrl": "https://discord.com/users/",
            "placeholder": {
              "title": "سرور دیسکورد",
              "link": "لینک دیسکورد"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "bale",
            "name": "بله",
            "type": "link",
            "action": "bale",
            "description": "",
            "icon": {
              "type": "component",
              "name": "bale",
            },
            "baseUrl": "https://ble.ir/",
            "placeholder": {
              "title": "صفحه بله",
              "link": "لینک بله"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "linktree",
            "name": "لینک‌تری",
            "type": "link",
            "action": "linktree",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linktree",
            },
            "baseUrl": "https://linktr.ee/",
            "placeholder": {
              "title": "لینک لینک‌تری",
              "link": "لینک لینک‌تری"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "poshmark",
            "name": "پوشمارک",
            "type": "link",
            "action": "poshmark",
            "description": "",
            "icon": {
              "type": "component",
              "name": "poshmark",
            },
            "baseUrl": "https://poshmark.com/closet/",
            "placeholder": {
              "title": "فروشگاه پوشمارک",
              "link": "لینک پوشمارک"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "hobby",
            "name": "هوبی",
            "type": "link",
            "action": "hobby",
            "description": "",
            "icon": {
              "type": "component",
              "name": "hoobe",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "صفحه هوبی",
              "link": "لینک هوبی"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "podcast",
            "name": "پادکست‌ها",
            "type": "link",
            "action": "podcast",
            "description": "",
            "icon": {
              "type": "component",
              "name": "podcasts",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "پادکست",
              "link": "لینک پادکست"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "figma",
            "name": "فیگما",
            "type": "link",
            "action": "figma",
            "description": "",
            "icon": {
              "type": "component",
              "name": "figma",
            },
            "baseUrl": "https://figma.com/@",
            "placeholder": {
              "title": "پروژه فیگما",
              "link": "لینک فیگما"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "opensea",
            "name": "اوپن‌سی‌آی",
            "type": "link",
            "action": "opensea",
            "description": "",
            "icon": {
              "type": "component",
              "name": "opensea_color",
            },
            "baseUrl": "",
            "placeholder": {
              "title": "صفحه اوپن‌سی",
              "link": "لینک اوپن‌سی"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "github",
            "name": "گیت‌هاب",
            "type": "link",
            "action": "github",
            "description": "",
            "icon": {
              "type": "component",
              "name": "github",
            },
            "baseUrl": "https://github.com/",
            "placeholder": {
              "title": "مخزن گیت‌هاب",
              "link": "لینک گیت‌هاب"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "googlemeet",
            "name": "گوگل میت",
            "type": "link",
            "action": "googlemeet",
            "description": "",
            "icon": {
              "type": "component",
              "name": "googlemeet",
            },
            "baseUrl": "https://meet.google.com/",
            "placeholder": {
              "title": "جلسه گوگل میت",
              "link": "لینک گوگل میت"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "teams",
            "name": "تیمز",
            "type": "link",
            "action": "teams",
            "description": "",
            "icon": {
              "type": "component",
              "name": "teams",
            },
            "baseUrl": "https://teams.microsoft.com/l/meetup-join/",
            "placeholder": {
              "title": "جلسه تیمز",
              "link": "لینک تیمز"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zoom",
            "name": "زوم",
            "type": "link",
            "action": "zoom",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zoom",
            },
            "baseUrl": "https://zoom.us/my/",
            "placeholder": {
              "title": "جلسه زوم",
              "link": "لینک زوم"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "medium",
            "name": "مدیوم",
            "type": "link",
            "action": "medium",
            "description": "",
            "icon": {
              "type": "component",
              "name": "medium",
            },
            "baseUrl": "https://medium.com/@",
            "placeholder": {
              "title": "نوشته مدیوم",
              "link": "لینک مدیوم"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "trustpilot",
            "name": "تراست‌پایلوت",
            "type": "link",
            "action": "trustpilot",
            "description": "",
            "icon": {
              "type": "component",
              "name": "trustpilot",
            },
            "baseUrl": "https://www.trustpilot.com/review/",
            "placeholder": {
              "title": "تراست‌پایلوت",
              "link": "لینک صفحه تراست‌پایلوت"
            },
            "value": "",
            "enabled": true
          }
        ]
      }
    ]
  }
})