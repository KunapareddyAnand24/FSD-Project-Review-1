import { FiMapPin, FiClock, FiDollarSign, FiBriefcase } from "react-icons/fi";

export default function JobCard({ job, onApply, onView, applied, showActions = true }) {
    return (
        <div className="job-card">
            <div className="job-card-header">
                <div className="job-company-avatar">
                    {job.companyName
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                </div>
                <div className="job-header-info">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.companyName}</p>
                </div>
                <span className={`job-type-badge ${job.type === "Internship" ? "internship" : "fulltime"}`}>
                    {job.type}
                </span>
            </div>
            <p className="job-description">{job.description}</p>
            <div className="job-meta">
                <span>
                    <FiMapPin /> {job.location}
                </span>
                <span>
                    <FiDollarSign /> {job.salary}
                </span>
                <span>
                    <FiClock /> Deadline: {job.deadline}
                </span>
                <span>
                    <FiBriefcase /> {job.openings} openings
                </span>
            </div>
            <div className="job-tags">
                {job.requirements.map((req) => (
                    <span key={req} className="skill-tag">
                        {req}
                    </span>
                ))}
            </div>
            {showActions && (
                <div className="job-actions">
                    {onView && (
                        <button className="btn btn-outline" onClick={() => onView(job)}>
                            View Details
                        </button>
                    )}
                    {onApply && (
                        <button
                            className={`btn ${applied ? "btn-disabled" : "btn-primary"}`}
                            onClick={() => !applied && onApply(job)}
                            disabled={applied}
                        >
                            {applied ? "Applied" : "Apply Now"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
