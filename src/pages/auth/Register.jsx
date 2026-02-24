import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiBriefcase, FiMail, FiLock, FiUser, FiCheckCircle, FiBook } from "react-icons/fi";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        university: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("role") === "employer") {
            setForm((prev) => ({ ...prev, role: "employer" }));
        }
    }, [location]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const extra = form.role === "student" ? { university: form.university } : {};
            const result = register(form.name, form.email, form.password, form.role, extra);
            if (result.success) {
                navigate("/login");
            } else {
                setError(result.message);
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="auth-page split-layout">
            {/* Left Panel - Illustration/Brand */}
            <div className="auth-panel-left auth-panel-register">
                <div className="panel-content">
                    <Link to="/" className="brand-logo-white">
                        <FiBriefcase className="brand-icon-white" />
                        <span>SKILLSHALA</span>
                    </Link>
                    <div className="brand-messaging">
                        <h2>Your Future Starts Here.</h2>
                        <p>Create an account to unlock exclusive opportunities and connect with top recruiters seamlessly.</p>

                        <ul className="brand-features">
                            <li><FiCheckCircle className="feature-icon" /> Personalized job recommendations</li>
                            <li><FiCheckCircle className="feature-icon" /> One-click remote applications</li>
                            <li><FiCheckCircle className="feature-icon" /> Exclusive masterclasses and courses</li>
                        </ul>
                    </div>
                    <div className="floating-elements">
                        <div className="float-card card-4"><div className="sk p4"></div></div>
                        <div className="float-card card-5"><div className="sk p5"></div></div>
                    </div>
                </div>
                <div className="auth-glow-bg-register"></div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="auth-panel-right">
                <div className="auth-form-container">
                    <div className="auth-header-mobile">
                        <FiBriefcase className="auth-logo" />
                        <h1>SKILLSHALA</h1>
                        <p>Create your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form-v2">
                        <h2>Create Account</h2>
                        <p className="form-subtitle">Let's get you set up with a SKILLSHALA account.</p>

                        {error && <div className="auth-error animate-shake">{error}</div>}

                        <div className="form-group-v2">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-with-icon">
                                <FiUser className="input-icon" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-v2">
                            <label htmlFor="email">Email address</label>
                            <div className="input-with-icon">
                                <FiMail className="input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row-auth">
                            <div className="form-group-v2">
                                <label>I am a</label>
                                <div className="role-selector" style={{ flexWrap: 'wrap', gap: '4px' }}>
                                    <button
                                        type="button"
                                        className={`role-btn ${form.role === 'admin' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'admin' })}
                                        style={{ minWidth: 'calc(50% - 4px)' }}
                                    >
                                        Admin
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'student' })}
                                        style={{ minWidth: 'calc(50% - 4px)' }}
                                    >
                                        Student
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${form.role === 'employer' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'employer' })}
                                        style={{ minWidth: 'calc(50% - 4px)' }}
                                    >
                                        Employer
                                    </button>
                                    <button
                                        type="button"
                                        className={`role-btn ${form.role === 'officer' ? 'active' : ''}`}
                                        onClick={() => setForm({ ...form, role: 'officer' })}
                                        style={{ minWidth: 'calc(50% - 4px)' }}
                                    >
                                        Officer
                                    </button>
                                </div>
                            </div>
                        </div>

                        {form.role === 'student' && (
                            <div className="form-row-auth">
                                <div className="form-group-v2">
                                    <label htmlFor="university">University / College</label>
                                    <div className="input-with-icon">
                                        <FiBook className="input-icon" />
                                        <input
                                            id="university"
                                            name="university"
                                            type="text"
                                            value={form.university}
                                            onChange={handleChange}
                                            placeholder="Enter your university or college"
                                            required={form.role === 'student'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-row-auth">
                            <div className="form-group-v2">
                                <label htmlFor="password">Password</label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group-v2">
                                <label htmlFor="confirmPassword">Confirm</label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? <span className="loader"></span> : "Create Account"}
                        </button>

                        <p className="auth-link-v2">
                            Already have an account? <Link to="/login">Sign in here</Link>
                        </p>
                    </form>

                    <div className="demo-credentials-v2">
                        <p className="divider-text"><span>Demo Register Data</span></p>
                        <div className="demo-grid-v2">
                            <button className="demo-badge" onClick={() => setForm({ name: "Admin Test", email: "admin2@placement.com", password: "password123", confirmPassword: "password123", role: "admin" })}>
                                <span className="demo-role">Admin</span>
                            </button>
                            <button className="demo-badge" onClick={() => setForm({ name: "Neha Sharma", email: "neha@student.com", password: "password123", confirmPassword: "password123", role: "student" })}>
                                <span className="demo-role">Student</span>
                            </button>
                            <button className="demo-badge" onClick={() => setForm({ name: "Google HR", email: "hr@google.com", password: "password123", confirmPassword: "password123", role: "employer" })}>
                                <span className="demo-role">Employer</span>
                            </button>
                            <button className="demo-badge" onClick={() => setForm({ name: "Arjun Officer", email: "arjun@officer.com", password: "password123", confirmPassword: "password123", role: "officer" })}>
                                <span className="demo-role">Officer</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
