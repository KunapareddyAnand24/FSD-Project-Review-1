import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    FiHome,
    FiUsers,
    FiDatabase,
    FiBriefcase,
    FiFileText,
    FiUser,
    FiPlusCircle,
    FiList,
    FiCheckSquare,
    FiBarChart2,
    FiClipboard,
    FiMessageCircle,
    FiCalendar,
} from "react-icons/fi";

const sidebarLinks = {
    admin: [
        { to: "/admin", icon: <FiHome />, label: "Dashboard" },
        { to: "/admin/users", icon: <FiUsers />, label: "Manage Users" },
        { to: "/admin/placements", icon: <FiDatabase />, label: "Placement Data" },
        { to: "/admin/profile", icon: <FiUser />, label: "Admin Profile" },
    ],
    student: [
        { to: "/student", icon: <FiHome />, label: "Dashboard" },
        { to: "/student/jobs", icon: <FiBriefcase />, label: "Explore Jobs" },
        { to: "/student/applications", icon: <FiFileText />, label: "My Applications" },
        { to: "/student/calendar", icon: <FiCalendar />, label: "Calendar" },
        { to: "/student/messages", icon: <FiMessageCircle />, label: "Messages" },
        { to: "/student/profile", icon: <FiUser />, label: "My Profile" },
    ],
    employer: [
        { to: "/employer", icon: <FiHome />, label: "Dashboard" },
        { to: "/employer/post-job", icon: <FiPlusCircle />, label: "Post Job" },
        { to: "/employer/listings", icon: <FiList />, label: "My Listings" },
        { to: "/employer/applications", icon: <FiCheckSquare />, label: "Applications" },
        { to: "/employer/messages", icon: <FiMessageCircle />, label: "Messages" },
    ],
    officer: [
        { to: "/officer", icon: <FiHome />, label: "Dashboard" },
        { to: "/officer/records", icon: <FiClipboard />, label: "Placement Records" },
        { to: "/officer/reports", icon: <FiBarChart2 />, label: "Reports" },
    ],
};

export default function Sidebar() {
    const { user } = useAuth();

    if (!user) return null;

    const links = sidebarLinks[user.role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-role">{user.role.toUpperCase()} PANEL</span>
            </div>
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === `/${user.role}`}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">{link.icon}</span>
                        <span className="sidebar-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
