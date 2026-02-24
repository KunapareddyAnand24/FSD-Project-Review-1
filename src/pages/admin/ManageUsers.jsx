import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";

export default function ManageUsers() {
    const { localUsers, editUserRole, deleteUser } = useAuth();
    const [roleFilter, setRoleFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = localUsers.filter((user) => {
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const roleColors = {
        admin: "#6c63ff",
        student: "#00c9a7",
        employer: "#f59e0b",
        officer: "#3b82f6",
    };

    const handleRoleChange = (userId, currentRole) => {
        const roles = ["admin", "student", "employer", "officer"];
        const currentIndex = roles.indexOf(currentRole);
        const nextRole = roles[(currentIndex + 1) % roles.length];
        editUserRole(userId, nextRole);
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(userId);
        }
    };

    return (
        <div className="page">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1>Manage Users</h1>
                    <p>View and manage all registered users dynamically</p>
                </div>
                <button className="btn btn-primary">
                    <FiUserPlus /> Add New User
                </button>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="employer">Employer</option>
                    <option value="officer">Officer</option>
                </select>
            </div>

            <div className="card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-row">No users found matching your search.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="mini-avatar">{user.avatar}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>{user.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted">{user.email}</td>
                                    <td>
                                        <span
                                            className="role-badge"
                                            style={{
                                                backgroundColor: roleColors[user.role] + "22",
                                                color: roleColors[user.role],
                                                border: `1px solid ${roleColors[user.role]}40`,
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleRoleChange(user.id, user.role)}
                                            title="Click to toggle role"
                                        >
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span className={`status-dot ${user.status}`}></span>
                                            <span style={{ color: user.status === 'active' ? 'var(--success)' : 'var(--text-muted)' }}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-muted">{user.createdAt}</td>
                                    <td>
                                        <div className="action-btns" style={{ justifyContent: "flex-end" }}>
                                            <button
                                                className="btn-sm"
                                                style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}
                                                onClick={() => handleRoleChange(user.id, user.role)}
                                                title="Edit Role"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="btn-sm btn-danger"
                                                onClick={() => handleDelete(user.id)}
                                                title="Delete User"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
