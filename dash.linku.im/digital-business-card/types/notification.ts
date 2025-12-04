// types/notification.ts
export interface NotificationApiResponse {
    id: number
    type: 'subscription' | 'payment' | 'system' | 'security' | 'general'
    raw_type: string
    title: string
    message: string
    created_at: string
    read_at: string | null
    is_pinned?: boolean
    image_url?: string
    icon_url?: string
    background_color?: string
    action_link?: string
}

export interface Notification {
    id: number
    type: string
    rawType: string
    title: string
    description: string
    createdAt: Date
    read: boolean
    is_pinned?: boolean
    imageUrl?: string
    iconUrl?: string
    backgroundColor?: string
    actionLink?: string
    actions: {
        label: string
        type: 'primary' | 'secondary'
        action: () => void
    }[]
}