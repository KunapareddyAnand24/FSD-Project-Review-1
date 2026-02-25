import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ApplicationTable from "../../components/ApplicationTable";
import { useData } from "../../contexts/DataContext";
import { useNotifications } from "../../contexts/NotificationContext";

export default function ReviewApplications() {
    const { user } = useAuth();
    const { addNotification } = useNotifications();

    const { jobs, applications, updateApplicationStatus } = useData();
    const myJobIds = jobs.filter((j) => j.employerId === user.id).map((j) => j.id);
    const myApplications = applications.filter((a) => myJobIds.includes(a.jobId));
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = statusFilter === "all" ? myApplications : myApplications.filter((a) => a.status === statusFilter);

    const handleUpdateStatus = (appId, newStatus, extraData = {}) => {
        const appToUpdate = myApplications.find(a => a.id === appId);

        // Use DataContext helper function to persist status change with extra data (date/time)
        updateApplicationStatus(appId, newStatus, extraData);

        // Trigger Notification based on status
        if (newStatus === "selected" && appToUpdate) {
            addNotification({
                type: "success",
                title: "Offer Letter Received! 🎉",
                message: `Congratulations! ${appToUpdate.companyName} has selected you for the ${appToUpdate.jobTitle} position. Check your email for next steps.`,
                role: "student",
                userId: appToUpdate.studentId,
            });
        }

        if (newStatus === "interview_scheduled" && appToUpdate) {
            addNotification({
                type: "info",
                title: "Interview Scheduled! 📅",
                message: `Your interview for ${appToUpdate.jobTitle} at ${appToUpdate.companyName} has been scheduled for ${extraData.interviewDate || 'a soon-to-be-confirmed date'} at ${extraData.interviewTime || 'TBD'}.`,
                role: "student",
                userId: appToUpdate.studentId,
            });
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Review Applications</h1>
                <p>Manage candidates for your job listings</p>
            </div>

            <div className="filters-bar">
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <ApplicationTable
                applications={filtered}
                showActions={true}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
}
