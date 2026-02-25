import { useState } from "react";
import { FiMessageSquare, FiUser, FiX, FiFileText, FiExternalLink, FiDownload } from "react-icons/fi";

// Convert a base64 data URL to a Blob (for opening as object URL in new tab)
function dataURLtoBlob(dataUrl) {
    try {
        const [header, data] = dataUrl.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(data);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
        return new Blob([array], { type: mime });
    } catch {
        return null;
    }
}

function openResumeInNewTab(resumeFile) {
    try {
        const blob = dataURLtoBlob(resumeFile.data);
        if (blob) {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } else {
            // Fallback: open raw data URL
            window.open(resumeFile.data, '_blank');
        }
    } catch {
        window.open(resumeFile.data, '_blank');
    }
}
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

            {/* Candidate Profile Modal - Fit Screen / Full Width / Premium Efficiency */}
            {selectedCandidate && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="modal-content" style={{
                        width: '98vw', maxWidth: '1400px', height: '95vh',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        animation: 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute', top: '24px', right: '24px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none', width: '44px', height: '44px',
                                borderRadius: '50%', fontSize: '1.4rem',
                                cursor: 'pointer', color: 'var(--text-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <FiX />
                        </button>

                        {/* Sidebar - Student Summary */}
                        <div style={{
                            width: '380px',
                            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-card) 100%)',
                            borderRight: '1px solid var(--border-color)',
                            display: 'flex', flexDirection: 'column',
                            padding: '40px',
                            overflowY: 'auto',
                            animation: 'slideInLeft 0.5s ease 0.1s both'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{
                                    width: '120px', height: '120px', borderRadius: '30px',
                                    backgroundColor: 'var(--accent-primary)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '3.5rem', overflow: 'hidden', margin: '0 auto 20px auto',
                                    boxShadow: '0 10px 20px rgba(108, 99, 255, 0.3)'
                                }}>
                                    {selectedCandidate.profileImage ? (
                                        <img src={selectedCandidate.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        selectedCandidate.avatar || selectedCandidate.name[0]
                                    )}
                                </div>
                                <h2 style={{ margin: '0 0 5px 0', fontSize: '1.8rem' }}>{selectedCandidate.name}</h2>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>{selectedCandidate.email}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Info</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">GPA</span>
                                            <span style={{ fontWeight: 700, color: '#10b981' }}>{selectedCandidate.gpa || "N/A"}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Year</span>
                                            <span style={{ fontWeight: 600 }}>{selectedCandidate.graduationYear || "N/A"}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="text-muted">Role</span>
                                            <span className="status-badge" style={{ fontSize: '0.75rem' }}>{selectedCandidate.role.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h4>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>{selectedCandidate.university || "University not specified"}</p>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedCandidate.department || "General"}</p>
                                </div>

                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Expertise</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selectedCandidate.skills && selectedCandidate.skills.length > 0 ? (
                                            selectedCandidate.skills.map(skill => (
                                                <span key={skill} className="skill-tag" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px' }}>{skill}</span>
                                            ))
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No skills listed</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '30px' }}>
                                <Link to={`/employer/messages?contact=${selectedCandidate.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '54px', borderRadius: '16px', fontSize: '1.1rem' }}>
                                    <FiMessageSquare /> Contact Now
                                </Link>
                            </div>
                        </div>

                        {/* Main Content - Resume Viewer */}
                        <div style={{
                            flex: 1,
                            display: 'flex', flexDirection: 'column',
                            padding: '40px',
                            background: 'var(--bg-card)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FiFileText color="var(--accent-primary)" /> Resume Content
                                </h2>
                                {selectedCandidate.resumeFile && (
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => openResumeInNewTab(selectedCandidate.resumeFile)}
                                            className="btn btn-primary"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}
                                        >
                                            <FiExternalLink /> View in New Tab
                                        </button>
                                        <a
                                            href={selectedCandidate.resumeFile.data}
                                            download={selectedCandidate.resumeFile.name}
                                            className="btn btn-outline"
                                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px' }}
                                        >
                                            <FiDownload /> Download PDF
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div style={{
                                flex: 1,
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '24px',
                                border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {selectedCandidate.resumeFile ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {/* Inline PDF Viewer */}
                                        <iframe
                                            src={selectedCandidate.resumeFile.data}
                                            title={selectedCandidate.resumeFile.name || 'Resume'}
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                                border: 'none',
                                                borderRadius: '16px',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        {/* Fallback notice for browsers that block iframes */}
                                        <p style={{ margin: 0, textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            If the PDF is not visible above, use the &ldquo;View in New Tab&rdquo; button above.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', opacity: 0.5 }}>
                                        <FiFileText size={64} style={{ marginBottom: '20px' }} />
                                        <p style={{ fontSize: '1.2rem' }}>Candidate has not uploaded a resume yet.</p>
                                    </div>
                                )}
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
