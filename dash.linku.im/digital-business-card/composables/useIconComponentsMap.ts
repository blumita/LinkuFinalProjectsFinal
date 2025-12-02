// Icon Components Map Configuration
// این فایل نگاشت کامل تمام ایکون‌ها را شامل می‌شود
// و در تمام فرم‌ها (add/edit) و کامپوننت‌های preview استفاده می‌شود

import * as ContactIcons from '~/components/ui/icons/contact'
import * as SocialMediaIcons from '~/components/ui/icons/SocialMedia'
import * as BusinessIcons from '~/components/ui/icons/Business'
import * as PaymentIcons from '~/components/ui/icons/Payment'
import * as ContentIcons from '~/components/ui/icons/Content'
import * as MusicIcons from '~/components/ui/icons/Music'
import * as ClubIcons from '~/components/ui/icons/Club'

interface IconData {
  type?: string;
  name?: string;
  path?: string;
  url?: string;
  [key: string]: unknown;
}

interface FormData {
  icon?: IconData;
  customIcon?: string;
  [key: string]: unknown;
}

export const iconComponentsMap: Record<string, unknown> = {
  // Contact icons
  'telegram': ContactIcons.telegram,
  'email': ContactIcons.email,
  'phone': ContactIcons.number, // phone mapped to number
  'website': BusinessIcons.website, // use actual website icon from Business
  'number': ContactIcons.number,
  'call': ContactIcons.call,
  'contactcard': ContactIcons.contactcard,
  'address': ContactIcons.address,
  'facetime': ContactIcons.facetime,
  'whatsapp': ContactIcons.whatsapp,
  'eitaa': ContactIcons.eitaa,
  
  // Social Media icons
  'instagram': SocialMediaIcons.instagram,
  'facebook': SocialMediaIcons.facebook,
  'tiktok': SocialMediaIcons.tiktok,
  'twitter': SocialMediaIcons.x, // twitter mapped to x.vue
  'x': SocialMediaIcons.x,
  'linkedin': SocialMediaIcons.linkedin,
  'youtube': SocialMediaIcons.youtube,
  'aparat': SocialMediaIcons.aparat,
  'discord': SocialMediaIcons.discord,
  'snapchat': SocialMediaIcons.snapchat,
  'pinterest': SocialMediaIcons.pinterest,
  'threads': SocialMediaIcons.threads,
  'theards': SocialMediaIcons.threads, // typo variant
  'thread': SocialMediaIcons.threads, // singular variant
  'clubhouse': SocialMediaIcons.clubhouse,
  'twitch': SocialMediaIcons.twitch,
  'rubika': SocialMediaIcons.rubika,
  'github': BusinessIcons.github, // github is in Business
  'bale': SocialMediaIcons.bale,
  'igap': SocialMediaIcons.igap,
  'medium': SocialMediaIcons.medium,
  'virgool': SocialMediaIcons.virgool,
  
  // Business icons
  'app_link': BusinessIcons.app_link,
  'booksy': BusinessIcons.booksy,
  'calendly': BusinessIcons.calendly,
  'card': BusinessIcons.card, // شماره کارت / کارت بانکی
  'chili': BusinessIcons.chili,
  'chili-piper': BusinessIcons.calendly, // chili-piper mapped to calendly (placeholder)
  'etsy': BusinessIcons.etsy,
  'reviews': BusinessIcons.reviews,
  'review': BusinessIcons.reviews, // singular variant
  'square': BusinessIcons.square,
  'yelp': BusinessIcons.yelp,
  'divar': BusinessIcons.divar,
  'snapp': BusinessIcons.snapp,
  'nshan': BusinessIcons.nshan,
  'neshan': BusinessIcons.nshan, // alternative spelling
  'balad': BusinessIcons.balad,
  'figma': BusinessIcons.figma,
  'googlemeet': BusinessIcons.googlemeet,
  'teams': BusinessIcons.teams,
  'zoom': BusinessIcons.zoom,
  'trustpilot': BusinessIcons.trustpilot,
  'zillow': BusinessIcons.zillow,
  'microsoft-bookings': BusinessIcons.microsoft_bookings, // microsoft-bookings mapped to microsoft_bookings
  'microsoft_bookings': BusinessIcons.microsoft_bookings,
  'microsoftbookings': BusinessIcons.microsoft_bookings, // no separator
  'map': BusinessIcons.linkumap, // map icon for geographic locations
  'linkumap': BusinessIcons.linkumap, // linkumap icon for map functionality
  
  // Payment icons
  'cashapp': PaymentIcons.cashapp,
  'paypal': PaymentIcons.paypal,
  'zelle': PaymentIcons.zelle,
  'remit': PaymentIcons.remit,
  'reymit': PaymentIcons.remit, // alternative spelling
  'zarinpal': PaymentIcons.zarinpal,
  'trustwallet': PaymentIcons.trustwallet,
  
  // Content icons
  'customlink': ContentIcons.customlink,
  'dropdown': ContentIcons.dropDown,
  'embeddedvideo': ContentIcons.embeddedvideo,
  'featured': ContentIcons.featured,
  'featuredlink': ContentIcons.featured, // featuredlink mapped to featured
  'file': ContentIcons.file,
  'textsection': ContentIcons.textSection,
  'text-section': ContentIcons.textSection, // alternative
  'poll': ContentIcons.poll,
  'questionbox': ContentIcons.questionbox,
  
  // Music icons  
  'hoobe': MusicIcons.hoobe,
  'linktree': MusicIcons.linktree,
  'opensea_color': MusicIcons.opensea_color,
  // 'opensea': MusicIcons.opensea, // Removed because it does not exist
  'podcasts': MusicIcons.podcasts,
  'poshmark': MusicIcons.poshmark,
  'spotify': MusicIcons.spotify,
  'youtube_music': MusicIcons.youtube_music,
  'apple_music': MusicIcons.apple_music,
  
  // Club icons
  'luckyegg': ClubIcons.luckyegg,
  'luckydice': ClubIcons.luckydice,
  'luckywheel': ClubIcons.luckywheel,
  'form': ClubIcons.form,
  
  // Additional mappings for common names - use correct folders
  'code': ContentIcons.file, // code mapped to file
  'calendar': BusinessIcons.calendly, // calendar mapped to calendly
  'box': ContentIcons.file, // box mapped to file  
  'wrench': BusinessIcons.app_link, // wrench mapped to app_link
  'appointment': BusinessIcons.calendly, // appointment mapped to calendly
  'clock': BusinessIcons.clock, // clock mapped to actual clock icon
  'user': BusinessIcons.app_link, // user mapped to app_link
  'creditcard': BusinessIcons.card, // creditcard mapped to card
  'credit-card': BusinessIcons.card, // credit-card mapped to card
  'bankcard': BusinessIcons.card, // bankcard mapped to card
  'bank-card': BusinessIcons.card, // bank-card mapped to card
  'dollar': PaymentIcons.cashapp, // dollar mapped to cashapp
  'dollarcircle': PaymentIcons.cashapp, // dollarcircle mapped to cashapp
  'coins': PaymentIcons.cashapp, // coins mapped to cashapp
  'image': ContentIcons.file, // image mapped to file
  'video': ContentIcons.embeddedvideo, // video mapped to embeddedvideo
  'book': ContentIcons.file, // book mapped to file
  'userx': BusinessIcons.app_link, // userx mapped to app_link (from club)
  'userplus': BusinessIcons.app_link, // userplus mapped to app_link (from club)
  'usercheck': BusinessIcons.app_link, // usercheck mapped to app_link (from club)
  'alerttriangle': ContentIcons.featured, // alerttriangle mapped to featured
  'chevrondown': ContentIcons.dropDown, // chevrondown mapped to dropDown
  'arrowright': ContentIcons.featured, // arrowright mapped to featured
  'safari': BusinessIcons.website, // safari mapped to website
}

// Composable function for using icon components
export const useIconComponents = () => {
  const getIconComponent = (iconData: IconData | string) => {
    // Handle string input (shortcut)
    if (typeof iconData === 'string') {
      const iconName = iconData.toLowerCase();
      const component = iconComponentsMap[iconName];
      
      if (!component) {
      }
      
      return component || null;
    }
    
    // Handle object input
    if (iconData?.type === 'component') {
      // Support both 'name' and 'path' properties
      const iconName = (iconData.name || iconData.path || '').toLowerCase();
      if (!iconName) return null;
      
      const component = iconComponentsMap[iconName];
      
      if (!component) {
      }
      
      return component || null;
    }
    return null;
  }

  const getSafeIcon = (form: FormData) => {
    // اولویت: customIcon
    if (typeof form.customIcon === 'string' && form.customIcon) return form.customIcon;
    // اگر icon object بود و url داشت
    if (form.icon && typeof form.icon === 'object' && form.icon !== null) {
      if (form.icon.url && typeof form.icon.url === 'string' && form.icon.url) return form.icon.url;
    }
    return null;
  }

  return {
    iconComponentsMap,
    getIconComponent,
    getSafeIcon
  }
}
