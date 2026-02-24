import { useState } from "react";
import { useData } from "../../contexts/DataContext";

export default function PlacementRecords() {
    const { placements } = useData();
    const [yearFilter, setYearFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const years = [...new Set(placements.map((p) => p.year))].sort((a, b) => b - a);
    const departments = [...new Set(placements.map((p) => p.department))];

    const filtered = placements.filter((p) => {
        const matchYear = yearFilter === "all" || p.year === parseInt(yearFilter);
        const matchDept = deptFilter === "all" || p.department === deptFilter;
        const matchSearch =
            p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchYear && matchDept && matchSearch;
    });

    return (
        <div className="page">
            <div className="page-header">
                <h1>Placement Records</h1>
                <p>Complete history of student placements</p>
            </div>

            <div className="filters-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search student or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="filter-select" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                    <option value="all">All Years</option>
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <select className="filter-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                    <option value="all">All Departments</option>
                    {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Department</th>
                            <th>Company</th>
                            <th>Job Title</th>
                            <th>Package</th>
                            <th>Placed On</th>
                            <th>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">No records found</td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.studentName}</td>
                                    <td>{p.department}</td>
                                    <td>{p.companyName}</td>
                                    <td>{p.jobTitle}</td>
                                    <td className="salary-cell">{p.salary}</td>
                                    <td>{p.placedAt}</td>
                                    <td>{p.year}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
