import { Link } from "react-router-dom";
import { FiSend, FiSearch, FiChevronDown } from "react-icons/fi";

export default function PublicNavbar() {
    return (
        <>
            <div className="public-top-banner">
                Upskill and land your dream career - Limited period offer! <a href="#">Know More</a>
            </div>
            <nav className="public-navbar">
                <div className="public-navbar-container">
                    <div className="public-navbar-left">
                        <Link to="/" className="public-brand">
                            <FiSend className="public-brand-icon" />
                            <span>SKILLSHALA</span>
                        </Link>
                        <div className="public-nav-links">
                            <div className="public-nav-dropdown">
                                Jobs <FiChevronDown />
                            </div>
                            <div className="public-nav-dropdown">
                                Internships <FiChevronDown />
                            </div>
                            <div className="public-nav-dropdown">
                                Courses <span className="offer-badge">OFFER</span> <FiChevronDown />
                            </div>
                        </div>
                    </div>

                    <div className="public-navbar-right">
                        <div className="public-search-wrapper">
                            <FiSearch className="public-search-icon" />
                            <input type="text" placeholder="Search" className="public-search-input" />
                        </div>
                        <Link to="/login" className="btn-public-login">Login</Link>
                        <Link to="/register" className="btn-public-register">Candidate Sign up</Link>
                        <div className="divider-vertical"></div>
                        <Link to="/register?role=employer" className="btn-public-employer">
                            Employer sign up <span className="arrow-right">›</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
