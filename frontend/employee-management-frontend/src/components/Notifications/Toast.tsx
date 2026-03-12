import type { Notification } from "../../types/notification";
import { useEffect } from "react";

interface ToastProps {
    notification: Notification;
    onClose: () => void;
}

export const Toast = ({ notification, onClose }: ToastProps) => {
    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(onClose, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    const getBackgroundColor = () => {
        switch (notification.type) {
            case "success":
                return "#d4edda";
            case "error":
                return "#f8d7da";
            case "warning":
                return "#fff3cd";
            case "info":
                return "#d1ecf1";
            default:
                return "#e2e3e5";
        }
    };

    const getBorderColor = () => {
        switch (notification.type) {
            case "success":
                return "#c3e6cb";
            case "error":
                return "#f5c6cb";
            case "warning":
                return "#ffeaa7";
            case "info":
                return "#bee5eb";
            default:
                return "#d3d3d3";
        }
    };

    const getTextColor = () => {
        switch (notification.type) {
            case "success":
                return "#155724";
            case "error":
                return "#721c24";
            case "warning":
                return "#856404";
            case "info":
                return "#0c5460";
            default:
                return "#383d41";
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
            default:
                return "📢";
        }
    };

    return (
        <div
            style={{
                backgroundColor: getBackgroundColor(),
                borderLeft: `4px solid ${getBorderColor()}`,
                color: getTextColor(),
                padding: "16px",
                borderRadius: "6px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                animation: "slideIn 0.3s ease-out",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
            }}
        >
            <div style={{ flex: 1 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                >
                    <span>{getIcon()}</span>
                    <span>{notification.title}</span>
                </div>
                {notification.message && (
                    <div style={{ fontSize: "13px", opacity: 0.9 }}>
                        {notification.message}
                    </div>
                )}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0",
                    color: getTextColor(),
                    opacity: 0.7,
                }}
            >
                ✕
            </button>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};