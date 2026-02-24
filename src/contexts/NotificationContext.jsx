import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

const initialNotifications = [];

export function NotificationProvider({ children }) {
    const { user } = useAuth(); // Needed to prevent sending local toasts if not intended for current user

    // Initialize notifications from localStorage, fallback to initial
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("skillshala_notifications_clear");
        return saved ? JSON.parse(saved) : initialNotifications;
    });

    const [toasts, setToasts] = useState([]);

    // Persist notifications on change
    useEffect(() => {
        localStorage.setItem("skillshala_notifications_clear", JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((notification) => {
        const newNotif = {
            id: Date.now(),
            time: "Just now",
            read: false,
            ...notification,
        };
        setNotifications((prev) => [newNotif, ...prev]);

        // Only show toast if it's for the currently logged in role AND user
        // (Handled by the Toast component itself, but we can emit it globally)
        const toastId = Date.now();
        setToasts((prev) => [...prev, { ...newNotif, toastId }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
        }, 4000);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback((role, userId) => {
        setNotifications((prev) =>
            prev.map((n) => (n.role === role && (!n.userId || n.userId === userId) ? { ...n, read: true } : n))
        );
    }, []);

    const getUnreadCount = useCallback(
        (role, userId) => {
            return notifications.filter(
                (n) => !n.read && n.role === role && (!n.userId || n.userId === userId)
            ).length;
        },
        [notifications]
    );

    const getNotificationsForRole = useCallback(
        (role, userId) => {
            return notifications.filter((n) => n.role === role && (!n.userId || n.userId === userId));
        },
        [notifications]
    );

    const dismissToast = useCallback((toastId) => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                toasts,
                addNotification,
                markAsRead,
                markAllAsRead,
                getUnreadCount,
                getNotificationsForRole,
                dismissToast,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}


