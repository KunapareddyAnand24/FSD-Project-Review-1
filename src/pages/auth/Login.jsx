import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiBriefcase, FiMail, FiLock, FiLogIn, FiCheckCircle } from "react-icons/fi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            const result = login(email, password);
            if (result.success) {
                const roleRedirects = {
                    admin: "/admin",
                    student: "/student",
                    employer: "/employer",
                    officer: "/officer",
                };
                navigate(roleRedirects[result.user.role] || "/");
            } else {
                setError(result.message);
            }
            setLoading(false);
        }, 500);
    };

    const demoCredentials = [
        { label: "Admin", email: "admin@placement.com", password: "admin123" },
        { label: "Student", email: "rahul@student.com", password: "student123" },
        { label: "Employer", email: "hr@google.com", password: "employer123" },
        { label: "Officer", email: "meena@officer.com", password: "officer123" },
    ];

    return (
        <div className="auth-page split-layout">
            {/* Left Panel - Illustration/Brand */}
            <div className="auth-panel-left">
                <div className="panel-content">
                    <Link to="/" className="brand-logo-white">
                        <FiBriefcase className="brand-icon-white" />
                        <span>SKILLSHALA</span>
                    </Link>
                    <div className="brand-messaging">
                        <h2>Accelerate Your Career Journey</h2>
                        <p>Join millions of students and top employers on India's most trusted placement network.</p>

                        <ul className="brand-features">
                            <li><FiCheckCircle className="feature-icon" /> AI-powered job matching</li>
                            <li><FiCheckCircle className="feature-icon" /> Real-time application tracking</li>
                            <li><FiCheckCircle className="feature-icon" /> Direct messaging with recruiters</li>
                        </ul>
                    </div>
                    <div className="floating-elements">
                        <div className="float-card card-1"><div className="sk p1"></div></div>
                        <div className="float-card card-2"><div className="sk p2"></div></div>
                        <div className="float-card card-3"><div className="sk p3"></div></div>
                    </div>
                </div>
                <div className="auth-glow-bg"></div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="auth-panel-right">
                <div className="auth-form-container">
                    <div className="auth-header-mobile">
                        <FiBriefcase className="auth-logo" />
                        <h1>SKILLSHALA</h1>
                        <p>Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form-v2">
                        <h2>Sign in to your account</h2>
                        <p className="form-subtitle">Welcome back! Please enter your details.</p>

                        {error && <div className="auth-error animate-shake">{error}</div>}

                        <div className="form-group-v2">
                            <label htmlFor="email">Email address</label>
                            <div className="input-with-icon">
                                <FiMail className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group-v2">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <FiLock className="input-icon" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember for 30 days
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                            {loading ? <span className="loader"></span> : "Sign In"}
                        </button>

                        <p className="auth-link-v2">
                            Don't have an account? <Link to="/register">Sign up</Link>
                        </p>
                    </form>

                    <div className="demo-credentials-v2">
                        <p className="divider-text"><span>Demo Credentials</span></p>
                        <div className="demo-grid-v2">
                            {demoCredentials.map((cred) => (
                                <button
                                    key={cred.label}
                                    className="demo-badge"
                                    onClick={() => {
                                        setEmail(cred.email);
                                        setPassword(cred.password);
                                    }}
                                >
                                    <span className="demo-role">{cred.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
