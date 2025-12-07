/**
 * Composable for deep linking to native apps on iOS and Android
 * Falls back to web URL if app is not installed
 */

export const useDeepLink = () => {
  /**
   * Detect if user is on mobile device
   */
  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * Detect if user is on iOS device
   */
  const isIOS = () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  /**
   * Detect if user is on Android device
   */
  const isAndroid = () => {
    if (typeof window === 'undefined') return false
    return /Android/.test(navigator.userAgent)
  }

  /**
   * App URL schemes for different social media platforms
   */
  const appSchemes = {
    // تماس و پیام
    call: {
      ios: (phone) => `tel:${phone}`,
      android: (phone) => `tel:${phone}`,
      web: (phone) => `tel:${phone}`
    },
    number: {
      ios: (phone) => `sms:${phone}`,
      android: (phone) => `sms:${phone}`,
      web: (phone) => `sms:${phone}`
    },
    email: {
      ios: (email) => `mailto:${email}`,
      android: (email) => `mailto:${email}`,
      web: (email) => `mailto:${email}`
    },
    facetime: {
      ios: (contact) => `facetime:${contact}`,
      android: (contact) => `facetime:${contact}`, // در اندروید کار نمیکنه اما harmless است
      web: (contact) => `facetime:${contact}`
    },
    instagram: {
      ios: (username) => `instagram://user?username=${username}`,
      android: (username) => `intent://instagram.com/_u/${username}/#Intent;package=com.instagram.android;scheme=https;end`,
      web: (username) => `https://instagram.com/${username}`
    },
    linkedin: {
      ios: (username) => `linkedin://profile/${username}`,
      android: (username) => `intent://linkedin.com/in/${username}#Intent;package=com.linkedin.android;scheme=https;end`,
      web: (username) => `https://linkedin.com/in/${username}`
    },
    facebook: {
      ios: (username) => `fb://profile/${username}`,
      android: (username) => `intent://facebook.com/${username}#Intent;package=com.facebook.katana;scheme=https;end`,
      web: (username) => `https://facebook.com/${username}`
    },
    twitter: {
      ios: (username) => `twitter://user?screen_name=${username}`,
      android: (username) => `intent://twitter.com/${username}#Intent;package=com.twitter.android;scheme=https;end`,
      web: (username) => `https://twitter.com/${username}`
    },
    x: {
      ios: (username) => `twitter://user?screen_name=${username}`,
      android: (username) => `intent://x.com/${username}#Intent;package=com.twitter.android;scheme=https;end`,
      web: (username) => `https://x.com/${username}`
    },
    youtube: {
      ios: (channel) => `youtube://www.youtube.com/${channel}`,
      android: (channel) => `intent://youtube.com/${channel}#Intent;package=com.google.android.youtube;scheme=https;end`,
      web: (channel) => `https://youtube.com/${channel}`
    },
    telegram: {
      ios: (username) => `tg://resolve?domain=${username}`,
      android: (username) => `tg://resolve?domain=${username}`,
      web: (username) => `https://t.me/${username}`
    },
    whatsapp: {
      ios: (phone) => `whatsapp://send?phone=${phone}`,
      android: (phone) => `intent://send?phone=${phone}#Intent;package=com.whatsapp;scheme=whatsapp;end`,
      web: (phone) => `https://wa.me/${phone}`
    },
    tiktok: {
      ios: (username) => `snssdk1233://user/profile/${username}`,
      android: (username) => `intent://tiktok.com/@${username}#Intent;package=com.zhiliaoapp.musically;scheme=https;end`,
      web: (username) => `https://www.tiktok.com/@${username}`
    },
    snapchat: {
      ios: (username) => `snapchat://add/${username}`,
      android: (username) => `intent://snapchat.com/add/${username}#Intent;package=com.snapchat.android;scheme=https;end`,
      web: (username) => `https://snapchat.com/add/${username}`
    },
    threads: {
      ios: (username) => `barcelona://user?username=${username}`,
      android: (username) => `intent://threads.net/@${username}#Intent;package=com.instagram.barcelona;scheme=https;end`,
      web: (username) => `https://www.threads.net/@${username}`
    },
    pinterest: {
      ios: (username) => `pinterest://user/${username}`,
      android: (username) => `intent://pinterest.com/${username}#Intent;package=com.pinterest;scheme=https;end`,
      web: (username) => `https://pinterest.com/${username}`
    },
    // اپلیکیشن‌های ایرانی
    eitaa: {
      ios: (username) => `eitaa://resolve?domain=${username.replace(/^@/, '')}`,
      android: (username) => `eitaa://resolve?domain=${username.replace(/^@/, '')}`,
      web: (username) => `https://eitaa.com/${username.replace(/^@/, '')}`
    },
    rubika: {
      ios: (username) => `rubika://l.rubika.ir/${username.replace(/^@/, '')}`,
      android: (username) => `intent://l.rubika.ir/${username.replace(/^@/, '')}#Intent;package=ir.resaneh1.iptv;scheme=https;end`,
      web: (username) => `https://rubika.ir/${username.replace(/^@/, '')}`
    },
    bale: {
      ios: (username) => `bale://resolve?domain=${username.replace(/^@/, '')}`,
      android: (username) => `bale://resolve?domain=${username.replace(/^@/, '')}`,
      web: (username) => `https://ble.ir/${username.replace(/^@/, '')}`
    },
    igap: {
      ios: (username) => `igap://resolve?domain=${username.replace(/^@/, '')}`,
      android: (username) => `igap://resolve?domain=${username.replace(/^@/, '')}`,
      web: (username) => `https://igap.net/${username.replace(/^@/, '')}`
    },
    aparat: {
      ios: (username) => {
        // اگر username با v/ شروع شده، ویدیو است
        if (username.startsWith('v/')) {
          return `aparat://video/${username.replace('v/', '')}`
        }
        // در غیر این صورت، چنل است
        return `aparat://channel/${username.replace(/^@/, '')}`
      },
      android: (username) => {
        if (username.startsWith('v/')) {
          return `intent://aparat.com/v/${username.replace('v/', '')}#Intent;package=ir.aparat.android;scheme=https;end`
        }
        return `intent://aparat.com/${username.replace(/^@/, '')}#Intent;package=ir.aparat.android;scheme=https;end`
      },
      web: (username) => {
        if (username.startsWith('v/')) {
          return `https://aparat.com/v/${username.replace('v/', '')}`
        }
        return `https://aparat.com/${username.replace(/^@/, '')}`
      }
    },
    // نقشه و حمل و نقل
    snapp: {
      ios: (location) => `snapp://ride?lat=&lng=`,
      android: (location) => `intent://snapp.ir#Intent;package=cab.snapp.passenger.play;scheme=https;end`,
      web: (location) => `https://snapp.ir`
    },
    divar: {
      ios: (link) => link.startsWith('http') ? link : `https://divar.ir/${link}`,
      android: (link) => `intent://divar.ir/${link}#Intent;package=ir.divar;scheme=https;end`,
      web: (link) => link.startsWith('http') ? link : `https://divar.ir/${link}`
    },
    balad: {
      ios: (location) => `balad://search?q=${location}`,
      android: (location) => `intent://search?q=${location}#Intent;package=ir.balad.client;scheme=balad;end`,
      web: (location) => `https://balad.ir`
    },
    neshan: {
      ios: (location) => `neshan://search?text=${location}`,
      android: (location) => `intent://search?text=${location}#Intent;package=org.rajman.neshan;scheme=neshan;end`,
      web: (location) => `https://neshan.org`
    },
    // موسیقی
    spotify: {
      ios: (username) => `spotify:user:${username}`,
      android: (username) => `intent://open.spotify.com/user/${username}#Intent;package=com.spotify.music;scheme=https;end`,
      web: (username) => `https://open.spotify.com/user/${username}`
    },
    apple_music: {
      ios: (artist) => `music://music.apple.com/artist/${artist}`,
      android: (artist) => `https://music.apple.com/artist/${artist}`,
      web: (artist) => `https://music.apple.com/artist/${artist}`
    },
    youtube_music: {
      ios: (channel) => `youtubemusic://youtube.com/${channel}`,
      android: (channel) => `intent://youtube.com/${channel}#Intent;package=com.google.android.apps.youtube.music;scheme=https;end`,
      web: (channel) => `https://music.youtube.com/${channel}`
    },
    // شبکه‌های اجتماعی دیگر
    discord: {
      ios: (server) => `discord://discord.com/invite/${server}`,
      android: (server) => `intent://discord.com/invite/${server}#Intent;package=com.discord;scheme=https;end`,
      web: (server) => `https://discord.com/invite/${server}`
    },
    clubhouse: {
      ios: (username) => `clubhouse://join?username=${username}`,
      android: (username) => `https://clubhouse.com/@${username}`,
      web: (username) => `https://clubhouse.com/@${username}`
    },
    twitch: {
      ios: (channel) => `twitch://stream/${channel}`,
      android: (channel) => `intent://twitch.tv/${channel}#Intent;package=tv.twitch.android.app;scheme=https;end`,
      web: (channel) => `https://twitch.tv/${channel}`
    },
    wechat: {
      ios: (id) => `weixin://dl/chat?${id}`,
      android: (id) => `weixin://dl/chat?${id}`,
      web: (id) => `https://weixin.qq.com`
    },
    medium: {
      ios: (username) => `medium://p/${username}`,
      android: (username) => `intent://medium.com/@${username}#Intent;package=com.medium.reader;scheme=https;end`,
      web: (username) => `https://medium.com/@${username}`
    },
    // توسعه و کار
    github: {
      ios: (username) => `github://github.com/${username}`,
      android: (username) => `intent://github.com/${username}#Intent;package=com.github.android;scheme=https;end`,
      web: (username) => `https://github.com/${username}`
    },
    zoom: {
      ios: (meeting) => `zoomus://zoom.us/join?confno=${meeting}`,
      android: (meeting) => `intent://zoom.us/join?confno=${meeting}#Intent;package=us.zoom.videomeetings;scheme=https;end`,
      web: (meeting) => `https://zoom.us/j/${meeting}`
    },
    googlemeet: {
      ios: (meeting) => `googlemeet://meet.google.com/${meeting}`,
      android: (meeting) => `intent://meet.google.com/${meeting}#Intent;package=com.google.android.apps.meetings;scheme=https;end`,
      web: (meeting) => `https://meet.google.com/${meeting}`
    },
    teams: {
      ios: (meeting) => `msteams://teams.microsoft.com/l/meetup-join/${meeting}`,
      android: (meeting) => `intent://teams.microsoft.com/l/meetup-join/${meeting}#Intent;package=com.microsoft.teams;scheme=https;end`,
      web: (meeting) => `https://teams.microsoft.com/l/meetup-join/${meeting}`
    }
  }

  /**
   * Get deep link URL based on action and value
   * @param {string} action - The social media platform (e.g., 'instagram', 'linkedin')
   * @param {string} value - The username or identifier
   * @param {string} baseUrl - The base URL from the link data
   * @returns {string} - The appropriate deep link or web fallback URL
   */
  const getDeepLink = (action, value, baseUrl = '') => {
    if (!value || !action) {
      return '#'
    }

    // اگر value قبلاً URL کامل است، مستقیماً برگردان
    if (/^(https?:|mailto:|tel:|facetime:|sms:|ftp:|ftps:|tg:|geo:|maps:|intent:|app:|custom:)/i.test(value)) {
      return value
    }

    const scheme = appSchemes[action]
    if (!scheme) {
      // No deep link scheme available, return web URL
      if (!baseUrl) return value
      // Clean value از @ و + و سپس اضافه کن به baseUrl
      const cleanValue = value.replace(/^[@+]/, '').trim()
      // اگر value با baseUrl شروع شده، مستقیماً برگردان
      if (value.includes(baseUrl)) return value
      return baseUrl + cleanValue
    }

    // Clean username/value
    const cleanValue = value.replace(/^[@+]/, '').trim()
    
    // Remove baseUrl prefix if it exists in value
    let finalValue = cleanValue
    if (baseUrl && cleanValue.startsWith(baseUrl.replace(/^https?:\/\//, ''))) {
      finalValue = cleanValue.replace(baseUrl.replace(/^https?:\/\//, ''), '')
    }

    // Return appropriate URL based on platform and mobile detection
    if (!isMobile()) {
      // Desktop: return web URL
      return scheme.web(finalValue)
    }

    if (isIOS()) {
      return scheme.ios(finalValue)
    } else if (isAndroid()) {
      return scheme.android(finalValue)
    }

    // Fallback to web
    return scheme.web(finalValue)
  }

  /**
   * Get website URL with protocol
   * @param {string} value - The website URL
   * @param {string} protocol - The protocol (http or https)
   * @returns {string} - The full website URL with protocol
   */
  const getWebsiteUrl = (value, protocol = 'https') => {
    if (!value) return '#'
    
    // Remove any existing protocol
    let cleanValue = value.replace(/^https?:\/\//i, '')
    
    // Add selected protocol
    return `${protocol}://${cleanValue}`
  }

  /**
   * Get WhatsApp URL based on type (phone or channel)
   * @param {string} value - Phone number or channel link
   * @param {string} whatsappType - 'phone' or 'channel'
   * @returns {string} - The appropriate WhatsApp URL
   */
  const getWhatsAppUrl = (value, whatsappType = 'phone') => {
    if (!value) return '#'

    if (whatsappType === 'channel') {
      // Channel link - use as is
      return value.startsWith('http') ? value : `https://${value}`
    }

    // Phone number - use deep linking
    const cleanPhone = value.replace(/[^\d+]/g, '')
    return getDeepLink('whatsapp', cleanPhone, 'https://wa.me/')
  }

  return {
    isMobile,
    isIOS,
    isAndroid,
    getDeepLink,
    getWebsiteUrl,
    getWhatsAppUrl
  }
}
