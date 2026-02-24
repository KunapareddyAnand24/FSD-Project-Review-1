import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { FiBell, FiCheck, FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

export default function NotificationBell() {
    const { user } = useAuth();
    const { getUnreadCount, getNotificationsForRole, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);

    if (!user) return null;

    const unreadCount = getUnreadCount(user.role, user.id);
    const notifications = getNotificationsForRole(user.role, user.id);

    const typeIcons = {
        success: <FiCheckCircle className="notif-icon-success" />,
        warning: <FiAlertCircle className="notif-icon-warning" />,
        info: <FiInfo className="notif-icon-info" />,
    };

    return (
        <div className="notification-bell-wrapper">
            <button className="btn-notification" onClick={() => setOpen(!open)} title="Notifications">
                <FiBell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {open && (
                <>
                    <div className="notif-overlay" onClick={() => setOpen(false)}></div>
                    <div className="notif-dropdown">
                        <div className="notif-dropdown-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button className="notif-mark-all" onClick={() => markAllAsRead(user.role, user.id)}>
                                    <FiCheck /> Mark all read
                                </button>
                            )}
                        </div>
                        <div className="notif-dropdown-list">
                            {notifications.length === 0 ? (
                                <div className="notif-empty">No notifications</div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notif-item ${!n.read ? "unread" : ""}`}
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        <div className="notif-item-icon">{typeIcons[n.type] || typeIcons.info}</div>
                                        <div className="notif-item-content">
                                            <strong>{n.title}</strong>
                                            <p>{n.message}</p>
                                            <span className="notif-time">{n.time}</span>
                                        </div>
                                        {!n.read && <div className="notif-unread-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export function ToastContainer() {
    const { user } = useAuth();
    const { toasts, dismissToast } = useNotifications();

    if (!user || toasts.length === 0) return null;

    const visibleToasts = toasts.filter((t) => (!t.role || t.role === user.role) && (!t.userId || t.userId === user.id));

    if (visibleToasts.length === 0) return null;

    const typeColors = {
        success: "#10b981",
        warning: "#f59e0b",
        info: "#3b82f6",
    };

    return (
        <div className="toast-container">
            {visibleToasts.map((toast) => (
                <div
                    key={toast.toastId}
                    className="toast-item"
                    style={{ borderLeftColor: typeColors[toast.type] || typeColors.info }}
                >
                    <div className="toast-content">
                        <strong>{toast.title}</strong>
                        <p>{toast.message}</p>
                    </div>
                    <button className="toast-close" onClick={() => dismissToast(toast.toastId)}>
                        <FiX />
                    </button>
                </div>
            ))}
        </div>
    );
}
