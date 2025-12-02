// Modal-specific icon composable with original colors
// این فایل فقط برای مدال‌ها استفاده می‌شه و رنگ اصلی آیکون‌ها رو نشون میده

import * as ModalIcons from '~/components/ui/icons/modal'

interface IconData {
  type?: string;
  name?: string;
  [key: string]: unknown;
}

export const modalIconComponentsMap: Record<string, unknown> = {
  // Contact icons
  'telegram': ModalIcons.telegram,
  'email': ModalIcons.email,
  'phone': ModalIcons.number,
  'website': ModalIcons.website,
  'number': ModalIcons.number,
  'call': ModalIcons.call,
  'contactcard': ModalIcons.contactcard,
  'address': ModalIcons.address,
  'facetime': ModalIcons.facetime,
  'whatsapp': ModalIcons.whatsapp,
  'eitaa': ModalIcons.eitaa,
  'linkumap': ModalIcons.linkumap,
  'map': ModalIcons.map,
  
  // Social Media icons
  'instagram': ModalIcons.instagram,
  'facebook': ModalIcons.facebook,
  'tiktok': ModalIcons.tiktok,
  'twitter': ModalIcons.x,
  'x': ModalIcons.x,
  'linkedin': ModalIcons.linkedin,
  'youtube': ModalIcons.youtube,
  'aparat': ModalIcons.aparat,
  'discord': ModalIcons.discord,
  'snapchat': ModalIcons.snapchat,
  'pinterest': ModalIcons.pinterest,
  'threads': ModalIcons.threads,
  'twitch': ModalIcons.twitch,
  'clubhouse': ModalIcons.clubhouse,
  'bale': ModalIcons.bale,
  'rubika': ModalIcons.rubika,
  'igap': ModalIcons.igap,
  'medium': ModalIcons.medium,
  'virgool': ModalIcons.virgool,
  
  // Business icons
  'calendly': ModalIcons.calendly,
  'googlemeet': ModalIcons.googlemeet,
  'zoom': ModalIcons.zoom,
  'teams': ModalIcons.teams,
  'github': ModalIcons.github,
  'figma': ModalIcons.figma,
  'app_link': ModalIcons.app_link,
  'balad': ModalIcons.balad,
  'nshan': ModalIcons.nshan,
  'reviews': ModalIcons.reviews,
  'trustpilot': ModalIcons.trustpilot,
  'microsoft_bookings': ModalIcons.microsoft_bookings,
  'microsoft-bookings': ModalIcons.microsoft_bookings,
  'microsoftbookings': ModalIcons.microsoft_bookings,
  'workhours': ModalIcons.clock,
  'clock': ModalIcons.clock,
  'bankcard': ModalIcons.card,
  'card': ModalIcons.card,
  'divar': ModalIcons.divar,
  'snapp': ModalIcons.snapp,
  'booksy': ModalIcons.booksy,
  'etsy': ModalIcons.etsy,
  'yelp': ModalIcons.yelp,
  'zillow': ModalIcons.zillow,
  'square': ModalIcons.square,
  'chili': ModalIcons.chili,
  'chili_piper': ModalIcons.chili,
  'chili-piper': ModalIcons.chili,
  
  // Payment icons
  'zarinpal': ModalIcons.zarinpal,
  'paypal': ModalIcons.paypal,
  'cashapp': ModalIcons.cashapp,
  'remit': ModalIcons.remit,
  'raymit': ModalIcons.remit,
  'trustwallet': ModalIcons.trustwallet,
  'zelle': ModalIcons.zelle,
  'venmo': ModalIcons.paypal, // fallback
  
  // Content icons
  'customlink': ModalIcons.customlink,
  'basiclink': ModalIcons.basiclink,
  'embeddedvideo': ModalIcons.embeddedvideo,
  'featured': ModalIcons.featured,
  'featuredlink': ModalIcons.featuredlink,
  'file': ModalIcons.file,
  'poll': ModalIcons.poll,
  'questionbox': ModalIcons.questionbox,
  'textsection': ModalIcons.textsection,
  'expandabletext': ModalIcons.expandabletext,
  'dropdown': ModalIcons.dropdown,
  
  // Club icons
  'luckyegg': ModalIcons.luckyegg,
  'luckydice': ModalIcons.luckydice,
  'luckywheel': ModalIcons.luckywheel,
  'form': ModalIcons.form,
  'builder': ModalIcons.builder,
  
  // Music icons
  'spotify': ModalIcons.spotify,
  'soundcloud': ModalIcons.soundcloud,
  'apple_music': ModalIcons.apple_music,
  'applemusic': ModalIcons.apple_music,
  'youtube_music': ModalIcons.youtube_music,
  'youtubemusic': ModalIcons.youtube_music,
  'podcasts': ModalIcons.podcasts,
  'linktree': ModalIcons.linktree,
  'poshmark': ModalIcons.poshmark,
  'opensea': ModalIcons.opensea,
  'opensea_color': ModalIcons.opensea,
  'hoobe': ModalIcons.hoobe,
}

export function useModalIconComponents() {
  const getModalIconComponent = (iconData: IconData | null | undefined) => {
    if (!iconData) return null;
    
    if (iconData?.type === 'component' && iconData?.name) {
      const iconName = iconData.name.toLowerCase();
      const component = modalIconComponentsMap[iconName];
      return component || null;
    }
    return null;
  }

  return {
    modalIconComponentsMap,
    getModalIconComponent
  }
}