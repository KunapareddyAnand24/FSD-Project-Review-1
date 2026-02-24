import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    if (!user) return null;

    return (
        <>
            <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
                <FiMenu />
            </button>

            {isOpen && (
                <>
                    <div className="mobile-overlay" onClick={() => setIsOpen(false)}></div>
                    <div className="mobile-sidebar">
                        <div className="mobile-sidebar-header">
                            <span className="mobile-sidebar-title">Menu</span>
                            <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div onClick={() => setIsOpen(false)}>
                            <Sidebar />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
