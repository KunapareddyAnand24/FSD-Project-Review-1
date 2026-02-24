import { Link } from "react-router-dom";
import { FiTrendingUp, FiBriefcase, FiAward, FiUsers, FiSend } from "react-icons/fi";

export default function LandingPage() {
    return (
        <div className="landing-fullpage">
            <nav className="landing-nav">
                <div className="brand-logo">
                    <FiSend className="brand-icon" />
                    <span>SKILLSHALA</span>
                </div>
            </nav>

            <div className="landing-content">
                <div className="landing-text">
                    <h1 className="landing-title">Launch Your <span className="text-gradient">Dream Career</span></h1>
                    <p className="landing-desc">
                        India's most trusted placement platform. Get access to top companies, exclusive offers, and real-time application tracking.
                    </p>

                    <div className="landing-actions">
                        <Link to="/login" className="btn btn-primary btn-large">Log In</Link>
                        <Link to="/register" className="btn btn-outline btn-large">Sign Up</Link>
                    </div>
                </div>

                <div className="landing-stats">
                    <div className="stat-glass-card">
                        <div className="stat-icon-wrapper success-bg">
                            <FiTrendingUp />
                        </div>
                        <div className="stat-info">
                            <h3>94%</h3>
                            <p>Current Success Percentage</p>
                        </div>
                    </div>

                    <div className="stat-glass-card">
                        <div className="stat-icon-wrapper warning-bg">
                            <FiBriefcase />
                        </div>
                        <div className="stat-info">
                            <h3>500+</h3>
                            <p>Companies Tied Up</p>
                        </div>
                    </div>

                    <div className="stat-glass-card">
                        <div className="stat-icon-wrapper info-bg">
                            <FiAward />
                        </div>
                        <div className="stat-info">
                            <h3>10,000+</h3>
                            <p>Active Job Offers</p>
                        </div>
                    </div>

                    <div className="stat-glass-card">
                        <div className="stat-icon-wrapper accent-bg">
                            <FiUsers />
                        </div>
                        <div className="stat-info">
                            <h3>50L+</h3>
                            <p>Registered Students</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Scrolling Company Logos */}
            <div className="landing-companies">
                <p className="companies-title">Trusted by 500+ top companies worldwide</p>
                <div className="marquee">
                    <div className="marquee-content">
                        {/* Duplicated for infinite scroll effect */}
                        {[1, 2].map((group) => (
                            <div key={group} className="marquee-group">
                                {[
                                    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
                                    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
                                    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
                                    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
                                    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
                                    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
                                    { name: "Coca-Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" },
                                    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
                                    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
                                    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
                                    { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
                                    { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" }
                                ].map((company, idx) => (
                                    <div key={idx} className="company-logo-wrapper">
                                        <img src={company.logo} alt={company.name} className="company-logo" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="shape-glow-1"></div>
            <div className="shape-glow-2"></div>
        </div>
    );
}
