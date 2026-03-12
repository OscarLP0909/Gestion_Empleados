import React, { createContext, useState, useCallback } from "react";
import type { Notification, NotificationType } from "../types/notification";

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (
        type: NotificationType,
        title: string,
        message: string,
        duration?: number
    ) => void;
    removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (
            type: NotificationType,
            title: string,
            message: string,
            duration: number = 4000
        ) => {
            const id = Math.random().toString(36).substr(2, 9);
            const notification: Notification = {
                id,
                type,
                title,
                message,
                duration,
                createdAt: new Date(),
            };

            setNotifications((prev) => [...prev, notification]);

            // Auto-dismiss si tiene duración
            if (duration > 0) {
                setTimeout(() => {
                    setNotifications((prev) =>
                        prev.filter((notif) => notif.id !== id)
                    );
                }, duration);
            }
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
