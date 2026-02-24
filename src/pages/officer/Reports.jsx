import { useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { FiFilter, FiDownload } from "react-icons/fi";

export default function Reports() {
    const { localUsers } = useAuth();
    const { placements, applications, jobs } = useData();

    // Filter states
    const [filterBranch, setFilterBranch] = useState("all");
    const [filterCompany, setFilterCompany] = useState("all");
    const [filterYear, setFilterYear] = useState("all");
    const [filterPackage, setFilterPackage] = useState("all");

    // Memoize the filtered placements so stats map dynamically
    const filteredPlacements = useMemo(() => {
        return placements.filter((p) => {
            const salaryNum = parseInt(p.salary.replace(/[₹,]/g, "")) || 0;

            const matchBranch = filterBranch === "all" || p.department === filterBranch;
            const matchCompany = filterCompany === "all" || p.companyName === filterCompany;
            const matchYear = filterYear === "all" || p.year.toString() === filterYear;

            let matchPackage = true;
            if (filterPackage === "<8") matchPackage = salaryNum < 800000;
            if (filterPackage === "8-12") matchPackage = salaryNum >= 800000 && salaryNum <= 1200000;
            if (filterPackage === ">12") matchPackage = salaryNum > 1200000;

            return matchBranch && matchCompany && matchYear && matchPackage;
        });
    }, [filterBranch, filterCompany, filterYear, filterPackage]);

    const students = localUsers.filter((u) => u.role === "student");
    const totalStudents = students.length;
    const totalPlaced = filteredPlacements.length;
    const placementRate = totalStudents > 0 ? ((totalPlaced / totalStudents) * 100).toFixed(1) : 0;

    // Derived distinct values for filters
    const branches = [...new Set(placements.map(p => p.department))];
    const companies = [...new Set(placements.map(p => p.companyName))];
    const years = [...new Set(placements.map(p => p.year))].sort((a, b) => b - a);

    // Dynamic Summaries based on filters
    const deptSummary = {};
    const companySummary = {};
    const yearSummary = {};
    const salaryRanges = { "< ₹8L": 0, "₹8L - ₹12L": 0, "> ₹12L": 0 };

    filteredPlacements.forEach((p) => {
        // Dept
        if (!deptSummary[p.department]) deptSummary[p.department] = { placed: 0, totalSalary: 0 };
        deptSummary[p.department].placed += 1;

        // Salary
        const salaryNum = parseInt(p.salary.replace(/[₹,]/g, "")) || 0;
        deptSummary[p.department].totalSalary += salaryNum;
        if (salaryNum < 800000) salaryRanges["< ₹8L"] += 1;
        else if (salaryNum <= 1200000) salaryRanges["₹8L - ₹12L"] += 1;
        else salaryRanges["> ₹12L"] += 1;

        // Company
        if (!companySummary[p.companyName]) companySummary[p.companyName] = 0;
        companySummary[p.companyName] += 1;

        // Year
        if (!yearSummary[p.year]) yearSummary[p.year] = 0;
        yearSummary[p.year] += 1;
    });

    // Static data not affected by placement filters
    const statusDist = { applied: 0, under_review: 0, shortlisted: 0, interview_scheduled: 0, selected: 0, rejected: 0 };
    applications.forEach((a) => {
        statusDist[a.status] = (statusDist[a.status] || 0) + 1;
    });

    const statusColors = {
        applied: "#f59e0b",
        under_review: "#8b5cf6",
        shortlisted: "#3b82f6",
        interview_scheduled: "#0ea5e9",
        selected: "#10b981",
        rejected: "#ef4444",
    };

    // Calculate Skills in Demand
    const skillDensity = {};
    jobs.forEach((job) => {
        if (job.requirements && Array.isArray(job.requirements)) {
            job.requirements.forEach((skill) => {
                skillDensity[skill] = (skillDensity[skill] || 0) + 1;
            });
        }
    });

    const topSkills = Object.entries(skillDensity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const handleExport = () => {
        alert("Report exported heavily as CSV!");
    };

    return (
        <div className="page">
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1>Custom Reports & Analytics</h1>
                    <p>Generate highly customizable placement reports and insights</p>
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    <FiDownload /> Export CSV
                </button>
            </div>

            {/* Custom Filters Component */}
            <div className="card" style={{ marginBottom: "24px", background: "var(--bg-secondary)" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
                    <FiFilter color="var(--accent-primary)" size={20} />
                    <h3 style={{ fontSize: "1.1rem" }}>Advanced Filters</h3>
                </div>
                <div className="filters-bar" style={{ marginBottom: 0 }}>
                    <select className="filter-select" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select className="filter-select" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
                        <option value="all">All Companies</option>
                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                        <option value="all">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    <select className="filter-select" value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)}>
                        <option value="all">All Packages</option>
                        <option value="<8">Below 8 LPA</option>
                        <option value="8-12">8 LPA - 12 LPA</option>
                        <option value=">12">Above 12 LPA</option>
                    </select>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="report-summary-grid">
                <div className="report-summary-card">
                    <h3>{totalStudents}</h3>
                    <p>Registered Students</p>
                </div>
                <div className="report-summary-card">
                    <h3>{totalPlaced}</h3>
                    <p>Placements (Filtered)</p>
                </div>
                <div className="report-summary-card highlight" style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,201,167,0.1))" }}>
                    <h3>{placementRate}%</h3>
                    <p>Placement Rate (vs Total)</p>
                </div>
                <div className="report-summary-card">
                    <h3>{jobs.length}</h3>
                    <p>Active Companies/Jobs</p>
                </div>
            </div>

            <div className="reports-grid">
                {/* Department Report */}
                <div className="card">
                    <h2 className="card-title">Department-wise Placements</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Placed</th>
                                    <th>Avg Package</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(deptSummary).map(([dept, data]) => (
                                    <tr key={dept}>
                                        <td>{dept}</td>
                                        <td>{data.placed}</td>
                                        <td className="salary-cell">
                                            ₹{(data.totalSalary / data.placed).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salary Distribution */}
                <div className="card">
                    <h2 className="card-title">Salary Distribution</h2>
                    <div className="salary-dist">
                        {Object.entries(salaryRanges).map(([range, count]) => (
                            <div key={range} className="salary-dist-item">
                                <div className="salary-dist-info">
                                    <span>{range}</span>
                                    <span className="salary-dist-count">{count} students</span>
                                </div>
                                <div className="salary-dist-bar-bg">
                                    <div
                                        className="salary-dist-bar-fill"
                                        style={{ width: `${(count / totalPlaced) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Company Report */}
                <div className="card">
                    <h2 className="card-title">Company-wise Hiring</h2>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Students Hired</th>
                                    <th>Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(companySummary)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([company, count]) => (
                                        <tr key={company}>
                                            <td>{company}</td>
                                            <td>{count}</td>
                                            <td>{((count / totalPlaced) * 100).toFixed(0)}%</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Application Status */}
                <div className="card">
                    <h2 className="card-title">Application Status Distribution</h2>
                    <div className="status-dist">
                        {Object.entries(statusDist).map(([status, count]) => (
                            <div key={status} className="status-dist-item">
                                <div
                                    className="status-dist-bar"
                                    style={{
                                        width: `${(count / (applications.length || 1)) * 100}%`,
                                        backgroundColor: statusColors[status],
                                    }}
                                ></div>
                                <span className="status-dist-label">
                                    {status.charAt(0).toUpperCase() + status.slice(1)}: {count} ({((count / (applications.length || 1)) * 100).toFixed(0)}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Skills in Demand */}
                <div className="card">
                    <h2 className="card-title">Top Skills in Demand</h2>
                    <div className="skills-demand">
                        {topSkills.map(([skill, count]) => (
                            <div key={skill} className="skill-demand-item">
                                <span className="skill-tag">{skill}</span>
                                <div className="skill-demand-bar-bg">
                                    <div
                                        className="skill-demand-bar-fill"
                                        style={{ width: `${(count / topSkills[0][1]) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="skill-demand-count">{count} jobs</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Year-wise */}
                <div className="card">
                    <h2 className="card-title">Year-wise Placement Trend</h2>
                    <div className="year-trend">
                        {Object.entries(yearSummary)
                            .sort((a, b) => a[0] - b[0])
                            .map(([year, count]) => (
                                <div key={year} className="year-trend-item">
                                    <div className="year-trend-bar" style={{ height: `${count * 40}px` }}>
                                        <span className="year-trend-count">{count}</span>
                                    </div>
                                    <span className="year-trend-label">{year}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
