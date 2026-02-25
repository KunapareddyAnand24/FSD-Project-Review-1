import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { FiPlusCircle } from "react-icons/fi";
import { hasSkillMatch } from "../../utils/skillMatcher";

export default function PostJob() {
    const { user, localUsers } = useAuth();
    const { addJob } = useData();
    const { addNotification } = useNotifications();
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        type: "Full-time",
        salary: "",
        requirements: "",
        department: "",
        openings: 1,
        deadline: "",
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requirementsArray = form.requirements.split(",").map((r) => r.trim()).filter(Boolean);
        const newJob = {
            id: Date.now(),
            employerId: user.id,
            companyName: user.companyName || user.name,
            ...form,
            openings: parseInt(form.openings),
            requirements: requirementsArray,
            status: "active",
            postedAt: new Date().toISOString().split("T")[0],
            applicants: 0,
        };
        addJob(newJob);

        // Notify matching students
        localUsers.forEach(u => {
            if (u.role === "student" && hasSkillMatch(u.skills, requirementsArray)) {
                addNotification({
                    type: "info",
                    title: "New Job Match! 🚀",
                    message: `${newJob.companyName} is looking for a ${newJob.title}. Matches your skills!`,
                    role: "student",
                    userId: u.id,
                });
            }
        });

        setSuccess(true);
        setForm({
            title: "",
            description: "",
            location: "",
            type: "Full-time",
            salary: "",
            requirements: "",
            department: "",
            openings: 1,
            deadline: "",
        });
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Post a New Job</h1>
                <p>Create a new job listing for students</p>
            </div>

            {success && (
                <div className="success-message">
                    Job posted successfully! Students can now view and apply.
                </div>
            )}

            <div className="card form-card">
                <form onSubmit={handleSubmit} className="post-job-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Job Title *</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Computer Science" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe the role and responsibilities..." required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location *</label>
                            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, India" required />
                        </div>
                        <div className="form-group">
                            <label>Job Type</label>
                            <select name="type" value={form.type} onChange={handleChange}>
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Salary / Stipend *</label>
                            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹8,00,000 - ₹12,00,000" required />
                        </div>
                        <div className="form-group">
                            <label>Openings</label>
                            <input name="openings" type="number" min="1" value={form.openings} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Requirements (comma separated)</label>
                        <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="e.g. React, JavaScript, CSS, Git" />
                    </div>

                    <div className="form-group">
                        <label>Application Deadline *</label>
                        <input name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <FiPlusCircle /> Post Job
                    </button>
                </form>
            </div>
        </div>
    );
}
