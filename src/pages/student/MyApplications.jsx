import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { FiCheck, FiClock, FiXCircle, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function MyApplications() {
    const { user } = useAuth();
    const { applications } = useData();
    const [statusFilter, setStatusFilter] = useState("all");

    const myApps = applications.filter((a) => a.studentId === user.id);
    const filtered = statusFilter === "all" ? myApps : myApps.filter((a) => a.status === statusFilter);

    const statusColors = {
        applied: "#f59e0b",
        under_review: "#8b5cf6",
        shortlisted: "#3b82f6",
        interview_scheduled: "#0ea5e9",
        selected: "#10b981",
        rejected: "#ef4444",
    };

    const statusLabels = {
        applied: "Applied",
        under_review: "Under Review",
        shortlisted: "Shortlisted",
        interview_scheduled: "Interview Scheduled",
        selected: "Selected",
        rejected: "Rejected",
    };

    // Progress steps for the timeline (5 stages)
    const progressSteps = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected"];
    const statusToStep = {
        applied: 0,
        under_review: 1,
        shortlisted: 2,
        interview_scheduled: 3,
        selected: 4,
        rejected: -1,
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>My Applications</h1>
                <p>Track the real-time detailed status of your job applications</p>
            </div>

            <div className="filters-bar">
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                </select>
                <span className="filter-count">{filtered.length} application{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="applications-list">
                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>No applications found matching this status.</p>
                    </div>
                ) : (
                    filtered.map((app) => {
                        const currentStep = statusToStep[app.status];
                        const isRejected = app.status === "rejected";

                        return (
                            <div key={app.id} className="card application-card-v2" style={{ marginBottom: "20px" }}>
                                <div className="app-card-top" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                    <div className="app-card-left">
                                        <h3 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{app.jobTitle}</h3>
                                        <p className="app-company" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{app.companyName}</p>
                                        <p className="text-muted" style={{ marginTop: "4px" }}>Applied: {app.appliedAt} • Updated: {app.updatedAt}</p>
                                    </div>
                                    <div className="app-card-right">
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: statusColors[app.status] + "22",
                                                color: statusColors[app.status],
                                                border: `1px solid ${statusColors[app.status]}40`,
                                                padding: "6px 14px",
                                            }}
                                        >
                                            {statusLabels[app.status]}
                                        </span>
                                    </div>
                                </div>

                                {/* Multi-stage Progress Timeline */}
                                <div className="app-timeline" style={{ background: "var(--bg-secondary)", padding: "20px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                                    {isRejected ? (
                                        <div className="timeline-rejected" style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--danger)" }}>
                                            <FiXCircle size={20} />
                                            <span style={{ fontWeight: 500 }}>Application was not successful at this time.</span>
                                        </div>
                                    ) : (
                                        <div className="timeline-steps" style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                                            {/* Background connecting line */}
                                            <div style={{ position: "absolute", top: "14px", left: "20px", right: "20px", height: "2px", background: "var(--border-color)", zIndex: 0 }}></div>

                                            {/* Progress connecting line */}
                                            <div style={{ position: "absolute", top: "14px", left: "20px", width: `${(Math.max(0, currentStep) / (progressSteps.length - 1)) * 100}%`, height: "2px", background: "var(--accent-primary)", zIndex: 0, transition: "var(--transition)" }}></div>

                                            {progressSteps.map((step, i) => {
                                                const isCompleted = i <= currentStep;
                                                const isCurrent = i === currentStep;
                                                const dotColor = isCompleted ? "var(--accent-primary)" : "var(--bg-card)";
                                                const dotBorder = isCompleted ? "var(--accent-primary)" : "var(--border-color)";
                                                const textColor = isCompleted ? "var(--text-primary)" : "var(--text-muted)";

                                                return (
                                                    <div key={step} className="timeline-step-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 1, position: "relative", width: "80px", textAlign: "center" }}>
                                                        <div
                                                            className="timeline-dot"
                                                            style={{
                                                                width: "30px", height: "30px", borderRadius: "50%", background: dotColor, border: `2px solid ${dotBorder}`,
                                                                display: "flex", alignItems: "center", justifyContent: "center", color: isCompleted ? "#fff" : "var(--text-muted)", transition: "var(--transition)",
                                                                boxShadow: isCurrent ? "0 0 0 4px rgba(108, 99, 255, 0.2)" : "none"
                                                            }}
                                                        >
                                                            {isCompleted ? <FiCheck size={16} /> : <FiClock size={16} />}
                                                        </div>
                                                        <span className="timeline-label" style={{ fontSize: "0.75rem", fontWeight: isCurrent ? 600 : 400, color: textColor }}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {app.notes ? (
                                        <div className="app-notes-bar text-muted" style={{ fontStyle: "italic", fontSize: "0.85rem" }}>
                                            <strong>Feedback from {app.companyName}:</strong> {app.notes}
                                        </div>
                                    ) : <div></div>}

                                    <Link to="/student/messages" className="btn btn-outline btn-sm">
                                        <FiMessageSquare /> Contact Employer
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
