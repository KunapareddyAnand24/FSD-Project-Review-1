import { useState } from "react";
import { FiMessageSquare, FiUser, FiX, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
    const [schedulingApp, setSchedulingApp] = useState(null);
    const [scheduleData, setScheduleData] = useState({ date: "", time: "10:00" });

    const handleViewProfile = (app) => {
        const student = localUsers.find(u => u.id === app.studentId);
        if (student) {
            // Use the application-specific resume if it exists, otherwise fall back to profile resume
            setSelectedCandidate({
                ...student,
                resumeFile: app.resumeFile || student.resumeFile,
                appId: app.id
            });
        }
    };

    const handleStatusChange = (appId, newStatus) => {
        if (newStatus === "interview_scheduled") {
            setSchedulingApp(appId);
        } else {
            onUpdateStatus(appId, newStatus);
        }
    };

    const confirmSchedule = (e) => {
        e.preventDefault();
        onUpdateStatus(schedulingApp, "interview_scheduled", {
            interviewDate: scheduleData.date,
            interviewTime: scheduleData.time
        });
        setSchedulingApp(null);
        setScheduleData({ date: "", time: "10:00" });
    };

    const closeModal = () => setSelectedCandidate(null);
    const closeScheduleModal = () => setSchedulingApp(null);

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
                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
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
                                                onClick={() => handleViewProfile(app)}
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

            {/* Candidate Profile Modal - Fit Screen / Full Width */}
            {selectedCandidate && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="modal-content card" style={{ width: '95vw', maxWidth: '1200px', height: '90vh', overflowY: 'auto', position: 'relative', padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <button
                            onClick={closeModal}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        >
                            <FiX />
                        </button>

                        <div className="profile-header-large" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '30px' }}>
                            <div style={{ width: '150px', height: '150px', borderRadius: '15px', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', overflow: 'hidden', flexShrink: 0 }}>
                                {selectedCandidate.profileImage ? (
                                    <img src={selectedCandidate.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    selectedCandidate.avatar || selectedCandidate.name[0]
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', color: 'var(--text-primary)' }}>{selectedCandidate.name}</h1>
                                <p style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{selectedCandidate.email}</p>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <span className="status-badge" style={{ padding: '6px 15px', fontSize: '1rem' }}>{selectedCandidate.role.toUpperCase()}</span>
                                    {selectedCandidate.gpa && <span className="status-badge" style={{ padding: '6px 15px', fontSize: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>GPA: {selectedCandidate.gpa}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="profile-grid-large" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                            {/* Left Column: Details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <section>
                                    <h3 style={{ marginBottom: '15px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '10px' }}>Education</h3>
                                    <div className="profile-details-card" style={{ padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div><strong className="text-muted">University:</strong> <div style={{ fontSize: '1.1rem', marginTop: '4px' }}>{selectedCandidate.university || "Not provided"}</div></div>
                                        <div><strong className="text-muted">Department:</strong> <div style={{ fontSize: '1.1rem', marginTop: '4px' }}>{selectedCandidate.department || "Not provided"}</div></div>
                                        <div style={{ display: 'flex', gap: '30px', marginTop: '10px' }}>
                                            <div><strong className="text-muted">GPA:</strong> <div style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{selectedCandidate.gpa || "N/A"}</div></div>
                                            <div><strong className="text-muted">Class of:</strong> <div style={{ fontSize: '1.1rem' }}>{selectedCandidate.graduationYear || "N/A"}</div></div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 style={{ marginBottom: '15px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '10px' }}>Skills & Expertise</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                                            selectedCandidate.skills.map(skill => (
                                                <span key={skill} className="skill-tag" style={{ fontSize: '1rem', padding: '6px 15px' }}>{skill}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted">No skills listed</span>
                                        )}
                                    </div>
                                </section>

                                <div style={{ marginTop: 'auto' }}>
                                    <Link to={`/employer/messages?contact=${selectedCandidate.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px', fontSize: '1.1rem' }}>
                                        <FiMessageSquare /> Send Message
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: Resume Viewer */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '10px' }}>
                                    Resume / Curriculum Vitae
                                    {selectedCandidate.resumeFile && (
                                        <a href={selectedCandidate.resumeFile.data} download={selectedCandidate.resumeFile.name} className="btn-sm btn-outline" style={{ textDecoration: 'none' }}>
                                            <FiFileText /> Download PDF
                                        </a>
                                    )}
                                </h3>
                                <div className="resume-viewer-large" style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', overflow: 'hidden' }}>
                                    {selectedCandidate.resumeFile ? (
                                        <div style={{ textAlign: 'center', padding: '40px' }}>
                                            <FiFileText size={80} color="var(--accent-primary)" style={{ marginBottom: '20px' }} />
                                            <h4 style={{ margin: '0 0 10px 0' }}>{selectedCandidate.resumeFile.name}</h4>
                                            <p className="text-muted">File size: {(selectedCandidate.resumeFile.size / 1024).toFixed(1)} KB</p>
                                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', maxWidth: '400px' }}>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Note: In this demo environment, resumes are stored locally. Use the download button above to view the full document.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <FiFileText size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                                            <p>No resume document has been uploaded yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Scheduling Modal */}
            {schedulingApp && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div className="modal-content card" style={{ width: '400px', padding: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Schedule Interview</h2>
                            <button onClick={closeScheduleModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><FiX size={24} /></button>
                        </div>

                        <form onSubmit={confirmSchedule}>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Interview Date</label>
                                <input
                                    type="date"
                                    required
                                    className="form-control"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={scheduleData.date}
                                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Interview Time</label>
                                <input
                                    type="time"
                                    required
                                    className="form-control"
                                    value={scheduleData.time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={closeScheduleModal} className="btn" style={{ flex: 1, backgroundColor: 'var(--bg-secondary)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirm Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
