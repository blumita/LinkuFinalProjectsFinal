// types/notification.ts
export interface NotificationApiResponse {
    id: number
    type: 'subscription' | 'payment' | 'system' | 'security' | 'general'
    raw_type: string
    title: string
    message: string
    time:string
    isRead:boolean
    created_at: string
    read_at: string | null
}

export interface Notification {
    id: number
    type: 'profile' | 'violation' | 'system'
    title: string
    description: string
    time: string
    isRead: boolean
    date: string
    details: string
}
