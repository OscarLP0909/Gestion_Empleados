import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import type { NotificationType } from "../types/notification";

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotification debe ser usado dentro de NotificationProvider"
        );
    }

    return {
        success: (title: string, message: string, duration?: number) =>
            context.addNotification("success", title, message, duration),
        error: (title: string, message: string, duration?: number) =>
            context.addNotification("error", title, message, duration),
        warning: (title: string, message: string, duration?: number) =>
            context.addNotification("warning", title, message, duration),
        info: (title: string, message: string, duration?: number) =>
            context.addNotification("info", title, message, duration),
    };
};