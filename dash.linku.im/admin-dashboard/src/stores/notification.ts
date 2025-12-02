// stores/notification.js
import { defineStore } from 'pinia'
import {ref, computed, getCurrentInstance} from 'vue'
import type {AxiosInstance} from "axios";
import type {NotificationApiResponse} from "@/types/notification";
import type { Notification } from '@/types/notification'

const getActionsByType = (type:string, rawType:string) => {
    if (type === 'subscription' && rawType === 'renewal_reminder') {
        return [
            { label: 'تمدید اشتراک', type: 'primary', action:'' },
            { label: 'بعداً یادآوری کن', type: 'secondary', action: () => {} }
        ]
    }

    if (type === 'subscription' && rawType === 'subscription_expired') {
        return [
            { label: 'تمدید فوری', type: 'primary', action: '' }
        ]
    }

    if (type === 'subscription' && rawType === 'welcome') {
        return [
            { label: 'ایجاد پروفایل', type: 'primary', action: '' }
        ]
    }

    if (type === 'payment' && rawType === 'payment_warning'||rawType === 'purchase_success') {
        return [
            { label: 'تمدید فوری', type: 'primary', action: '' }
        ]
    }

    if (type === 'security' && rawType === 'new_login') {
        return [
            { label: 'این من بودم', type: 'secondary', action: () => {} },
            { label: 'امنیت حساب', type: 'primary', action: '' }
        ]
    }

    if (type === 'general' && rawType === 'login') {
        return [
            { label: 'مشاهده جزئیات', type: 'secondary', action: '' }
        ]
    }

    return []
}
export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])
    const activeFilter = ref('all')
    const loading = ref(false)
    const error = ref<string | null>(null)
    const { appContext } = getCurrentInstance()!
    const axios = appContext.config.globalProperties.$axios as AxiosInstance

    const fetchNotifications = async () => {

        loading.value = true
        try {
            const { data } = await axios.get('user/admin/notifications')
            notifications.value = data.notifications.map((n: NotificationApiResponse) => ({
                id: n.id,
                type: n.type,
                rawType: n.raw_type,
                title: n.title,
                description: n.message,
                time:n.time,
                createdAt: new Date(n.created_at),
                isRead: !!n.read_at,
                actions: getActionsByType(n.type, n.raw_type)
            }))
        } catch (e) {
            console.error('Error fetching notifications:', e)
        } finally {
            loading.value = false
        }
    }

    const filteredNotifications = computed(() => {
        if (activeFilter.value === 'all') {
            return notifications.value
        }
        return notifications.value.filter((n:any) => n.type === activeFilter.value)
    })


    const markAsRead = async (id:any) => {
        const notif = notifications.value.find((n: Notification) => n.id === id)
        if (notif && !notif.isRead) {
            // optimistic update
            notif.isRead = true

            try {
                await axios.post(`user/notifications/${id}/read`)
            } catch (error) {
                // اگه خطا داد برمی‌گردونیم به حالت قبلی
                notif.isRead = false
                console.error('خطا در خواندن نوتیفیکیشن:', error)
            }
        }
    }


    const markAllAsRead = async () => {
        notifications.value.forEach((n:any) => (n.isRead = true))
        await axios.post(`user/notifications/readAll`)
    }

    return {
        notifications,
        filteredNotifications,
        activeFilter,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    }
})
