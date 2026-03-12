import { useContext } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { Toast } from "./Toast";

export const ToastContainer = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        return null;
    }

    const { notifications, removeNotification } = context;

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "400px",
            }}
        >
            {notifications.map((notification) => (
                <Toast
                    key={notification.id}
                    notification={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};