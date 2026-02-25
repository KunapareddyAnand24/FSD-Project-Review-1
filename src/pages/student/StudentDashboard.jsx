import { FiBriefcase, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";
import StatCard from "../../components/StatCard";
import JobCard from "../../components/JobCard";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { hasSkillMatch } from "../../utils/skillMatcher";

export default function StudentDashboard() {
    const { user } = useAuth();
    const { jobs, applications } = useData();
    const myApplications = applications.filter((a) => a.studentId === user.id);
    const activeJobs = jobs.filter((j) => j.status === "active");

    // Filter jobs that match student skills
    const skillMatchingJobs = activeJobs.filter(job =>
        hasSkillMatch(user.skills, job.requirements)
    );

    const totalApplied = myApplications.length;
    const shortlistedCount = myApplications.filter((a) => a.status === "shortlisted" || a.status === "interview_scheduled").length;
    const selectedCount = myApplications.filter((a) => a.status === "selected").length;

    const recommendedJobs = skillMatchingJobs.slice(0, 3);
    const myJobs = myApplications.filter((a) => a.status === "selected");

    return (
        <div className="page">
            <div className="page-header">
                <h1>Welcome, {user.name} 👋</h1>
                <p>Here's your placement overview</p>
            </div>

            <div className="stats-grid">
                <StatCard icon={<FiBriefcase size={24} />} label="Total Applied" value={totalApplied} color="#6c63ff" />
                <StatCard icon={<FiFileText size={24} />} label="Shortlisted/Interview" value={shortlistedCount} color="#3b82f6" />
                <StatCard icon={<FiCheckCircle size={24} />} label="Selected" value={selectedCount} color="#10b981" />
            </div>

            <div className="section">
                <h2 className="section-title">Recommended Jobs</h2>
                <div className="jobs-grid">
                    {recommendedJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            applied={myApplications.some((a) => a.jobId === job.id)}
                            showActions={false}
                        />
                    ))}
                </div>
            </div>

            {myJobs.length > 0 && (
                <div className="section" style={{ marginTop: "30px" }}>
                    <h2 className="section-title">My Jobs (Selected)</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myJobs.map((app) => (
                                    <tr key={app.id}>
                                        <td style={{ fontWeight: 500 }}>{app.companyName}</td>
                                        <td>{app.jobTitle}</td>
                                        <td>
                                            <span className="status-badge status-selected">
                                                Accepted Offer
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
