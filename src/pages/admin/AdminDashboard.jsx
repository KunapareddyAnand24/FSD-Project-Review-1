import { useState, useEffect } from "react";
import { FiUsers, FiBriefcase, FiCheckCircle, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminDashboard() {
    const { localUsers } = useAuth();
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    const { jobs, placements, applications } = useData();

    const totalUsers = localUsers.length;
    const totalJobs = jobs.length;
    const totalPlacements = placements.length;
    const totalApplications = applications.length;

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setLastUpdated(new Date());
            setRefreshing(false);
        }, 600);
    };

    const recentActivity = [
        { text: "Priya Patel was placed at TechCorp Solutions", time: "2 hours ago", type: "success" },
        { text: "New job posted: ML Engineer Intern at DataBridge", time: "5 hours ago", type: "info" },
        { text: "Rahul Sharma applied to Frontend Developer", time: "1 day ago", type: "default" },
        { text: "New employer registered: DataBridge Analytics", time: "2 days ago", type: "info" },
        { text: "Admin updated placement policies", time: "3 days ago", type: "default" },
    ];

    // Role distribution
    const roleCounts = {
        Students: localUsers.filter((u) => u.role === "student").length,
        Employers: localUsers.filter((u) => u.role === "employer").length,
        Officers: localUsers.filter((u) => u.role === "officer").length,
        Admins: localUsers.filter((u) => u.role === "admin").length,
    };

    const recentUsers = [...localUsers]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    return (
        <div className="page">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Real-time overview of the SKILLSHALA platform</p>
                    </div>
                    <div className="realtime-indicator">
                        <button className={`btn-refresh ${refreshing ? "spinning" : ""}`} onClick={handleRefresh} title="Refresh data">
                            <FiRefreshCw />
                        </button>
                        <span className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={<FiUsers size={24} />} label="Total Users" value={totalUsers} color="#6c63ff" />
                <StatCard icon={<FiBriefcase size={24} />} label="Active Jobs" value={totalJobs} color="#00c9a7" />
                <StatCard icon={<FiCheckCircle size={24} />} label="Placements" value={totalPlacements} color="#f59e0b" />
                <StatCard icon={<FiTrendingUp size={24} />} label="Applications" value={totalApplications} color="#ef4444" />
            </div>

            <div className="dashboard-grid-2">
                {/* Recent Registrations Table */}
                <div className="card">
                    <h2 className="card-title">Recent Registrations</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="mini-avatar">{u.avatar}</div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{u.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="role-badge" style={{ background: 'rgba(108, 99, 255, 0.1)', color: 'var(--accent-primary)', fontSize: '0.7rem' }}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.createdAt}</td>
                                    </tr>
                                ))}
                                {recentUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="empty-row">No recent registrations</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Role Distribution */}
                <div className="card">
                    <h2 className="card-title">User Distribution</h2>
                    <div className="role-dist">
                        {Object.entries(roleCounts).map(([role, count]) => (
                            <div key={role} className="role-dist-item">
                                <div className="role-dist-info">
                                    <span>{role}</span>
                                    <span className="role-dist-count">{count}</span>
                                </div>
                                <div className="role-dist-bar-bg">
                                    <div
                                        className="role-dist-bar-fill"
                                        style={{ width: `${totalUsers ? (count / totalUsers) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Job Postings */}
            <div className="card">
                <h2 className="card-title">Latest Active Job Postings</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.slice(0, 4).map((job) => (
                                <tr key={job.id}>
                                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                                    <td>{job.companyName}</td>
                                    <td>{job.location}</td>
                                    <td className="salary-cell">{job.salary}</td>
                                    <td>
                                        <span className={`status-badge status-${job.status}`}>
                                            {job.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
