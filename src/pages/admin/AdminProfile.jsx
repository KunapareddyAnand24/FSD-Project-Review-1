import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiSettings, FiSave, FiLock } from "react-icons/fi";

export default function AdminProfile() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [saving, setSaving] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            updateProfile({ name, email });
            setSaving(false);
            // In a real app, notify success here
        }, 800);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Admin Profile</h1>
                <p>Manage your administrator account settings and system privileges</p>
            </div>

            <div className="dashboard-grid-2">
                <div className="card">
                    <h2 className="card-title"><FiUser /> Personal Details</h2>
                    <form className="form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role Privilege</label>
                            <input
                                type="text"
                                className="form-input disabled"
                                value={user.role.toUpperCase()}
                                disabled
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <FiSave style={{ marginRight: "8px" }} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h2 className="card-title"><FiSettings /> System Preferences</h2>
                    <div className="form-group">
                        <label className="form-label">Data Refresh Rate</label>
                        <select className="form-input">
                            <option>Real-time (WebSocket)</option>
                            <option>Every 30 Seconds</option>
                            <option>Manual Only</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Global Maintenance Mode</label>
                        <select className="form-input">
                            <option>Off - System Active</option>
                            <option>On - Prevent Logins</option>
                        </select>
                    </div>

                    <h2 className="card-title" style={{ marginTop: "30px" }}><FiLock /> Security</h2>
                    <button className="btn btn-outline" style={{ width: "100%" }}>
                        Change Password
                    </button>
                    <button className="btn btn-outline" style={{ width: "100%", marginTop: "10px", borderColor: "var(--danger)", color: "var(--danger)" }}>
                        Require 2FA for All Admins
                    </button>
                </div>
            </div>
        </div>
    );
}
