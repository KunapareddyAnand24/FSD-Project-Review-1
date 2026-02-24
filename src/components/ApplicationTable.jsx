import { FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function ApplicationTable({ applications, showActions, onUpdateStatus }) {
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

    return (
        <div className="card table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Candidate</th>
                        <th>Job Title</th>
                        <th>Applied On</th>
                        <th>Status</th>
                        {showActions && <th style={{ textAlign: "right" }}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {applications.length === 0 ? (
                        <tr>
                            <td colSpan={showActions ? 5 : 4} className="empty-row">
                                No applications found
                            </td>
                        </tr>
                    ) : (
                        applications.map((app) => (
                            <tr key={app.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{app.studentName}</div>
                                </td>
                                <td>{app.jobTitle}</td>
                                <td className="text-muted">{app.appliedAt}</td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{
                                            backgroundColor: statusColors[app.status] + "22",
                                            color: statusColors[app.status],
                                            border: `1px solid ${statusColors[app.status]}40`,
                                        }}
                                    >
                                        {statusLabels[app.status]}
                                    </span>
                                </td>
                                {showActions && (
                                    <td>
                                        <div className="action-btns" style={{ justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                                            {/* Action Dropdown for Status */}
                                            {app.status !== "rejected" && app.status !== "selected" ? (
                                                <select
                                                    className="filter-select"
                                                    style={{ padding: "4px 8px", fontSize: "0.8rem", minWidth: "120px" }}
                                                    value={app.status}
                                                    onChange={(e) => onUpdateStatus(app.id, e.target.value)}
                                                >
                                                    <option disabled value="applied">Applied</option>
                                                    <option value="under_review">Under Review</option>
                                                    <option value="shortlisted">Shortlist</option>
                                                    <option value="interview_scheduled">Schedule Interview</option>
                                                    <option value="selected">Select Candidate</option>
                                                    <option value="rejected">Reject</option>
                                                </select>
                                            ) : (
                                                <span className="text-muted" style={{ fontSize: "0.8rem", marginRight: "10px" }}>Closed</span>
                                            )}

                                            {/* Quick Message Button */}
                                            <Link
                                                to={`/employer/messages?contact=${app.studentId}`}
                                                className="btn-sm"
                                                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                                                title="Message Candidate"
                                            >
                                                <FiMessageSquare /> Msg
                                            </Link>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
