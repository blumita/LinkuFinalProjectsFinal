import {defineStore} from 'pinia'
import {nextTick} from 'vue'
import {safeStorage} from '~/utils/safeStorage'
import {useNuxtApp} from 'nuxt/app'

// Helper function برای تبدیل URL media در محیط توسعه
// در صفحات HTTPS، URLهای HTTP را به HTTPS proxy تبدیل می‌کند
const transformMediaUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('data:')) return url
    if (url.startsWith('/') && !url.startsWith('//')) return url
    if (url.startsWith('https://')) return url

    // در محیط کلاینت و صفحات HTTPS
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
        return url
            .replace('http://localhost:8000', 'https://localhost:8443')
            .replace('http://127.0.0.1:8000', 'https://localhost:8443')
    }

    return url
}

type LayoutType = 'right' | 'left' | 'center' | 'portrait'
type FieldType = 'text' | 'dropdown' | 'checkbox' | 'file'
type LinkAction = 'call' | 'sms' | 'email' | 'social' | 'custom'
type LinkType = 'social' | 'contact' | 'default' | 'payment'

export interface CardItem {
    id: string
    name: string
    avatar: string | null
    description?: string
    bio: string
    isDefault: boolean
    linksDataList?: LinkItem[]
    slug?: string
    userName?: string
    cardProfileId?: number
    pid?: number
    logo?: string
    location?: string
    company?: string
    cover?: string
    job?: string
    isActive?: boolean
    removeBranding:boolean
    leadCaptureMode: boolean
    isDefaultLead: boolean
    fields?: FormField[]
    formTitle?: string
    connectButtonText?: string
    leadCaptureForm?: ''
    saveContact?: string
    themeColor?: ColorOption
    iconColor?: ColorOption
    matchThemeColor?: boolean
    colorLink?: string
    layoutMode?: string
    qrLogo?: string
    qrSize?: number
    qrMargin?: number
    qrColor?: string
    qrBgColor?: string
    qrLogoSize?: number
    qrRadius?: number
    logoBackground: boolean,
}

export interface FormField {
    id: string
    label: string
    name:string
    type: FieldType
    required: boolean
    options?: string[]
    preset?: 'custom' | 'countries' | 'states'
}

export interface LinkItem {
    id: string | number
    title: string
    description: string
    value: string
    type: LinkType
    action?: LinkAction
    icon?: string | { path: string }
    customIcon?: string
    enabled: boolean
    baseUrl?: string
    username?: string
}

export interface ColorOption {
    background: string
    text: string
    border?: boolean
}

export const defaultFields: FormField[] = [
    {id: '1', label: 'نام کامل',name:'fullName', required: false, type: 'text'},
    {id: '2', label: 'ایمیل',name:'email', required: false, type: 'text'},
    {id: '3', label: 'شماره تماس',name:'phoneNumber', required: false, type: 'text'},
    {id: '4', label: 'عنوان شغلی',name:'jobTitle', required: false, type: 'text'},
    {id: '5', label: 'شرکت',name:'company', required: false, type: 'text'},
    {id: '6', label: 'یادداشت',name:'note', required: false, type: 'text'}
]

export const useFormStore = defineStore('form', {
    state: () => ({
        layout: 'right' as LayoutType,
        isListMode: true,
        themeColor: {
            background: 'transparent',
            text: '#000000'
        } as ColorOption,
        iconColor: {
            background: 'transparent',
            text: '#000000'
        } as ColorOption,
        matchThemeColor: false as boolean | false,
        name: '',
        cardName: '',
        location: '',
        job: '',
        company: '',
        bio: '',
        saveContact: '',
        profileImage: null as string | null,
        coverImage: null as string | null,
        logoImage: null as string | null,
        links: [] as LinkItem[],
        activeLinkIndex: 0,
        removeBranding:false,
        formTitle: '',
        connectButtonText: 'ارسال',
        formDisclaimer: 'اطلاعات شما محرمانه می‌ماند',
        isLeadCaptureEnabled: false,
        fields: [] as FormField[],
        leadCaptureForm: {
            name: '',
            email: '',
            message: ''
        },
        qrColor: '',
        qrBgColor: '',
        qrLogo: '',
        qrRadius: 0,
        qrLogoSize: 0,
        qrSize: 0,
        qrMargin: 0,
        logoBackground: false,
        formSaved: false,
        newCardId: null as Number | null,
        selectedCardId: null as string | null, // Add selectedCardId property
        cards: [] as CardItem[],
        inboxBadge:0 as Number | 0,
        textsection: {
            title: '',
            value: '',
            align: 'right',
            icon: '',
            customIcon: ''
        }
    }),

    getters: {
        activeLink(state): LinkItem {
            const index = Math.max(0, Math.min(state.activeLinkIndex || 0, state.links.length - 1))
            return state.links[index] || {
                id: '',
                title: 'لینک جدید',
                description: '',
                value: '',
                type: 'default' as LinkType,
                enabled: true
            }
        },
        layoutClass(state): string {
            return `layout-${state.layout}`
        },
        // Getters برای تصاویر با URL های transformed
        safeProfileImage(state): string | null {
            return transformMediaUrl(state.profileImage)
        },
        safeCoverImage(state): string | null {
            return transformMediaUrl(state.coverImage)
        },
        safeLogoImage(state): string | null {
            return transformMediaUrl(state.logoImage)
        },
        themeClass(state): string {
            return `theme-${(state.themeColor.background || '#ffffff').replace('#', '')}`
        },
        requiredFields(state): FormField[] {
            return state.fields.filter(f => f.required)
        },
        defaultCard(state): CardItem | null {
            return state.cards.find(c => c.isDefault) || null
        }
    },

    actions: {
        setListMode(val: boolean) {
            this.isListMode = val
        },
        setInboxBadge(val:number){
            this.inboxBadge=val

        },

        // کنترل leadcapture در links
        toggleLeadCapture(enabled: boolean) {
            this.isLeadCaptureEnabled = enabled

            // فقط فلگ leadcapture را تنظیم می‌کنیم - آیتم جداگانه اضافه نمی‌کنیم
            // leadcapture popup خودش مدیریت می‌شود


        },
        resetAbout() {
            this.name = ''
            this.job = ''
            this.company = ''
            this.location = ''
            this.bio = ''
            this.saveContact = ''
            this.profileImage = null
            this.coverImage = null
            this.logoImage = null
            this.iconColor = {background: 'transparent', text: '#000000'}
            this.themeColor = {background: 'transparent', text: '#000000'}
        },
        addLink(link: any) {
            this.links.push({id: `${Date.now()}_${Math.floor(Math.random() * 1e8)}`, ...link, enabled: true})
        },
        updateLink(id: any, updates: any) {
            const index = this.links.findIndex(l => l.id === id)
            if (index !== -1) this.links[index] = {...this.links[index], ...updates}
        },
        removeLink(id: any) {
            this.links = this.links.filter(l => l.id !== id)
            if (this.activeLinkIndex >= this.links.length) {
                this.activeLinkIndex = Math.max(0, this.links.length - 1)
            }
        },
        addField(field: any) {
            this.fields.push({id: Date.now().toString(), ...field})
        },
        updateField(id: any, updates: any) {
            const index = this.fields.findIndex(f => f.id === id)
            if (index !== -1) this.fields[index] = {...this.fields[index], ...updates}
        },
        resetFormFields() {
            this.fields = JSON.parse(JSON.stringify(defaultFields))
            this.formTitle = ''
            this.connectButtonText = 'ارسال'
            this.formDisclaimer = 'اطلاعات شما محرمانه می‌ماند'
            this.isLeadCaptureEnabled = false
            this.leadCaptureForm = {name: '', email: '', message: ''}
        },
        saveLeadCaptureForm() {
            safeStorage.setItem('leadCaptureForm', JSON.stringify(this.leadCaptureForm))
        },
        loadLeadCaptureForm() {
            const saved = safeStorage.getItem('leadCaptureForm')
            if (saved) this.leadCaptureForm = JSON.parse(saved)
        },
        addCard(card: any) {
            this.cards.push({id: Date.now().toString(), ...card})
            this.formSaved = true
            this.setNewCardId(Number(card.id))
        },
        setNewCardId(id: Number) {
            this.newCardId = id
        },
        updateCard(id: any, updates: any) {
            const index = this.cards.findIndex(c => c.id === id)
            if (index !== -1) this.cards[index] = {...this.cards[index], ...updates}
        },
        removeCard(id: any) {
            this.cards = this.cards.filter(c => c.id !== id)
        },
        async setDefaultCard(id: any) {
            this.cards = this.cards.map(c => ({...c, isDefault: String(c.id) === String(id)}))
            // ذخیره پروفایل فعال در localStorage (backup)
            safeStorage.setItem('activeProfileId', String(id))
            
            // ذخیره در دیتابیس
            try {
                const { $axios } = useNuxtApp()
                await $axios.post(`cards/setActive/${id}`)
            } catch (error) {
                console.error('Error saving active profile:', error)
            }
        },
        // بازیابی پروفایل فعال از سرور (بر اساس is_default در دیتابیس)
        restoreActiveProfile() {
            // پیدا کردن کارتی که is_default=true داره (از سرور آمده)
            const defaultCard = this.cards.find(c => c.isDefault === true)
            if (defaultCard) {
                this.setAboutFrom(defaultCard.id)
                safeStorage.setItem('activeProfileId', String(defaultCard.id))
                return
            }
            
            // اگر هیچ کارتی is_default نداشت، اولین کارت رو فعال کن
            const firstCard = this.cards[0]
            if (firstCard) {
                this.setDefaultCard(firstCard.id)
                this.setAboutFrom(firstCard.id)
            }
        },
        setAboutFrom(cardId: string) {
            // Set selectedCardId regardless of whether card is found
            this.selectedCardId = cardId

            const card = this.cards.find(c => Number(c.id) === Number(cardId))
            if (!card) {
                return
            }

            this.name = card.userName || ''
            this.cardName = card.name || '';
            this.job = card.job || '';
            this.company = card.company || '';
            this.location = card.location || '';
            this.bio = card.bio || '';
            // URL اصلی را ذخیره کن - getter ها هنگام نمایش transform می‌کنند
            this.profileImage = card.avatar || null;
            this.coverImage = card.cover || null;
            this.logoImage = card.logo || null;

            const themeColor = typeof card.themeColor === 'string'
                ? JSON.parse(card.themeColor)
                : card.themeColor

            const iconColor = typeof card.iconColor === 'string'
                ? JSON.parse(card.iconColor)
                : card.iconColor

            this.themeColor = {
                background: themeColor?.background || 'transparent',
                text: themeColor?.text || '#000000'
            }

            this.iconColor = {
                background: iconColor?.background || 'transparent',
                text: iconColor?.text || '#000000'
            };

            this.matchThemeColor = card.matchThemeColor || false;
            this.saveContact = card.saveContact || '';
            this.layout = (card.layoutMode as LayoutType) || 'right';
            this.formTitle = card.formTitle || '';
            this.connectButtonText = card.connectButtonText || 'ارسال';
            this.isLeadCaptureEnabled = !!card.leadCaptureMode;

            this.removeBranding=card.removeBranding||false;



            ///Set links
            this.links = card.linksDataList
                ? card.linksDataList.map(link => this.normalizeLink(link))
                : [];

            //Set fields lead capture - اگر خالی باشه فیلدهای پیش‌فرض رو بذار
            const defaultLeadFields = [
                {id: '1', type: 'text', label: 'نام', name: 'fullName', required: true},
                {id: '2', type: 'text', label: 'ایمیل', name: 'email', required: true},
                {id: '3', type: 'text', label: 'شماره تماس', name: 'phoneNumber', required: false}
            ];
            this.fields = (card.fields && card.fields.length > 0) ? card.fields : defaultLeadFields;

            // Set lead form defaults if not exists
            this.formTitle = card.formTitle || 'فرم تماس';
            this.connectButtonText = card.submitButtonText || card.connectButtonText || 'ارسال';
            this.formDisclaimer = card.formDisclaimer || 'اطلاعات شما محرمانه می‌ماند';

            //Qr setting
            this.qrColor = card.qrColor ?? '#000000';
            this.qrBgColor = card.qrBgColor ?? '#ffffff';
            this.qrLogoSize = card.qrLogoSize ?? 15;
            this.qrLogo = card.qrLogo ?? '/logo/logo.png';
            this.qrRadius = card.qrRadius ?? 10;
            this.qrSize = card.qrSize ?? 200;
            this.qrMargin = card.qrMargin ?? 10;
            this.logoBackground = card.logoBackground ?? false;
        },
        normalizeLink(link: any) {
            // لیست توضیحات پیش‌فرضی که باید حذف شوند
            const defaultDescriptions = [
                'برقراری تماس با شماره دلخواه',
                'ارسال ایمیل با آدرس دلخواه', 
                'افزودن نقشه تعاملی با مختصات جغرافیایی',
                'ارسال پیام به شماره مورد نظر',
                'مشاهده پروفایل در اینستاگرام',
                'ارتباط از طریق تلگرام',
                'چت در واتساپ',
                'مشاهده وبسایت',
                'description', // پیش‌فرض خالی
                '', // خالی
                ' ' // فقط اسپیس
            ]
            
            // بررسی آیا description معتبر است یا نه
            let validDescription = ''
            if (link.description && 
                typeof link.description === 'string' && 
                link.description.trim() && 
                !defaultDescriptions.includes(link.description.trim()) &&
                link.description.trim().length > 0) {
                validDescription = link.description.trim()
            }
            
            const normalizedLink = {
                ...link,
                icon: link.icon ? this.safeJsonParse(link.icon) : null,
                placeholder: link.placeholder ? this.safeJsonParse(link.placeholder) : null,
                showDescription: link.showDescription || false
            }
            
            // فقط در صورت وجود description معتبر آن را اضافه کن
            if (validDescription) {
                normalizedLink.description = validDescription
            } else {
                // حذف کامل فیلد description اگر معتبر نیست
                delete normalizedLink.description
            }

            return normalizedLink
        },
        safeJsonParse(str: any) {
            try {
                return typeof str === "string" ? JSON.parse(str) : str
            } catch {
                return str
            }
        },

        setTextSectionField(key: keyof typeof this.textsection, value: any) {
            this.textsection[key] = value
        },
        resetTextSection() {
            this.textsection = {title: '', value: '', align: 'right', icon: '', customIcon: ''}
        },

        // Icon color management
        setIconColor(color: ColorOption) {
            this.iconColor = {...color}
        },

        resetIconColor() {
            this.iconColor = {background: 'transparent', text: '#000000'}
        }
    }
})