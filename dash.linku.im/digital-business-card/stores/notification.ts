// stores/notification.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {navigateTo} from "nuxt/app";
import type {AxiosInstance} from "axios";
import {useNuxtApp} from "nuxt/app";
import type {NotificationApiResponse} from "~/types/notification";
import type { Notification } from '~/types/notification'

const getActionsByType = (type:string, rawType:string) => {
    if (type === 'subscription' && rawType === 'renewal_reminder') {
        return [
            { label: 'تمدید اشتراک', type: 'primary', action: () => navigateTo('/dashboard/upgrade') },
            { label: 'بعداً یادآوری کن', type: 'secondary', action: () => {} }
        ]
    }

    if (type === 'subscription' && rawType === 'subscription_expired') {
        return [
            { label: 'تمدید فوری', type: 'primary', action: () => navigateTo('/dashboard/upgrade') }
        ]
    }

    if (type === 'subscription' && rawType === 'welcome') {
        return [
            { label: 'ایجاد پروفایل', type: 'primary', action: () => navigateTo('/dashboard/add-card') }
        ]
    }

    if (type === 'payment' && rawType === 'payment_warning'||rawType === 'purchase_success') {
        return [
            { label: 'تمدید فوری', type: 'primary', action: () => navigateTo('/dashboard/upgrade') }
        ]
    }

    if (type === 'security' && rawType === 'new_login') {
        return [
            { label: 'این من بودم', type: 'secondary', action: () => {} },
            { label: 'امنیت حساب', type: 'primary', action: () => navigateTo('/dashboard/settings') }
        ]
    }

    if (type === 'general' && rawType === 'login') {
        return [
            { label: 'مشاهده جزئیات', type: 'secondary', action: () => navigateTo('/dashboard/settings') }
        ]
    }

    return []
}
export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])
    const activeFilter = ref('all')
    const loading = ref(false)
    const pollingInterval = ref<NodeJS.Timeout | null>(null)
    const lastFetchTime = ref<number>(0)
    const {$axios} = useNuxtApp()
    const axios = $axios as AxiosInstance

    const fetchNotifications = async (silent = false) => {
        // اگه silent باشه، loading نشون نمیدیم (برای polling)
        if (!silent) {
            loading.value = true
        }
        
        try {
            // محدود کردن به 100 نوتیفیکیشن اخیر
            const { data } = await axios.get('user/notifications', {
                params: {
                    per_page: 100,
                    page: 1
                }
            })
            
            if (!data || !data.notifications || !Array.isArray(data.notifications)) {
                notifications.value = []
                return
            }
            
            const newNotifications = data.notifications.map((n: NotificationApiResponse) => ({
                id: n.id,
                type: n.type || 'general',
                rawType: n.raw_type || 'unknown',
                title: n.title || 'اطلاعیه',
                description: n.message || '',
                createdAt: n.created_at ? new Date(n.created_at) : new Date(),
                read: !!n.read_at,
                is_pinned: n.is_pinned || false,
                imageUrl: n.image_url,
                iconUrl: n.icon_url,
                backgroundColor: n.background_color,
                actions: getActionsByType(n.type || 'general', n.raw_type || 'unknown')
            }))
            
            // بررسی اینکه آیا notification جدید اومده
            const hasNewNotification = newNotifications.length > notifications.value.length ||
                newNotifications.some((n: Notification) => 
                    !notifications.value.find((old: Notification) => old.id === n.id)
                )
            
            notifications.value = newNotifications
            lastFetchTime.value = Date.now()
            
            // اگه notification جدید اومده، صدای notification رو پخش کن
            if (hasNewNotification && process.client && lastFetchTime.value > 0) {
                // می‌تونی اینجا یه toast notification نشون بدی
                playNotificationSound()
            }
            
        } catch (e: any) {
            console.error('Error fetching notifications:', e)
            notifications.value = []
        } finally {
            if (!silent) {
                loading.value = false
            }
        }
    }
    
    // پخش صدای notification (اختیاری)
    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification-sound.mp3')
            audio.volume = 0.3
            audio.play().catch(() => {
                // Ignore autoplay errors
            })
        } catch (error) {
            // Ignore sound errors
        }
    }
    
    // شروع polling
    const startPolling = (intervalMs = 15000) => {
        if (pollingInterval.value) {
            return // قبلا شروع شده
        }
        
        pollingInterval.value = setInterval(() => {
            fetchNotifications(true) // silent fetch
        }, intervalMs)
    }
    
    // توقف polling
    const stopPolling = () => {
        if (pollingInterval.value) {
            clearInterval(pollingInterval.value)
            pollingInterval.value = null
        }
    }

    const filteredNotifications = computed(() => {
        let filtered = activeFilter.value === 'all' 
            ? notifications.value 
            : notifications.value.filter((n:any) => n.type === activeFilter.value)
        
        // مرتب‌سازی: ابتدا پین‌شده‌ها، سپس بقیه
        return filtered.sort((a: Notification, b: Notification) => {
            // اول pinned ها
            if (a.is_pinned && !b.is_pinned) return -1
            if (!a.is_pinned && b.is_pinned) return 1
            
            // بعد براساس تاریخ (جدیدترین اول)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    })


    const markAsRead = async (id:any) => {
        const notif = notifications.value.find((n: Notification) => n.id === id)
        if (notif && !notif.read) {
            // optimistic update
            notif.read = true

            try {
                await axios.post(`user/notifications/${id}/read`)
            } catch (error) {
                // اگه خطا داد برمی‌گردونیم به حالت قبلی
                notif.read = false
            }
        }
    }


    const markAllAsRead = async () => {
        notifications.value.forEach(n => (n.read = true))
        await axios.post(`user/notifications/readAll`)
    }
    
    // تعداد notification های خوانده نشده
    const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.read).length
    })

    return {
        notifications,
        filteredNotifications,
        activeFilter,
        loading,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        startPolling,
        stopPolling
    }
})