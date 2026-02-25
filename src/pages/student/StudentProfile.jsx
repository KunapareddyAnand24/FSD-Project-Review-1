import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FiUser, FiMail, FiBook, FiAward, FiSave, FiUpload, FiFileText } from "react-icons/fi";

export default function StudentProfile() {
    const { user, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user.name || "",
        university: user.university || "",
        department: user.department || "",
        gpa: user.gpa || "",
        graduationYear: user.graduationYear || "",
        skills: (user.skills || []).join(", "),
        profileImage: user.profileImage || null,
        resumeFile: user.resumeFile || null,
    });
    const [saved, setSaved] = useState(false);
    const photoInputRef = useRef(null);
    const resumeInputRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Store base64 encoded document
                setForm(prev => ({ ...prev, resumeFile: { name: file.name, data: reader.result } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateProfile({
            ...form,
            gpa: parseFloat(form.gpa),
            graduationYear: parseInt(form.graduationYear),
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>View and edit your profile information</p>
            </div>

            <div className="profile-card">
                <div className="profile-avatar-large">
                    {form.profileImage || user.profileImage ? (
                        <img
                            src={form.profileImage || user.profileImage}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        user.avatar
                    )}
                </div>
                <div className="profile-info">
                    {!editing ? (
                        <>
                            <div className="profile-field">
                                <FiUser /> <strong>Name:</strong> {user.name}
                            </div>
                            <div className="profile-field">
                                <FiMail /> <strong>Email:</strong> {user.email}
                            </div>
                            <div className="profile-field">
                                <FiBook /> <strong>University/College:</strong> {user.university || "Not set"}
                            </div>
                            <div className="profile-field">
                                <FiBook /> <strong>Department:</strong> {user.department || "Not set"}
                            </div>
                            <div className="profile-field">
                                <FiAward /> <strong>GPA:</strong> {user.gpa || "Not set"}
                            </div>
                            <div className="profile-field">
                                <strong>Graduation Year:</strong> {user.graduationYear || "Not set"}
                            </div>
                            <div className="profile-field">
                                <strong>Skills:</strong>
                                <div className="profile-skills">
                                    {(user.skills || []).map((skill) => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="profile-field">
                                <strong>Resume:</strong> {user.resumeFile ? (
                                    <a href={user.resumeFile.data} download={user.resumeFile.name} className="btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                        <FiFileText /> {user.resumeFile.name}
                                    </a>
                                ) : "Not uploaded"}
                            </div>
                            <button className="btn btn-primary" onClick={() => setEditing(true)}>
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <div className="edit-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input name="name" value={form.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>University/College Name</label>
                                <input name="university" value={form.university} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input name="department" value={form.department} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>GPA</label>
                                <input name="gpa" type="number" step="0.1" value={form.gpa} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Graduation Year</label>
                                <input name="graduationYear" type="number" value={form.graduationYear} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Skills (comma separated)</label>
                                <input name="skills" value={form.skills} onChange={handleChange} />
                            </div>

                            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Profile Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={photoInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoUpload}
                                    />
                                    <button type="button" className="btn btn-outline btn-block" onClick={() => photoInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <FiUpload /> {form.profileImage ? "Change Photo" : "Upload Photo"}
                                    </button>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Resume (PDF)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        ref={resumeInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleResumeUpload}
                                    />
                                    <button type="button" className="btn btn-outline btn-block" onClick={() => resumeInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <FiUpload /> {form.resumeFile ? "Change Resume" : "Upload Resume"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={handleSave}>
                                    <FiSave /> Save Changes
                                </button>
                                <button className="btn btn-outline" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                    {saved && <div className="success-message">Profile updated successfully!</div>}
                </div>
            </div>
        </div>
    );
}
