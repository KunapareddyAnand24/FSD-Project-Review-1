import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiLogOut, FiBriefcase } from "react-icons/fi";
import NotificationBell from "./NotificationBell";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const roleLabels = {
        admin: "Administrator",
        student: "Student",
        employer: "Employer",
        officer: "Placement Officer",
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {user && <MobileMenu />}
                <Link to="/" className="navbar-brand">
                    <FiBriefcase className="brand-icon" />
                    <span>SKILLSHALA</span>
                </Link>
            </div>

            {user && (
                <div className="navbar-user">
                    <NotificationBell />
                    <div className="user-info">
                        <div className="user-avatar">{user.avatar}</div>
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{roleLabels[user.role]}</span>
                        </div>
                    </div>
                    <button className="btn-logout" onClick={handleLogout} title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            )}
        </nav>
    );
}
