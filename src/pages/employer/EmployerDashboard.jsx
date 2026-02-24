import { useState } from "react";
import { FiBriefcase, FiUsers, FiCheckCircle, FiTrendingUp, FiCalendar, FiVideo } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

export default function EmployerDashboard() {
    const { user } = useAuth();
    const { jobs, applications } = useData();
    const myJobs = jobs.filter((j) => j.employerId === user.id);
    const myJobIds = myJobs.map((j) => j.id);
    const myApplications = applications.filter((a) => myJobIds.includes(a.jobId));
    const shortlisted = myApplications.filter((a) => a.status === "shortlisted").length;
    const accepted = myApplications.filter((a) => a.status === "accepted").length;

    const [filter, setFilter] = useState("all");
    const filteredApps = myApplications.filter(app => filter === "all" || app.status === filter);

    return (
        <div className="page">
            <div className="page-header">
                <h1>Employer Dashboard</h1>
                <p>Welcome, {user.companyName || user.name}</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<FiBriefcase size={24} />} label="Active Listings" value={myJobs.length} color="#6c63ff" />
                <StatCard icon={<FiUsers size={24} />} label="Total Applicants" value={myApplications.length} color="#3b82f6" />
                <StatCard icon={<FiTrendingUp size={24} />} label="Shortlisted" value={shortlisted} color="#f59e0b" />
                <StatCard icon={<FiCheckCircle size={24} />} label="Accepted" value={accepted} color="#10b981" />
            </div>

            <div className="card">
                <h2 className="card-title">Upcoming Interviews</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Candidate</th>
                                <th>Position</th>
                                <th>Schedule</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 500 }}>Rahul Sharma</td>
                                <td>Frontend Developer</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <FiCalendar /> Tomorrow, 10:00 AM
                                    </div>
                                </td>
                                <td>
                                    <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                                        <FiVideo style={{ marginRight: '6px' }} /> Join Meeting
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 className="card-title" style={{ margin: 0 }}>Recent Applicants</h2>
                    <select className="form-input" style={{ width: "auto", padding: "6px 12px" }} value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Position</th>
                                <th>Applied</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.slice(0, 5).map((app) => (
                                <tr key={app.id}>
                                    <td>{app.studentName}</td>
                                    <td>{app.jobTitle}</td>
                                    <td>{app.appliedAt}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="empty-row">No applicants match this filter.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
