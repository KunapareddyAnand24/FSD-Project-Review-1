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

            {/* Candidate Profile Modal - TRUE FULLSCREEN */}
            {selectedCandidate && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'stretch', justifyContent: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    {/* Full screen modal box */}
                    <div style={{
                        width: '100vw', height: '100vh',
                        backgroundColor: 'var(--bg-card)',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                    }}>
                        {/* ── TOP HEADER BAR ── */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '20px',
                            padding: '16px 28px',
                            background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-card) 100%)',
                            borderBottom: '1px solid var(--border-color)',
                            flexShrink: 0,
                            minHeight: '80px'
                        }}>
                            {/* Avatar */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px',
                                backgroundColor: 'var(--accent-primary)', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.6rem', overflow: 'hidden', flexShrink: 0,
                                boxShadow: '0 4px 12px rgba(108,99,255,0.4)'
                            }}>
                                {selectedCandidate.profileImage
                                    ? <img src={selectedCandidate.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : (selectedCandidate.avatar || selectedCandidate.name[0])}
                            </div>

                            {/* Name + Email */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selectedCandidate.name}
                                </h2>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    {selectedCandidate.email}
                                    {selectedCandidate.phone && <span style={{ marginLeft: '16px' }}>📞 {selectedCandidate.phone}</span>}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
                                <Link
                                    to={`/employer/messages?contact=${selectedCandidate.id}`}
                                    className="btn btn-primary"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 20px' }}
                                >
                                    <FiMessageSquare /> Message
                                </Link>
                                {selectedCandidate.resumeFile && (
                                    <>
                                        <button
                                            onClick={() => openResumeInNewTab(selectedCandidate.resumeFile)}
                                            className="btn btn-outline"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 18px' }}
                                        >
                                            <FiExternalLink /> Open PDF
                                        </button>
                                        <a
                                            href={selectedCandidate.resumeFile.data}
                                            download={selectedCandidate.resumeFile.name}
                                            className="btn btn-outline"
                                            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '12px', padding: '10px 18px' }}
                                        >
                                            <FiDownload /> Download
                                        </a>
                                    </>
                                )}
                                {/* Close */}
                                <button
                                    onClick={closeModal}
                                    style={{
                                        background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-color)',
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        cursor: 'pointer', color: 'var(--text-primary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.3rem', transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {/* ── BODY: BIO SIDEBAR + PDF PANEL ── */}
                        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                            {/* LEFT — Bio Sidebar (300px, scrollable) */}
                            <div style={{
                                width: '300px', flexShrink: 0,
                                background: 'var(--bg-secondary)',
                                borderRight: '1px solid var(--border-color)',
                                overflowY: 'auto',
                                padding: '24px 20px',
                                display: 'flex', flexDirection: 'column', gap: '16px'
                            }}>
                                {/* Quick Info */}
                                <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-color)' }}>
                                    <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Student Info</p>
                                    {[
                                        ['GPA / CGPA', selectedCandidate.gpa, '#10b981'],
                                        ['Grad Year', selectedCandidate.graduationYear, null],
                                        ['Department', selectedCandidate.department, null],
                                        ['Phone', selectedCandidate.phone, null],
                                    ].map(([label, val]) => val && (
                                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Education */}
                                <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-color)' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</p>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, fontSize: '0.95rem' }}>{selectedCandidate.university || 'Not specified'}</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedCandidate.department || 'General'}</p>
                                </div>

                                {/* Skills */}
                                {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                                    <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-color)' }}>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {selectedCandidate.skills.map(skill => (
                                                <span key={skill} className="skill-tag" style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '8px' }}>{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {selectedCandidate.projects && selectedCandidate.projects.length > 0 && (
                                    <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-color)' }}>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</p>
                                        {selectedCandidate.projects.map((proj, i) => (
                                            <div key={i} style={{ marginBottom: '10px' }}>
                                                <p style={{ margin: '0 0 2px 0', fontWeight: 600, fontSize: '0.88rem' }}>{typeof proj === 'string' ? proj : proj.name}</p>
                                                {proj.description && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{proj.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Experience */}
                                {selectedCandidate.experience && selectedCandidate.experience.length > 0 && (
                                    <div style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '18px', border: '1px solid var(--border-color)' }}>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Experience</p>
                                        {selectedCandidate.experience.map((exp, i) => (
                                            <div key={i} style={{ marginBottom: '10px' }}>
                                                <p style={{ margin: '0 0 2px 0', fontWeight: 600, fontSize: '0.88rem' }}>{typeof exp === 'string' ? exp : exp.role}</p>
                                                {exp.company && <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{exp.company}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT — PDF Resume Viewer (fills remaining width) */}
                            <div style={{
                                flex: 1, display: 'flex', flexDirection: 'column',
                                background: 'var(--bg-card)',
                                overflow: 'hidden'
                            }}>
                                {/* PDF title strip */}
                                <div style={{
                                    padding: '14px 24px',
                                    borderBottom: '1px solid var(--border-color)',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    flexShrink: 0, background: 'var(--bg-secondary)'
                                }}>
                                    <FiFileText color="var(--accent-primary)" size={18} />
                                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                        Resume — {selectedCandidate.resumeFile ? selectedCandidate.resumeFile.name : 'Not uploaded'}
                                    </span>
                                </div>

                                {/* PDF iframe fills all remaining space */}
                                {selectedCandidate.resumeFile ? (
                                    <iframe
                                        src={selectedCandidate.resumeFile.data}
                                        title={selectedCandidate.resumeFile.name || 'Resume'}
                                        style={{
                                            flex: 1, width: '100%',
                                            border: 'none',
                                            backgroundColor: '#ffffff',
                                            display: 'block'
                                        }}
                                    />
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                        <FiFileText size={80} style={{ marginBottom: '20px' }} />
                                        <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No resume uploaded yet</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Student has not provided a resume for this application</p>
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
