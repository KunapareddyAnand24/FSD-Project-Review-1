import { useState, useRef } from "react";
import { FiX, FiUpload, FiFileText } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import JobCard from "../../components/JobCard";
import { useData } from "../../contexts/DataContext";

export default function ExploreJobs() {
    const { user } = useAuth();
    const { jobs, applications, addApplication } = useData();
    const { addNotification } = useNotifications();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("all");
    const [appliedJobs, setAppliedJobs] = useState(
        applications.filter((a) => a.studentId === user.id).map((a) => a.jobId)
    );

    // Modal state for Resume Upload during Application
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicationResume, setApplicationResume] = useState(user.resumeFile || null);
    const resumeInputRef = useRef(null);

    const locations = [...new Set(jobs.map((j) => j.location))];
    const today = new Date().toISOString().split("T")[0];

    const filtered = jobs.filter((job) => {
        const matchSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.requirements.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchType = typeFilter === "all" || job.type === typeFilter;
        const matchLocation = locationFilter === "all" || job.location === locationFilter;
        return matchSearch && matchType && matchLocation && job.status === "active";
    });

    // Separate active and expired jobs
    const activeJobs = filtered.filter((j) => j.deadline >= today);
    const expiredJobs = filtered.filter((j) => j.deadline < today);

    const handleApplyClick = (job) => {
        // Prevent duplicate applications
        if (appliedJobs.includes(job.id)) return;

        // Check if job is expired
        if (job.deadline < today) return;

        // Open the modal instead of applying directly
        setApplicationResume(user.resumeFile || null); // Reset to their default profile resume
        setSelectedJob(job);
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setApplicationResume({ name: file.name, data: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const confirmApplication = () => {
        if (!selectedJob) return;

        const newApp = {
            jobId: selectedJob.id,
            studentId: user.id,
            studentName: user.name,
            jobTitle: selectedJob.title,
            companyName: selectedJob.companyName,
            status: "pending",
            appliedAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            notes: "",
            // Attach the uploaded resume specifically to this application
            resumeFile: applicationResume,
        };
        addApplication(newApp);
        setAppliedJobs([...appliedJobs, selectedJob.id]);

        // Send notification to student
        addNotification({
            type: "success",
            title: "Application Submitted",
            message: `You successfully applied for ${selectedJob.title} at ${selectedJob.companyName}.`,
            role: "student",
            userId: user.id,
        });

        // Send notification to employer
        addNotification({
            type: "info",
            title: "New Application Received",
            message: `A new student applied for your ${selectedJob.title} role.`,
            role: "employer",
            userId: selectedJob.employerId,
        });

        // Close modal
        setSelectedJob(null);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Explore Jobs</h1>
                <p>Find and apply to available positions ({activeJobs.length} active, {expiredJobs.length} expired)</p>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                </select>
                <select className="filter-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    <option value="all">All Locations</option>
                    {locations.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {/* Active Jobs */}
            <div className="jobs-grid">
                {activeJobs.length === 0 && expiredJobs.length === 0 ? (
                    <div className="empty-state">
                        <p>No jobs match your search criteria</p>
                    </div>
                ) : (
                    activeJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            applied={appliedJobs.includes(job.id)}
                            onApply={handleApplyClick}
                        />
                    ))
                )}
            </div>

            {/* Expired Jobs */}
            {expiredJobs.length > 0 && (
                <div className="section" style={{ marginTop: "32px" }}>
                    <h2 className="section-title expired-section-title">
                        ⏰ Expired Listings ({expiredJobs.length})
                    </h2>
                    <div className="jobs-grid">
                        {expiredJobs.map((job) => (
                            <div key={job.id} className="expired-job-wrapper">
                                <div className="expired-badge">Expired</div>
                                <JobCard job={job} showActions={false} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Application Resume Upload Modal */}
            {selectedJob && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content card" style={{ width: '90%', maxWidth: '500px', position: 'relative', padding: '30px' }}>
                        <button
                            onClick={() => setSelectedJob(null)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                            <FiX />
                        </button>

                        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
                            Apply for {selectedJob.title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>
                            Upload a specific resume tailored for <strong>{selectedJob.companyName}</strong>.
                            If you do not upload a new one, your default profile resume will be used.
                        </p>

                        <div className="form-group">
                            <label>Application Resume (PDF)</label>

                            {applicationResume && (
                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                                    <FiFileText style={{ color: 'var(--accent-primary)' }} />
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{applicationResume.name}</span>
                                </div>
                            )}

                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                ref={resumeInputRef}
                                style={{ display: 'none' }}
                                onChange={handleResumeUpload}
                            />
                            <button type="button" className="btn btn-outline btn-block" onClick={() => resumeInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FiUpload /> {applicationResume ? "Change Selected Resume" : "Upload Resume"}
                            </button>
                        </div>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button className="btn btn-outline" onClick={() => setSelectedJob(null)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={confirmApplication}>
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
