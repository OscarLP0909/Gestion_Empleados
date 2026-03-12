export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number; // en ms, undefined = no auto-dismiss
    createdAt: Date;
}