export interface NotificationResponseDTO {
    id: string;
    userId: string;
    message: string;
    title: string;
    type: NotificationType;
    status: 'UNREAD' | 'READ';
    createdAt: string;
    updatedAt: string;
}

export interface NotificationState {
    notifications: NotificationResponseDTO[];
    isLoading: boolean;
    error: string | null;
}
export interface NotificationType {
    LEAVE_REQUEST_CREATED: string;
    LEAVE_REQUEST_APPROVED: string;
    LEAVE_REQUEST_REJECTED: string;
    LEAVE_REQUEST_CANCELLED: string;
    LEAVE_BALANCE_UPDATED: string;
    LEAVE_REQUEST_UPDATE: string;
    SYSTEM_NOTIFICATION: string;
    CALENDAR_UPDATE: string;
}

