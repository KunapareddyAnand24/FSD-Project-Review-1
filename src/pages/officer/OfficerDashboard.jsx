import { useState } from "react";
import { FiCheckCircle, FiUsers, FiBriefcase, FiTrendingUp, FiCheck, FiX } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";

export default function OfficerDashboard() {
    const { localUsers } = useAuth();
    const { placements, jobs, applications } = useData();
    const totalPlacements = placements.length;
    const totalStudents = localUsers.filter((u) => u.role === "student").length;
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const acceptedApps = applications.filter((a) => a.status === "selected").length;

    const deptStats = {};
    placements.forEach((p) => {
        deptStats[p.department] = (deptStats[p.department] || 0) + 1;
    });

    const [pendingJobs, setPendingJobs] = useState([
        { id: 101, company: "Amazon", title: "Cloud Architect", date: "Today" },
        { id: 102, company: "Microsoft", title: "Product Manager", date: "Yesterday" }
    ]);
    const handleApprove = (id) => setPendingJobs(pendingJobs.filter(j => j.id !== id));

    return (
        <div className="page">
            <div className="page-header">
                <h1>Placement Officer Dashboard</h1>
                <p>Overview of placement activities</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<FiCheckCircle size={24} />} label="Total Placements" value={totalPlacements} color="#10b981" />
                <StatCard icon={<FiUsers size={24} />} label="Registered Students" value={totalStudents} color="#6c63ff" />
                <StatCard icon={<FiBriefcase size={24} />} label="Active Jobs" value={activeJobs} color="#3b82f6" />
                <StatCard icon={<FiTrendingUp size={24} />} label="Offers Made" value={acceptedApps} color="#f59e0b" />
            </div>

            <div className="card">
                <h2 className="card-title">Placements by Department</h2>
                <div className="dept-chart">
                    {Object.entries(deptStats).map(([dept, count]) => (
                        <div key={dept} className="dept-bar-row">
                            <span className="dept-label">{dept}</span>
                            <div className="dept-bar-wrapper">
                                <div
                                    className="dept-bar"
                                    style={{ width: `${(count / totalPlacements) * 100}%` }}
                                >
                                    {count}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Pending Job Approvals (Quick Actions)</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Job Title</th>
                                <th>Submitted Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingJobs.map(job => (
                                <tr key={job.id}>
                                    <td style={{ fontWeight: 500 }}>{job.company}</td>
                                    <td>{job.title}</td>
                                    <td>{job.date}</td>
                                    <td>
                                        <button className="btn btn-outline" onClick={() => handleApprove(job.id)} style={{ marginRight: '8px', color: 'var(--success)', borderColor: 'var(--success)', padding: '4px 12px' }}>
                                            <FiCheck style={{ marginRight: '4px' }} /> Approve
                                        </button>
                                        <button className="btn btn-outline" onClick={() => handleApprove(job.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '4px 12px' }}>
                                            <FiX style={{ marginRight: '4px' }} /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingJobs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-muted" style={{ textAlign: 'center', padding: '20px' }}>All caught up! No pending jobs.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <h2 className="card-title">Recent Placements</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Company</th>
                                <th>Position</th>
                                <th>Package</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {placements.slice(0, 5).map((p) => (
                                <tr key={p.id}>
                                    <td>{p.studentName}</td>
                                    <td>{p.companyName}</td>
                                    <td>{p.jobTitle}</td>
                                    <td className="salary-cell">{p.salary}</td>
                                    <td>{p.placedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
