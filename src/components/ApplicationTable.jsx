import { useState } from "react";
import { FiMessageSquare, FiUser, FiX, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ApplicationTable({ applications, showActions, onUpdateStatus }) {
    const statusColors = {
        applied: "#f59e0b",
        under_review: "#8b5cf6",
        shortlisted: "#3b82f6",
        interview_scheduled: "#0ea5e9",
        selected: "#10b981",
        rejected: "#ef4444",
    };

    const { localUsers } = useAuth();
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const handleViewProfile = (studentId) => {
        const student = localUsers.find(u => u.id === studentId);
        if (student) {
            setSelectedCandidate(student);
        }
    };

    const closeModal = () => setSelectedCandidate(null);

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

                                            {/* View Profile Button */}
                                            <button
                                                className="btn-sm btn-outline"
                                                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                                                onClick={() => handleViewProfile(app.studentId)}
                                                title="View Candidate Profile"
                                            >
                                                <FiUser /> Profile
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Candidate Profile Modal */}
            {selectedCandidate && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content card" style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '30px' }}>
                        <button
                            onClick={closeModal}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                            <FiX />
                        </button>

                        <h2 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiUser /> Candidate Profile
                        </h2>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden' }}>
                                {selectedCandidate.profileImage ? (
                                    <img src={selectedCandidate.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    selectedCandidate.avatar || selectedCandidate.name[0]
                                )}
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{selectedCandidate.name}</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedCandidate.email}</p>
                            </div>
                        </div>

                        <div className="profile-details" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                            <div><strong>University/College:</strong> {selectedCandidate.university || "Not provided"}</div>
                            <div><strong>Department:</strong> {selectedCandidate.department || "Not provided"}</div>
                            <div><strong>GPA:</strong> {selectedCandidate.gpa || "Not provided"}</div>
                            <div><strong>Graduation Year:</strong> {selectedCandidate.graduationYear || "Not provided"}</div>
                            <div>
                                <strong>Skills:</strong>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                    {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                                        selectedCandidate.skills.map(skill => (
                                            <span key={skill} className="skill-tag" style={{ fontSize: '0.8rem', padding: '2px 8px' }}>{skill}</span>
                                        ))
                                    ) : (
                                        "None listed"
                                    )}
                                </div>
                            </div>
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                                <strong>Resume:</strong><br />
                                {selectedCandidate.resumeFile ? (
                                    <a href={selectedCandidate.resumeFile.data} download={selectedCandidate.resumeFile.name} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px', textDecoration: 'none' }}>
                                        <FiFileText /> Download {selectedCandidate.resumeFile.name}
                                    </a>
                                ) : (
                                    <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '5px' }}>No resume uploaded</span>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to={`/employer/messages?contact=${selectedCandidate.id}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiMessageSquare /> Contact Student
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
