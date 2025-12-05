// types/data.ts

export type IconType =
  | string
  | { type?: string; path?: string; url?: string };

export interface Icon {
  type?: string;
  path?: string;
  name?: string;
  url?: string;
}

export type Placeholder = {
  title?: string;
  link?: string;
  value?: string;
};

// Helper type for all possible keys used for display and key extraction in UI
export type ItemKeyFields = {
  id?: string;
  name?: string;
  title?: string;
  cardNumber?: string;
  bankName?: string;
  accountNumber?: string;
  type?: string; // اضافه شد برای پشتیبانی از type در همه آیتم‌ها
  action?: string; // اضافه شد برای پشتیبانی از action در همه آیتم‌ها
};

export interface LinkItem {
  id?: string | number;
  title?: string;
  value?: string;
  customIcon?: string | null;
  icon?: IconType | null;
  baseUrl?: string;
  action?: string;
  placeholder?: Placeholder;
  showDescription?: boolean;
  description?: string;
  username?: string;
  text?: string;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  cardNumber?: string;
  bankName?: string;
  accountNumber?: string;
  name?: string;
  access?: string;
  displayName?: string | null;
  highlight?: boolean;
  days?: Array<any>;
  mode?: 'selected' | 'always' | 'appointment';
}

// Add name to all Block types for UI consistency
export interface PollBlock extends ItemKeyFields {
  id: string;
  action: 'poll';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  options: string[];
  icon?: Icon;
  displayName?: string | null;
  value?: string;
}

export interface QuestionBoxBlock extends ItemKeyFields {
  id: string;
  action: 'questionbox';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  avatar?: string;
  icon?: Icon;
  displayName?: string | null;
  value?: string;
}

export interface EmbeddedVideoBlock extends ItemKeyFields {
  id: string;
  action: 'embeddedvideo';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  poster?: string;
  autoplay?: boolean;
  icon?: Icon;
  displayName?: string | null;
}

export interface ExpandableTextBlock extends ItemKeyFields {
  id: string;
  action: 'expandabletext';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: IconType | null;
  customIcon?: string | null;
  placeholder?: Placeholder;
  showDescription?: boolean;
  description?: string;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
  displayName?: string | null;
}

export interface FileBlock extends ItemKeyFields {
  id: string;
  action: 'file';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface LuckyBlock extends ItemKeyFields {
  id: string;
  action: 'lucky';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  description?: string;
  segments: string[];
  icon?: Icon;
  displayName?: string | null;
}

export interface ImageBlock extends ItemKeyFields {
  id: string;
  action: 'image';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  url: string;
  altText?: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface TextBlock extends ItemKeyFields {
  id: string;
  action: 'text';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  content: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface WorkHoursBlock extends ItemKeyFields {
  id: string;
  action: 'workhours';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  mode: 'selected' | 'always' | 'appointment';
  days: Array<{
    name: string;
    enabled: boolean;
    type: 'hours' | '24h' | 'appointment' | 'closed';
    start?: string;
    end?: string;
  }>;
  icon?: Icon;
  displayName?: string | null;
}

export interface LuckyDiceBlock extends ItemKeyFields {
  id: string;
  action: 'luckydice';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface LuckyEggBlock extends ItemKeyFields {
  id: string;
  action: 'luckyegg';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface LuckyWheelBlock extends ItemKeyFields {
  id: string;
  action: 'luckywheel';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface BuilderBlock extends ItemKeyFields {
  id: string;
  action: 'builder';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  fields: any[];
  submitButtonText?: string;
  thankYouMessage?: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface ContactCardBlock extends ItemKeyFields {
  id: string;
  action: 'contactcard';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  role?: string;
  icon?: Icon;
  displayName?: string | null;
}

export interface TextSectionBlock extends ItemKeyFields {
  id: string;
  action: 'textsection';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  value: string;
  icon?: Icon | string;
  customIcon?: string | null;
  displayName?: string | null;
  align?: 'right' | 'center' | 'left';
  placeholder?: Placeholder;
}

export interface BankCardBlock extends ItemKeyFields {
  cardNumber: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ibanNumber?: string;
  icon?: Icon;
  customIcon?: string | null;
  description?: string;
  access?: string;
  value?: string;
  type: 'block';
}

export interface BankCardBlockGroup extends ItemKeyFields {
  id: string;
  action: 'bankcard';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  cards: BankCardBlock[];
  icon?: Icon;
  customIcon?: string | null;
  description?: string;
  displayName?: string | null;
}

export interface MapBlock extends ItemKeyFields {
  id: string;
  action: 'map';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
  showDescription?: boolean;
  zoom?: number;
  icon?: Icon | string;
  customIcon?: string | null;
  displayName?: string | null;
  placeholder?: Placeholder;
}

export interface DiscountBlock extends ItemKeyFields {
  id: string;
  action: 'discount';
  type: 'block';
  title: string;
  name: string;
  access?: 'free' | 'pro';
  description?: string;
  code?: string;
  value?: number;
  discountType?: 'percentage' | 'fixed';
  status?: 'active' | 'expired' | 'used';
  image?: string;
  banner?: string;
  expiryDate?: string;
  minAmount?: number;
  icon?: Icon | string;
  customIcon?: string | null;
  displayName?: string | null;
  placeholder?: Placeholder;
}

export type BlockItem =
  | PollBlock
  | QuestionBoxBlock
  | EmbeddedVideoBlock
  | ExpandableTextBlock
  | FileBlock
  | LuckyBlock
  | ImageBlock
  | TextBlock
  | WorkHoursBlock
  | LuckyDiceBlock
  | LuckyEggBlock
  | LuckyWheelBlock
  | BuilderBlock
  | ContactCardBlock
  | TextSectionBlock
  | BankCardBlock
  | BankCardBlockGroup
  | MapBlock
  | DiscountBlock;

// ترکیب LinkItem و BlockItem برای پشتیبانی از هر دو نوع در UI
export type AnyItem = LinkItem | BlockItem;

export interface ContactCardForm {
  title: string;
  description: string;
  customIcon: string | null;
  icon?: Icon | string;
  isSubmitting?: boolean;
  highlight: boolean;
}
