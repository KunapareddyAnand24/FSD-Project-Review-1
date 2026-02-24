import { useState } from "react";
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

    const handleApply = (job) => {
        // Prevent duplicate applications
        if (appliedJobs.includes(job.id)) return;

        // Check if job is expired
        if (job.deadline < today) return;

        const newApp = {
            jobId: job.id,
            studentId: user.id,
            studentName: user.name,
            jobTitle: job.title,
            companyName: job.companyName,
            status: "pending",
            appliedAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            notes: "",
        };
        addApplication(newApp);
        setAppliedJobs([...appliedJobs, job.id]);

        // Send notification to student
        addNotification({
            type: "success",
            title: "Application Submitted",
            message: `You successfully applied for ${job.title} at ${job.companyName}.`,
            role: "student",
            userId: user.id,
        });

        // Send notification to employer
        addNotification({
            type: "info",
            title: "New Application Received",
            message: `A new student applied for your ${job.title} role.`,
            role: "employer",
            userId: job.employerId,
        });
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
                            onApply={handleApply}
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
        </div>
    );
}
