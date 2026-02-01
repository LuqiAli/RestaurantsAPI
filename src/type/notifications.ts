export enum NotificationType {
    INFORMATIONAL = "informational",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error"
}

export interface NotificationsInterface {
    id: string
    user_id: string
    type: NotificationType
    description: string
    link: string
    is_read: boolean
    created_at: string
    updated_at: string
}

export interface NotificationsInterfaceBody {
    user_id: string
    type: NotificationType
    description: string
    link: string
    is_read: boolean
}