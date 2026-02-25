import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // 1. Initialize persistent user list from localStorage, fallback to mockData
    const [localUsers, setLocalUsers] = useState(() => {
        const savedUsers = localStorage.getItem("placementUsersList_v3");
        let parsed = savedUsers ? JSON.parse(savedUsers) : mockUsers;

        // Auto-heal missing demo credentials
        const hasDemo = parsed.some(u => u.email === "demo@student.com");
        if (!hasDemo) {
            const missingMocks = mockUsers.filter(mu => !parsed.some(lu => lu.email === mu.email));
            if (missingMocks.length > 0) {
                parsed = [...parsed, ...missingMocks];
                localStorage.setItem("placementUsersList_v3", JSON.stringify(parsed));
            }
        }
        return parsed;
    });

    // Save the initial mock list if it didn't exist vertically yet
    useEffect(() => {
        if (!localStorage.getItem("placementUsersList_v3")) {
            localStorage.setItem("placementUsersList_v3", JSON.stringify(localUsers));
        }
    }, [localUsers]);

    // 2. Track currently logged-in user
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("placementUser_v3");
        return saved ? JSON.parse(saved) : null;
    });

    const login = (email, password) => {
        const inputEmail = email.trim().toLowerCase();

        // Authenticate against the persistent user list instead of static mockData
        const found = localUsers.find(
            (u) => (u.email || "").toLowerCase().trim() === inputEmail && u.password === password.trim()
        );

        if (found) {
            const userData = { ...found };
            delete userData.password;
            setUser(userData);
            localStorage.setItem("placementUser_v3", JSON.stringify(userData));
            return { success: true, user: userData };
        }
        return { success: false, message: "Invalid email or password" };
    };

    const editUserRole = (userId, newRole) => {
        const updatedUsersList = localUsers.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
        );
        setLocalUsers(updatedUsersList);
        localStorage.setItem("placementUsersList_v3", JSON.stringify(updatedUsersList));

        // If editing self, update active session
        if (user && user.id === userId) {
            const updated = { ...user, role: newRole };
            setUser(updated);
            localStorage.setItem("placementUser_v3", JSON.stringify(updated));
        }
        return { success: true };
    };

    const deleteUser = (userId) => {
        const updatedUsersList = localUsers.filter((u) => u.id !== userId);
        setLocalUsers(updatedUsersList);
        localStorage.setItem("placementUsersList_v3", JSON.stringify(updatedUsersList));
        return { success: true };
    };

    const register = (name, email, password, role, extra = {}) => {
        const normalizedEmail = email.trim().toLowerCase();
        const exists = localUsers.find((u) => u.email.toLowerCase().trim() === normalizedEmail);
        if (exists) {
            return { success: false, message: "Email already registered" };
        }

        const newUser = {
            id: Date.now(), // Unique ID dynamically generated
            name,
            email: normalizedEmail,
            password,
            role,
            avatar: name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase(),
            status: "active",
            createdAt: new Date().toISOString().split("T")[0],
            ...extra,
        };

        // Push to local Users list array and persist to storage
        const updatedUsersList = [...localUsers, newUser];
        setLocalUsers(updatedUsersList);
        localStorage.setItem("placementUsersList_v3", JSON.stringify(updatedUsersList));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("placementUser_v3");
        // Clear globally persistent DataContext keys so that data from another account doesn't leak.
        localStorage.removeItem("skillshala_jobs_v2");
        localStorage.removeItem("skillshala_applications_v2");
        localStorage.removeItem("skillshala_placements_v2");
        // Also clear out notifications and messages
        localStorage.removeItem("skillshala_notifications_clear");
        localStorage.removeItem("skillshala_messages_clear");
    };

    const updateProfile = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem("placementUser_v3", JSON.stringify(updated));

        // Make sure to also reflect profile updates globally on the users list
        const updatedUsersList = localUsers.map((u) =>
            u.id === user.id ? { ...u, ...updates } : u
        );
        setLocalUsers(updatedUsersList);
        localStorage.setItem("placementUsersList_v3", JSON.stringify(updatedUsersList));
    };

    // CROSS-TAB SYNC: Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "placementUser_v3") {
                // Someone logged in or out in another tab
                setUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
            if (e.key === "placementUsersList_v3") {
                // User database updated in another tab
                setLocalUsers(e.newValue ? JSON.parse(e.newValue) : []);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, localUsers, login, register, logout, updateProfile, editUserRole, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
