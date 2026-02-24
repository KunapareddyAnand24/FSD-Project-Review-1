import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { FiMapPin, FiUsers, FiCalendar, FiAlertTriangle } from "react-icons/fi";

export default function MyListings() {
    const { user } = useAuth();
    const { jobs } = useData();
    const myJobs = jobs.filter((j) => j.employerId === user.id);
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="page">
            <div className="page-header">
                <h1>My Job Listings</h1>
                <p>Manage your posted job opportunities</p>
            </div>

            {myJobs.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't posted any jobs yet.</p>
                </div>
            ) : (
                <div className="listings-grid">
                    {myJobs.map((job) => {
                        const isExpired = job.deadline < today;
                        return (
                            <div key={job.id} className={`listing-card ${isExpired ? "listing-expired" : ""}`}>
                                {isExpired && (
                                    <div className="listing-expired-banner">
                                        <FiAlertTriangle /> Deadline Passed — This listing is no longer visible to students
                                    </div>
                                )}
                                <div className="listing-header">
                                    <h3>{job.title}</h3>
                                    <span className={`job-type-badge ${job.type === "Internship" ? "internship" : "fulltime"}`}>
                                        {job.type}
                                    </span>
                                </div>
                                <p className="listing-desc">{job.description}</p>
                                <div className="listing-meta">
                                    <span><FiMapPin /> {job.location}</span>
                                    <span><FiUsers /> {job.applicants} applicants</span>
                                    <span><FiCalendar /> Deadline: {job.deadline}</span>
                                </div>
                                <div className="listing-footer">
                                    <span className="salary-cell">{job.salary}</span>
                                    <span className={`status-badge ${isExpired ? "status-rejected" : "status-active"}`}>
                                        {isExpired ? "Expired" : "Active"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
