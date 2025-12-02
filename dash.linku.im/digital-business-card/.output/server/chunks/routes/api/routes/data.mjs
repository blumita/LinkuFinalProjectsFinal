import { d as defineEventHandler } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const data = defineEventHandler(() => {
  return {
    "categories": [
      {
        "title": "\u0627\u06CC\u0631\u0627\u0646\u06CC",
        "type": "block",
        "items": [
          {
            "id": "eitaa",
            "name": "\u0627\u06CC\u062A\u0627",
            "type": "link",
            "action": "eitaa",
            "description": "",
            "baseUrl": "https://eitaa.com/",
            "icon": {
              "type": "component",
              "name": "eitaa"
            },
            "placeholder": {
              "title": "\u0627\u06CC\u062A\u0627",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u06CC\u062A\u0627",
              "description": ""
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "rubika",
            "name": "\u0631\u0648\u0628\u06CC\u06A9\u0627",
            "type": "link",
            "action": "rubika",
            "description": "",
            "icon": {
              "type": "component",
              "name": "rubika"
            },
            "baseUrl": "https://rubika.ir/",
            "placeholder": {
              "title": "\u0631\u0648\u0628\u06CC\u06A9\u0627",
              "link": "\u0644\u06CC\u0646\u06A9 \u0631\u0648\u0628\u06CC\u06A9\u0627"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "bale",
            "name": "\u0628\u0644\u0647",
            "type": "link",
            "action": "bale",
            "description": "",
            "icon": {
              "type": "component",
              "name": "bale"
            },
            "baseUrl": "https://ble.ir/",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0628\u0644\u0647",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0644\u0647"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "igap",
            "name": "\u0622\u06CC\u200C\u06AF\u067E",
            "type": "link",
            "action": "igap",
            "description": "",
            "icon": {
              "type": "component",
              "name": "igap"
            },
            "baseUrl": "https://igap.net/",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0622\u06CC\u200C\u06AF\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u0622\u06CC\u200C\u06AF\u067E"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "divar",
            "name": "\u062F\u06CC\u0648\u0627\u0631",
            "type": "link",
            "action": "divar",
            "description": "",
            "icon": {
              "type": "component",
              "name": "divar"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u062F\u06CC\u0648\u0627\u0631",
              "link": "\u0644\u06CC\u0646\u06A9 \u0635\u0641\u062D\u0647 \u062F\u06CC\u0648\u0627\u0631"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "snapp",
            "name": "\u0627\u0633\u0646\u067E",
            "type": "link",
            "action": "snapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapp"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u0633\u0646\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u0633\u0646\u067E"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "balad",
            "name": "\u0628\u0644\u062F",
            "type": "link",
            "action": "balad",
            "description": "",
            "icon": {
              "type": "component",
              "name": "balad"
            },
            "baseUrl": "https://balad.ir/p/",
            "placeholder": {
              "title": "\u0646\u0642\u0634\u0647 \u0628\u0644\u062F",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0644\u062F"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "neshan",
            "name": "\u0646\u0634\u0627\u0646",
            "type": "link",
            "action": "neshan",
            "description": "",
            "icon": {
              "type": "component",
              "name": "nshan"
            },
            "baseUrl": "https://neshan.org/maps/@",
            "placeholder": {
              "title": "\u0646\u0642\u0634\u0647 \u0646\u0634\u0627\u0646",
              "link": "\u0644\u06CC\u0646\u06A9 \u0646\u0634\u0627\u0646"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "aparat",
            "name": "\u0622\u067E\u0627\u0631\u0627\u062A",
            "type": "link",
            "action": "aparat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "aparat"
            },
            "baseUrl": "https://aparat.com/",
            "placeholder": {
              "title": "\u0627\u067E\u0627\u0631\u0627\u062A",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u06CC\u0627 \u0622\u062F\u0631\u0633 \u06A9\u0627\u0646\u0627\u0644 \u0622\u067E\u0627\u0631\u0627\u062A (\u0645\u062B\u0644\u0627\u064B @channelname \u06CC\u0627 c/ChannelName)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "virgool",
            "name": "\u0648\u06CC\u0631\u06AF\u0648\u0644",
            "type": "link",
            "action": "virgool",
            "description": "",
            "icon": {
              "type": "component",
              "name": "virgool"
            },
            "baseUrl": "https://virgool.io/@",
            "placeholder": {
              "title": "\u0648\u06CC\u0631\u06AF\u0648\u0644",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u06CC\u0627 \u0644\u06CC\u0646\u06A9 \u0648\u06CC\u0631\u06AF\u0648\u0644"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zarinpal",
            "name": "\u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644",
            "type": "link",
            "action": "zarinpal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zarinpal"
            },
            "baseUrl": "https://zarinp.al/",
            "placeholder": {
              "title": "\u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "raymit",
            "name": "\u0631\u06CC\u200C\u0645\u06CC\u062A",
            "type": "link",
            "action": "raymit",
            "description": "",
            "icon": {
              "type": "component",
              "name": "remit"
            },
            "baseUrl": "https://raymit.ir/",
            "placeholder": {
              "title": "\u0631\u06CC\u200C\u0645\u06CC\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u0631\u06CC\u200C\u0645\u06CC\u062A"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u062A\u0645\u0627\u0633",
        "type": "block",
        "items": [
          {
            "id": "number",
            "name": " \u0627\u0633 \u0627\u0645 \u0627\u0633",
            "type": "link",
            "action": "number",
            "description": "",
            "icon": {
              "type": "component",
              "name": "number"
            },
            "baseUrl": "sms:",
            "placeholder": {
              "title": "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633",
              "link": "\u0634\u0645\u0627\u0631\u0647 \u062A\u0644\u0641\u0646 (\u0645\u062B\u0644\u0627\u064B 09121234567)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "contactcard",
            "name": "\u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633",
            "type": "block",
            "action": "contactcard",
            "description": "",
            "icon": {
              "type": "component",
              "name": "contactcard"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633",
              "link": "\u0644\u06CC\u0646\u06A9 \u06A9\u0627\u0631\u062A \u062A\u0645\u0627\u0633"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "call",
            "name": "\u062A\u0645\u0627\u0633",
            "type": "link",
            "action": "call",
            "description": "",
            "icon": {
              "type": "component",
              "name": "call"
            },
            "baseUrl": "tel:",
            "placeholder": {
              "title": "\u062A\u0645\u0627\u0633",
              "link": "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633 (\u0645\u062B\u0644\u0627\u064B 09121234567)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "eitaa",
            "name": "\u0627\u06CC\u062A\u0627",
            "type": "link",
            "action": "eitaa",
            "description": "",
            "baseUrl": "https://eitaa.com/",
            "icon": {
              "type": "component",
              "name": "eitaa"
            },
            "placeholder": {
              "title": "\u0627\u06CC\u062A\u0627",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u06CC\u062A\u0627",
              "description": ""
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "telegram",
            "name": "\u062A\u0644\u06AF\u0631\u0627\u0645",
            "type": "link",
            "action": "telegram",
            "description": "",
            "icon": {
              "type": "component",
              "name": "telegram"
            },
            "baseUrl": "https://t.me/",
            "placeholder": {
              "title": "\u062A\u0644\u06AF\u0631\u0627\u0645",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u062A\u0644\u06AF\u0631\u0627\u0645 (\u0645\u062B\u0644\u0627\u064B johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "email",
            "name": "\u0627\u06CC\u0645\u06CC\u0644",
            "type": "link",
            "action": "email",
            "description": "",
            "icon": {
              "type": "component",
              "name": "email"
            },
            "baseUrl": "mailto:",
            "placeholder": {
              "title": "\u0627\u06CC\u0645\u06CC\u0644",
              "link": "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 (\u0645\u062B\u0644\u0627\u064B test@email.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "facetime",
            "name": "\u0641\u06CC\u0633\u200C\u062A\u0627\u06CC\u0645",
            "type": "link",
            "action": "facetime",
            "description": "",
            "icon": {
              "type": "component",
              "name": "facetime"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0641\u06CC\u0633\u200C\u062A\u0627\u06CC\u0645",
              "link": "\u0622\u062F\u0631\u0633 \u062A\u0645\u0627\u0633 \u0641\u06CC\u0633\u200C\u062A\u0627\u06CC\u0645"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "whatsapp",
            "name": "\u0648\u0627\u062A\u0633\u0627\u067E",
            "type": "link",
            "action": "whatsapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "whatsapp"
            },
            "baseUrl": "https://wa.me/",
            "placeholder": {
              "title": "\u0648\u0627\u062A\u0633\u0627\u067E",
              "link": "\u0634\u0645\u0627\u0631\u0647 \u0648\u0627\u062A\u0633 \u0622\u067E \u0631\u0648 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "address",
            "name": "\u0622\u062F\u0631\u0633",
            "type": "link",
            "action": "address",
            "description": "",
            "icon": {
              "type": "component",
              "name": "address"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0622\u062F\u0631\u0633",
              "link": "\u0644\u06CC\u0646\u06A9 \u0622\u062F\u0631\u0633"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "map",
            "name": "\u0646\u0642\u0634\u0647",
            "type": "block",
            "action": "map",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linkumap"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0646\u0642\u0634\u0647",
              "link": "\u0645\u0648\u0642\u0639\u06CC\u062A \u0645\u06A9\u0627\u0646\u06CC"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "\u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC",
        "type": "block",
        "items": [
          {
            "id": "instagram",
            "name": "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
            "type": "link",
            "action": "instagram",
            "description": "",
            "icon": {
              "type": "component",
              "name": "instagram"
            },
            "baseUrl": "https://instagram.com/",
            "placeholder": {
              "title": "\u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645 (\u0645\u062B\u0644\u0627\u064B johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "facebook",
            "name": "\u0641\u06CC\u0633\u0628\u0648\u06A9",
            "type": "link",
            "action": "facebook",
            "description": "",
            "icon": {
              "type": "component",
              "name": "facebook"
            },
            "baseUrl": "https://facebook.com/",
            "placeholder": {
              "title": "\u0641\u06CC\u0633\u0628\u0648\u06A9",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u0641\u06CC\u0633\u0628\u0648\u06A9 (\u0645\u062B\u0644\u0627\u064B johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "tiktok",
            "name": "\u062A\u06CC\u06A9\u200C\u062A\u0627\u06A9",
            "type": "link",
            "action": "tiktok",
            "description": "",
            "icon": {
              "type": "component",
              "name": "tiktok"
            },
            "baseUrl": "https://www.tiktok.com/@",
            "placeholder": {
              "title": "\u062A\u06CC\u06A9\u200C\u062A\u0627\u06A9",
              "link": "\u0644\u06CC\u0646\u06A9 \u062A\u06CC\u06A9\u200C\u062A\u0627\u06A9"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "threads",
            "name": "\u062A\u0631\u062F\u0632",
            "type": "link",
            "action": "threads",
            "description": "",
            "icon": {
              "type": "component",
              "name": "threads"
            },
            "baseUrl": "https://www.threads.net/@",
            "placeholder": {
              "title": "\u062A\u0631\u062F\u0632",
              "link": "\u0644\u06CC\u0646\u06A9 \u062A\u0631\u062F\u0632"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "clubhouse",
            "name": "\u06A9\u0644\u0627\u0628\u200C\u0647\u0627\u0648\u0633",
            "type": "link",
            "action": "clubhouse",
            "description": "",
            "icon": {
              "type": "component",
              "name": "clubhouse"
            },
            "baseUrl": "https://www.clubhouse.com/@",
            "placeholder": {
              "title": "\u06A9\u0644\u0627\u0628\u200C\u0647\u0627\u0648\u0633",
              "link": "\u0644\u06CC\u0646\u06A9 \u06A9\u0644\u0627\u0628\u200C\u0647\u0627\u0648\u0633"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "pinterest",
            "name": "\u067E\u06CC\u0646\u062A\u0631\u0633\u062A",
            "type": "link",
            "action": "pinterest",
            "description": "",
            "icon": {
              "type": "component",
              "name": "pinterest"
            },
            "baseUrl": "https://pinterest.com/",
            "placeholder": {
              "title": "\u067E\u06CC\u0646\u062A\u0631\u0633\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u06CC\u0646\u062A\u0631\u0633\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "linkedin",
            "name": "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
            "type": "link",
            "action": "linkedin",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linkedin"
            },
            "baseUrl": "https://linkedin.com/in/",
            "placeholder": {
              "title": "\u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u0644\u06CC\u0646\u06A9\u062F\u06CC\u0646 (\u0645\u062B\u0644\u0627\u064B johndoe)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "youtube",
            "name": "\u06CC\u0648\u062A\u06CC\u0648\u0628",
            "type": "link",
            "action": "youtube",
            "description": "",
            "icon": {
              "type": "component",
              "name": "youtube"
            },
            "baseUrl": "https://youtube.com/",
            "placeholder": {
              "title": "\u06CC\u0648\u062A\u06CC\u0648\u0628",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u06CC\u0627 \u0622\u062F\u0631\u0633 \u06A9\u0627\u0646\u0627\u0644 \u06CC\u0648\u062A\u06CC\u0648\u0628 (\u0645\u062B\u0644\u0627\u064B @channelname \u06CC\u0627 c/ChannelName)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "aparat",
            "name": "\u0622\u067E\u0627\u0631\u0627\u062A",
            "type": "link",
            "action": "aparat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "aparat"
            },
            "baseUrl": "https://aparat.com/",
            "placeholder": {
              "title": "\u0627\u067E\u0627\u0631\u0627\u062A",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u06CC\u0627 \u0622\u062F\u0631\u0633 \u06A9\u0627\u0646\u0627\u0644 \u0622\u067E\u0627\u0631\u0627\u062A (\u0645\u062B\u0644\u0627\u064B @channelname \u06CC\u0627 c/ChannelName)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "x",
            "name": "\u0627\u06A9\u0633",
            "type": "link",
            "action": "twitter",
            "description": "",
            "icon": {
              "type": "component",
              "name": "x"
            },
            "baseUrl": "https://x.com/",
            "placeholder": {
              "title": "\u0627\u06A9\u0633",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u06A9\u0627\u0646\u062A \u0627\u06A9\u0633"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "snapchat",
            "name": "\u0627\u0633\u0646\u067E\u200C\u0686\u062A",
            "type": "link",
            "action": "snapchat",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapchat"
            },
            "baseUrl": "https://snapchat.com/add/",
            "placeholder": {
              "title": "\u0627\u0633\u0646\u067E\u200C\u0686\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u0633\u0646\u067E\u200C\u0686\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "twitch",
            "name": "\u062A\u0648\u06CC\u06CC\u0686",
            "type": "link",
            "action": "twitch",
            "description": "",
            "icon": {
              "type": "component",
              "name": "twitch"
            },
            "baseUrl": "https://twitch.tv/",
            "placeholder": {
              "title": "\u062A\u0648\u06CC\u06CC\u0686",
              "link": "\u0644\u06CC\u0646\u06A9 \u062A\u0648\u06CC\u06CC\u0686"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "rubika",
            "name": "\u0631\u0648\u0628\u06CC\u06A9\u0627",
            "type": "link",
            "action": "rubika",
            "description": "",
            "icon": {
              "type": "component",
              "name": "rubika"
            },
            "baseUrl": "https://rubika.ir/",
            "placeholder": {
              "title": "\u0631\u0648\u0628\u06CC\u06A9\u0627",
              "link": "\u0644\u06CC\u0646\u06A9 \u0631\u0648\u0628\u06CC\u06A9\u0627"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "\u06A9\u0633\u0628\u200C\u0648\u06A9\u0627\u0631",
        "type": "block",
        "items": [
          {
            "id": "app_link",
            "name": "\u0644\u06CC\u0646\u06A9 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646",
            "type": "link",
            "action": "app_link",
            "description": "\u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646 \u0631\u0633\u0645\u06CC \u0645\u0627 \u062F\u0631 \u06AF\u0648\u06AF\u0644 \u067E\u0644\u06CC",
            "icon": {
              "type": "component",
              "name": "app_link"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0644\u06CC\u0646\u06A9 \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0627\u0646\u0644\u0648\u062F \u0627\u067E\u0644\u06CC\u06A9\u06CC\u0634\u0646"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "booksy",
            "name": "\u0628\u0648\u06A9\u0633\u06CC",
            "type": "link",
            "action": "booksy",
            "description": "",
            "icon": {
              "type": "component",
              "name": "booksy"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0628\u0648\u06A9\u0633\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0648\u06A9\u0633\u06CC"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "calendly",
            "name": "\u06A9\u0644\u0646\u062F\u0644\u06CC",
            "type": "link",
            "action": "calendly",
            "description": "",
            "icon": {
              "type": "component",
              "name": "calendly"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u06A9\u0644\u0646\u062F\u0644\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u06A9\u0644\u0646\u062F\u0644\u06CC"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "chili-piper",
            "name": "\u0686\u06CC\u0644\u06CC \u067E\u0627\u06CC\u067E\u0631",
            "type": "link",
            "action": "chili-piper",
            "description": "",
            "icon": {
              "type": "component",
              "name": "chili"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0686\u06CC\u0644\u06CC \u067E\u0627\u06CC\u067E\u0631",
              "link": "\u0644\u06CC\u0646\u06A9 \u0686\u06CC\u0644\u06CC \u067E\u0627\u06CC\u067E\u0631"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "etsy",
            "name": "\u0627\u062A\u0633\u06CC",
            "type": "link",
            "action": "etsy",
            "description": "",
            "icon": {
              "type": "component",
              "name": "etsy"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0627\u062A\u0633\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u062A\u0633\u06CC"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "microsoft-bookings",
            "name": "\u0645\u0627\u06CC\u06A9\u0631\u0648\u0633\u0627\u0641\u062A \u0628\u0648\u06A9\u06CC\u0646\u06AF",
            "type": "link",
            "action": "microsoft-bookings",
            "description": "",
            "icon": {
              "type": "component",
              "name": "microsoft-bookings"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0645\u0627\u06CC\u06A9\u0631\u0648\u0633\u0627\u0641\u062A \u0628\u0648\u06A9\u06CC\u0646\u06AF",
              "link": "\u0644\u06CC\u0646\u06A9 \u0645\u0627\u06CC\u06A9\u0631\u0648\u0633\u0627\u0641\u062A \u0628\u0648\u06A9\u06CC\u0646\u06AF"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "reviews",
            "name": "\u0646\u0638\u0631\u0627\u062A",
            "type": "link",
            "action": "reviews",
            "description": "",
            "icon": {
              "type": "component",
              "name": "reviews"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0646\u0638\u0631\u0627\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u0646\u0638\u0631\u0627\u062A"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "safari",
            "name": "\u0648\u0628\u0633\u0627\u06CC\u062A",
            "type": "link",
            "action": "safari",
            "description": "",
            "icon": {
              "type": "component",
              "name": "website"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0648\u0628\u0633\u0627\u06CC\u062A",
              "link": "\u0622\u062F\u0631\u0633 \u06A9\u0627\u0645\u0644 \u0648\u0628\u0633\u0627\u06CC\u062A (\u0645\u062B\u0644\u0627\u064B https://example.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "square",
            "name": "\u0627\u0633\u06A9\u0648\u0626\u0631",
            "type": "link",
            "action": "square",
            "description": "",
            "icon": {
              "type": "component",
              "name": "square"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0627\u0633\u06A9\u0648\u0626\u0631",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u0633\u06A9\u0648\u0626\u0631"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "yelp",
            "name": "\u06CC\u0650\u0644\u067E",
            "type": "link",
            "action": "yelp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "yelp"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u06CC\u0650\u0644\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u06CC\u0650\u0644\u067E"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "zillow",
            "name": "\u0632\u06CC\u0644\u0648",
            "type": "link",
            "action": "zillow",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zillow"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0632\u06CC\u0644\u0648",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0632\u06CC\u0644\u0648"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "divar",
            "name": "\u062F\u06CC\u0648\u0627\u0631",
            "type": "link",
            "action": "divar",
            "description": "",
            "icon": {
              "type": "component",
              "name": "divar"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u062F\u06CC\u0648\u0627\u0631",
              "link": "\u0644\u06CC\u0646\u06A9 \u0635\u0641\u062D\u0647 \u062F\u06CC\u0648\u0627\u0631"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "snapp",
            "name": "\u0627\u0633\u0646\u067E",
            "type": "link",
            "action": "snapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "snapp"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u0633\u0646\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0627\u0633\u0646\u067E"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "neshan",
            "name": "\u0646\u0634\u0627\u0646",
            "type": "link",
            "action": "neshan",
            "description": "",
            "icon": {
              "type": "component",
              "name": "nshan"
            },
            "baseUrl": "https://neshan.org/maps/@",
            "placeholder": {
              "title": "\u0646\u0642\u0634\u0647 \u0646\u0634\u0627\u0646",
              "link": "\u0644\u06CC\u0646\u06A9 \u0646\u0634\u0627\u0646"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "balad",
            "name": "\u0628\u0644\u062F",
            "type": "link",
            "action": "balad",
            "description": "",
            "icon": {
              "type": "component",
              "name": "balad"
            },
            "baseUrl": "https://balad.ir/p/",
            "placeholder": {
              "title": "\u0646\u0642\u0634\u0647 \u0628\u0644\u062F",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0644\u062F"
            },
            "value": "",
            "enabled": true
          },
          {
            "type": "block",
            "name": "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A",
            "action": "bankcard",
            "enabled": true,
            "id": "card-number-001",
            "title": "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A",
            "value": "6037991234567890",
            "accountHolder": "\u0639\u0644\u06CC \u0631\u0636\u0627\u06CC\u06CC",
            "bankName": "\u0645\u0644\u062A",
            "accountNumber": "1234567890",
            "ibanNumber": "IR820540102680020817909002",
            "description": "\u06A9\u0627\u0631\u062A \u062D\u0642\u0648\u0642 \u0634\u0631\u06A9\u062A",
            "icon": {
              "type": "component",
              "name": "card"
            }
          },
          {
            "type": "block",
            "name": "\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC",
            "action": "workhours",
            "enabled": true,
            "id": "workhours-001",
            "title": "\u0633\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u06CC",
            "value": "",
            "icon": {
              "type": "component",
              "name": "clock"
            }
          }
        ]
      },
      {
        "title": "\u0645\u062D\u062A\u0648\u0627",
        "type": "block",
        "items": [
          {
            "type": "block",
            "name": "\u0648\u06CC\u062F\u06CC\u0648 ",
            "icon": {
              "type": "component",
              "name": "embeddedvideo"
            },
            "action": "embeddedvideo",
            "enabled": true,
            "access": "pro",
            "id": "video-789",
            "title": "\u0648\u06CC\u062F\u06CC\u0648\u06CC \u062A\u0633\u062A\u06CC",
            "value": "https://www.w3schools.com/html/mov_bbb.mp4"
          },
          {
            "type": "block",
            "name": "\u0646\u0645\u0648\u0646\u0647 \u0641\u0627\u06CC\u0644",
            "icon": { "type": "component", "name": "file" },
            "action": "file",
            "enabled": true,
            "access": "pro",
            "id": "file-202",
            "title": "\u0646\u0645\u0648\u0646\u0647 \u0641\u0627\u06CC\u0644",
            "value": ""
          },
          {
            "type": "block",
            "name": "\u0646\u0638\u0631\u0633\u0646\u062C\u06CC",
            "icon": { "type": "component", "name": "poll" },
            "action": "poll",
            "enabled": true,
            "access": "pro",
            "id": "poll-123",
            "title": "\u0646\u0638\u0631 \u0634\u0645\u0627 \u062F\u0631\u0628\u0627\u0631\u0647 \u0633\u0627\u06CC\u062A\u061F",
            "options": ["\u0639\u0627\u0644\u06CC", "\u062E\u0648\u0628", "\u0645\u062A\u0648\u0633\u0637"]
          },
          {
            "type": "block",
            "name": "\u0645\u062A\u0646 \u0633\u0631\u0628\u0631\u06AF",
            "icon": { "type": "component", "name": "textsection" },
            "action": "textsection",
            "enabled": true,
            //"access": "pro",
            "id": "textsection-001",
            "title": "\u0645\u062A\u0646 \u0633\u0631\u0628\u0631\u06AF",
            "value": ""
          },
          {
            "type": "block",
            "name": "\u0628\u0627\u06A9\u0633 \u067E\u0631\u0633\u0634",
            "icon": { "type": "component", "name": "questionbox" },
            "action": "questionbox",
            "enabled": true,
            "access": "pro",
            "id": "question-456",
            "title": "\u0627\u0632 \u0645\u0646 \u0633\u0648\u0627\u0644 \u0628\u067E\u0631\u0633!",
            "avatar": "https://example.com/avatar.jpg"
          },
          {
            "type": "block",
            "name": "\u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u0628\u06CC\u0634\u062A\u0631",
            "icon": { "type": "component", "name": "dropdown" },
            "action": "expandabletext",
            "enabled": true,
            "access": "pro",
            "id": "text-101",
            "title": "\u062A\u0648\u0636\u06CC\u062D\u0627\u062A \u0628\u06CC\u0634\u062A\u0631",
            "value": "\u0627\u06CC\u0646 \u06CC\u06A9 \u0645\u062A\u0646 \u062A\u0633\u062A\u06CC \u0628\u0631\u0627\u06CC \u0646\u0645\u0627\u06CC\u0634 \u0642\u0627\u0628\u0644\u06CC\u062A \u0646\u0645\u0627\u06CC\u0634 \u0648 \u0645\u062E\u0641\u06CC\u200C\u0633\u0627\u0632\u06CC \u0645\u062A\u0646 \u0628\u0644\u0646\u062F \u0627\u0633\u062A."
          }
        ]
      },
      {
        "title": "\u0628\u0627\u0634\u06AF\u0627\u0647 \u0645\u0634\u062A\u0631\u06CC\u0627\u0646",
        "type": "block",
        "items": [
          {
            "type": "block",
            "name": "\u0641\u0631\u0645",
            "icon": { "type": "component", "name": "form" },
            "action": "builder",
            "enabled": true,
            "access": "pro",
            "id": "form-001",
            "title": "\u0641\u0631\u0645 \u062B\u0628\u062A\u200C\u0646\u0627\u0645",
            "description": "\u0641\u0631\u0645 \u0633\u0627\u062F\u0647 \u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u0628\u0631",
            "fields": ["\u0646\u0627\u0645", "\u0627\u06CC\u0645\u06CC\u0644", "\u0634\u0645\u0627\u0631\u0647 \u062A\u0645\u0627\u0633"]
          },
          {
            "type": "block",
            "name": "\u062A\u0627\u0633 \u0634\u0627\u0646\u0633",
            "icon": { "type": "component", "name": "luckydice" },
            "action": "luckydice",
            "enabled": true,
            "access": "pro",
            "id": "dice-001",
            "title": "\u0628\u0627\u0632\u06CC \u0634\u0627\u0646\u0633 \u062A\u0627\u0633",
            "description": "\u0628\u0627 \u0627\u0646\u062F\u0627\u062E\u062A\u0646 \u062A\u0627\u0633 \u062C\u0627\u06CC\u0632\u0647 \u0628\u06AF\u06CC\u0631!",
            "outcomes": ["1 = \u0647\u06CC\u0686\u06CC", "6 = \u0628\u0631\u0646\u062F\u0647\u200C\u0634\u062F\u06CC!", "3 = \u06A9\u062F \u062A\u062E\u0641\u06CC\u0641"]
          },
          {
            "type": "block",
            "name": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633",
            "icon": { "type": "component", "name": "luckywheel" },
            "action": "luckywheel",
            "enabled": true,
            "access": "pro",
            "id": "wheel-001",
            "title": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0634\u0627\u0646\u0633",
            "description": "\u06AF\u0631\u062F\u0648\u0646\u0647 \u0631\u0648 \u0628\u0686\u0631\u062E\u0648\u0646 \u0648 \u0634\u0627\u0646\u0633\u062A \u0631\u0648 \u0627\u0645\u062A\u062D\u0627\u0646 \u06A9\u0646",
            "segments": ["\u0647\u062F\u06CC\u0647", "\u06A9\u062F \u062A\u062E\u0641\u06CC\u0641", "\u0627\u0631\u0633\u0627\u0644 \u0631\u0627\u06CC\u06AF\u0627\u0646", "\u062F\u0641\u0639\u0647 \u0628\u0639\u062F"]
          },
          {
            "type": "block",
            "name": "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633",
            "icon": { "type": "component", "name": "luckyegg" },
            "action": "luckyegg",
            "enabled": true,
            "access": "pro",
            "id": "egg-001",
            "title": "\u062A\u062E\u0645\u200C\u0645\u0631\u063A \u0634\u0627\u0646\u0633",
            "description": "\u0628\u0631\u0627\u06CC \u0634\u06A9\u0633\u062A\u0646 \u062A\u062E\u0645\u200C\u0645\u0631\u063A \u06A9\u0644\u06CC\u06A9 \u06A9\u0646 \u0648 \u062C\u0627\u06CC\u0632\u0647 \u0628\u06AF\u06CC\u0631!",
            "prizes": ["10% \u062A\u062E\u0641\u06CC\u0641", "\u0627\u0631\u0633\u0627\u0644 \u0631\u0627\u06CC\u06AF\u0627\u0646", "\u06A9\u062F \u0647\u062F\u06CC\u0647"]
          }
        ]
      },
      {
        "title": "\u067E\u0631\u062F\u0627\u062E\u062A\u200C\u0647\u0627",
        "type": "block",
        "items": [
          {
            "id": "cashapp",
            "name": "\u06A9\u0634\u200C\u0627\u067E",
            "type": "link",
            "action": "cashapp",
            "description": "",
            "icon": {
              "type": "component",
              "name": "cashapp"
            },
            "baseUrl": "https://cash.app/$",
            "placeholder": {
              "title": "\u06A9\u0634\u200C\u0627\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u06A9\u0634\u200C\u0627\u067E"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "paypal",
            "name": "\u067E\u06CC\u200C\u067E\u0627\u0644",
            "type": "link",
            "action": "paypal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "paypal"
            },
            "baseUrl": "https://paypal.me/",
            "placeholder": {
              "title": "\u067E\u06CC\u200C\u067E\u0627\u0644",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u067E\u06CC\u200C\u067E\u0627\u0644"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "raymit",
            "name": "\u0631\u06CC\u200C\u0645\u06CC\u062A",
            "type": "link",
            "action": "raymit",
            "description": "",
            "icon": {
              "type": "component",
              "name": "remit"
            },
            "baseUrl": "https://raymit.ir/",
            "placeholder": {
              "title": "\u0631\u06CC\u200C\u0645\u06CC\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u0631\u06CC\u200C\u0645\u06CC\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zelle",
            "name": "\u0632\u0644",
            "type": "link",
            "action": "zelle",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zelle"
            },
            "baseUrl": "https://zellepay.com/",
            "placeholder": {
              "title": "\u0632\u0644",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u0632\u0644"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zarinpal",
            "name": "\u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644",
            "type": "link",
            "action": "zarinpal",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zarinpal"
            },
            "baseUrl": "https://zarinp.al/",
            "placeholder": {
              "title": "\u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u0632\u0631\u06CC\u0646\u200C\u067E\u0627\u0644"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "trustwallet",
            "name": "\u062A\u0631\u0627\u0633\u062A\u200C\u0648\u0644\u062A",
            "type": "link",
            "action": "trustwallet",
            "description": "",
            "icon": {
              "type": "component",
              "name": "trustwallet"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u062A\u0631\u0627\u0633\u062A\u200C\u0648\u0644\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u0631\u06AF\u0627\u0647 \u062A\u0631\u0627\u0633\u062A\u200C\u0648\u0644\u062A"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          }
        ]
      },
      {
        "title": "\u0645\u0648\u0632\u06CC\u06A9 \u0648 \u0633\u0631\u06AF\u0631\u0645\u06CC",
        "type": "block",
        "items": [
          {
            "id": "spotify",
            "name": "\u0627\u0633\u067E\u0627\u062A\u06CC\u0641\u0627\u06CC",
            "type": "link",
            "action": "spotify",
            "description": "",
            "icon": {
              "type": "component",
              "name": "spotify"
            },
            "baseUrl": "https://open.spotify.com/",
            "placeholder": {
              "title": "\u0627\u0633\u067E\u0627\u062A\u06CC\u0641\u0627\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0644\u06CC\u200C\u0644\u06CC\u0633\u062A \u06CC\u0627 \u0622\u0631\u062A\u06CC\u0633\u062A \u0627\u0633\u067E\u0627\u062A\u06CC\u0641\u0627\u06CC"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "apple_music",
            "name": "\u0627\u067E\u0644 \u0645\u0648\u0632\u06CC\u06A9",
            "type": "link",
            "action": "apple_music",
            "description": "",
            "icon": {
              "type": "component",
              "name": "apple_music"
            },
            "baseUrl": "https://music.apple.com/",
            "placeholder": {
              "title": "\u0627\u067E\u0644 \u0645\u0648\u0632\u06CC\u06A9",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0644\u06CC\u200C\u0644\u06CC\u0633\u062A \u06CC\u0627 \u0622\u0631\u062A\u06CC\u0633\u062A \u0627\u067E\u0644 \u0645\u0648\u0632\u06CC\u06A9"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "youtube_music",
            "name": "\u06CC\u0648\u062A\u06CC\u0648\u0628 \u0645\u0648\u0632\u06CC\u06A9",
            "type": "link",
            "action": "youtube_music",
            "description": "",
            "icon": {
              "type": "component",
              "name": "youtube_music"
            },
            "baseUrl": "https://music.youtube.com/",
            "placeholder": {
              "title": "\u06CC\u0648\u062A\u06CC\u0648\u0628 \u0645\u0648\u0632\u06CC\u06A9",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0644\u06CC\u200C\u0644\u06CC\u0633\u062A \u06CC\u0627 \u0622\u0631\u062A\u06CC\u0633\u062A \u06CC\u0648\u062A\u06CC\u0648\u0628 \u0645\u0648\u0632\u06CC\u06A9"
            },
            "value": "",
            "enabled": true
          }
        ]
      },
      {
        "title": "\u0628\u06CC\u0634\u062A\u0631",
        "type": "block",
        "items": [
          {
            "id": "featuredlink",
            "name": "\u0644\u06CC\u0646\u06A9 \u0628\u0631\u062C\u0633\u062A\u0647",
            "type": "block",
            "action": "featuredlink",
            "description": "\u0644\u06CC\u0646\u06A9 \u0648\u06CC\u0698\u0647",
            "access": "pro",
            "icon": {
              "type": "component",
              "name": "featured"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0644\u06CC\u0646\u06A9 \u0628\u0631\u062C\u0633\u062A\u0647",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0631\u062C\u0633\u062A\u0647 (\u0645\u062B\u0644\u0627\u064B https://example.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "customlink",
            "name": "\u0644\u06CC\u0646\u06A9 \u0633\u0641\u0627\u0631\u0634\u06CC",
            "type": "link",
            "action": "customlink",
            "access": "pro",
            "description": "\u0627\u0641\u0632\u0648\u062F\u0646 \u0647\u0631 \u0644\u06CC\u0646\u06A9 \u062F\u0644\u062E\u0648\u0627\u0647",
            "icon": {
              "type": "component",
              "name": "customlink"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0644\u06CC\u0646\u06A9 \u0633\u0641\u0627\u0631\u0634\u06CC",
              "link": "\u0622\u062F\u0631\u0633 \u06A9\u0627\u0645\u0644 \u0644\u06CC\u0646\u06A9 (\u0645\u062B\u0644\u0627\u064B https://example.com)"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "igap",
            "name": "\u0622\u06CC\u200C\u06AF\u067E",
            "type": "link",
            "action": "igap",
            "description": "",
            "icon": {
              "type": "component",
              "name": "igap"
            },
            "baseUrl": "https://igap.net/",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0622\u06CC\u200C\u06AF\u067E",
              "link": "\u0644\u06CC\u0646\u06A9 \u0622\u06CC\u200C\u06AF\u067E"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "discord",
            "name": "\u062F\u06CC\u0633\u06A9\u0648\u0631\u062F",
            "type": "link",
            "action": "discord",
            "description": "",
            "icon": {
              "type": "component",
              "name": "discord"
            },
            "baseUrl": "https://discord.com/users/",
            "placeholder": {
              "title": "\u0633\u0631\u0648\u0631 \u062F\u06CC\u0633\u06A9\u0648\u0631\u062F",
              "link": "\u0644\u06CC\u0646\u06A9 \u062F\u06CC\u0633\u06A9\u0648\u0631\u062F"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "bale",
            "name": "\u0628\u0644\u0647",
            "type": "link",
            "action": "bale",
            "description": "",
            "icon": {
              "type": "component",
              "name": "bale"
            },
            "baseUrl": "https://ble.ir/",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0628\u0644\u0647",
              "link": "\u0644\u06CC\u0646\u06A9 \u0628\u0644\u0647"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "linktree",
            "name": "\u0644\u06CC\u0646\u06A9\u200C\u062A\u0631\u06CC",
            "type": "link",
            "action": "linktree",
            "description": "",
            "icon": {
              "type": "component",
              "name": "linktree"
            },
            "baseUrl": "https://linktr.ee/",
            "placeholder": {
              "title": "\u0644\u06CC\u0646\u06A9 \u0644\u06CC\u0646\u06A9\u200C\u062A\u0631\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u0644\u06CC\u0646\u06A9\u200C\u062A\u0631\u06CC"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "poshmark",
            "name": "\u067E\u0648\u0634\u0645\u0627\u0631\u06A9",
            "type": "link",
            "action": "poshmark",
            "description": "",
            "icon": {
              "type": "component",
              "name": "poshmark"
            },
            "baseUrl": "https://poshmark.com/closet/",
            "placeholder": {
              "title": "\u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u067E\u0648\u0634\u0645\u0627\u0631\u06A9",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0648\u0634\u0645\u0627\u0631\u06A9"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "hobby",
            "name": "\u0647\u0648\u0628\u06CC",
            "type": "link",
            "action": "hobby",
            "description": "",
            "icon": {
              "type": "component",
              "name": "hoobe"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0647\u0648\u0628\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u0647\u0648\u0628\u06CC"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "podcast",
            "name": "\u067E\u0627\u062F\u06A9\u0633\u062A\u200C\u0647\u0627",
            "type": "link",
            "action": "podcast",
            "description": "",
            "icon": {
              "type": "component",
              "name": "podcasts"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u067E\u0627\u062F\u06A9\u0633\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u067E\u0627\u062F\u06A9\u0633\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "figma",
            "name": "\u0641\u06CC\u06AF\u0645\u0627",
            "type": "link",
            "action": "figma",
            "description": "",
            "icon": {
              "type": "component",
              "name": "figma"
            },
            "baseUrl": "https://figma.com/@",
            "placeholder": {
              "title": "\u067E\u0631\u0648\u0698\u0647 \u0641\u06CC\u06AF\u0645\u0627",
              "link": "\u0644\u06CC\u0646\u06A9 \u0641\u06CC\u06AF\u0645\u0627"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "opensea",
            "name": "\u0627\u0648\u067E\u0646\u200C\u0633\u06CC\u200C\u0622\u06CC",
            "type": "link",
            "action": "opensea",
            "description": "",
            "icon": {
              "type": "component",
              "name": "opensea_color"
            },
            "baseUrl": "",
            "placeholder": {
              "title": "\u0635\u0641\u062D\u0647 \u0627\u0648\u067E\u0646\u200C\u0633\u06CC",
              "link": "\u0644\u06CC\u0646\u06A9 \u0627\u0648\u067E\u0646\u200C\u0633\u06CC"
            },
            "value": "",
            "enabled": true,
            "access": "pro"
          },
          {
            "id": "github",
            "name": "\u06AF\u06CC\u062A\u200C\u0647\u0627\u0628",
            "type": "link",
            "action": "github",
            "description": "",
            "icon": {
              "type": "component",
              "name": "github"
            },
            "baseUrl": "https://github.com/",
            "placeholder": {
              "title": "\u0645\u062E\u0632\u0646 \u06AF\u06CC\u062A\u200C\u0647\u0627\u0628",
              "link": "\u0644\u06CC\u0646\u06A9 \u06AF\u06CC\u062A\u200C\u0647\u0627\u0628"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "googlemeet",
            "name": "\u06AF\u0648\u06AF\u0644 \u0645\u06CC\u062A",
            "type": "link",
            "action": "googlemeet",
            "description": "",
            "icon": {
              "type": "component",
              "name": "googlemeet"
            },
            "baseUrl": "https://meet.google.com/",
            "placeholder": {
              "title": "\u062C\u0644\u0633\u0647 \u06AF\u0648\u06AF\u0644 \u0645\u06CC\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u06AF\u0648\u06AF\u0644 \u0645\u06CC\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "teams",
            "name": "\u062A\u06CC\u0645\u0632",
            "type": "link",
            "action": "teams",
            "description": "",
            "icon": {
              "type": "component",
              "name": "teams"
            },
            "baseUrl": "https://teams.microsoft.com/l/meetup-join/",
            "placeholder": {
              "title": "\u062C\u0644\u0633\u0647 \u062A\u06CC\u0645\u0632",
              "link": "\u0644\u06CC\u0646\u06A9 \u062A\u06CC\u0645\u0632"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "zoom",
            "name": "\u0632\u0648\u0645",
            "type": "link",
            "action": "zoom",
            "description": "",
            "icon": {
              "type": "component",
              "name": "zoom"
            },
            "baseUrl": "https://zoom.us/my/",
            "placeholder": {
              "title": "\u062C\u0644\u0633\u0647 \u0632\u0648\u0645",
              "link": "\u0644\u06CC\u0646\u06A9 \u0632\u0648\u0645"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "medium",
            "name": "\u0645\u062F\u06CC\u0648\u0645",
            "type": "link",
            "action": "medium",
            "description": "",
            "icon": {
              "type": "component",
              "name": "medium"
            },
            "baseUrl": "https://medium.com/@",
            "placeholder": {
              "title": "\u0646\u0648\u0634\u062A\u0647 \u0645\u062F\u06CC\u0648\u0645",
              "link": "\u0644\u06CC\u0646\u06A9 \u0645\u062F\u06CC\u0648\u0645"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "trustpilot",
            "name": "\u062A\u0631\u0627\u0633\u062A\u200C\u067E\u0627\u06CC\u0644\u0648\u062A",
            "type": "link",
            "action": "trustpilot",
            "description": "",
            "icon": {
              "type": "component",
              "name": "trustpilot"
            },
            "baseUrl": "https://www.trustpilot.com/review/",
            "placeholder": {
              "title": "\u062A\u0631\u0627\u0633\u062A\u200C\u067E\u0627\u06CC\u0644\u0648\u062A",
              "link": "\u0644\u06CC\u0646\u06A9 \u0635\u0641\u062D\u0647 \u062A\u0631\u0627\u0633\u062A\u200C\u067E\u0627\u06CC\u0644\u0648\u062A"
            },
            "value": "",
            "enabled": true
          },
          {
            "id": "virgool",
            "name": "\u0648\u06CC\u0631\u06AF\u0648\u0644",
            "type": "link",
            "action": "virgool",
            "description": "",
            "icon": {
              "type": "component",
              "name": "virgool"
            },
            "baseUrl": "https://virgool.io/@",
            "placeholder": {
              "title": "\u0648\u06CC\u0631\u06AF\u0648\u0644",
              "link": "\u06CC\u0648\u0632\u0631\u0646\u06CC\u0645 \u06CC\u0627 \u0644\u06CC\u0646\u06A9 \u0648\u06CC\u0631\u06AF\u0648\u0644"
            },
            "value": "",
            "enabled": true
          }
        ]
      }
    ]
  };
});

export { data as default };
//# sourceMappingURL=data.mjs.map
