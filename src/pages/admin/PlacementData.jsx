import { useState } from "react";
import { useData } from "../../contexts/DataContext";

export default function PlacementData() {
    const { placements } = useData();
    const [yearFilter, setYearFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");

    const years = [...new Set(placements.map((p) => p.year))].sort((a, b) => b - a);
    const departments = [...new Set(placements.map((p) => p.department))];

    const filtered = placements.filter((p) => {
        const matchYear = yearFilter === "all" || p.year === parseInt(yearFilter);
        const matchDept = deptFilter === "all" || p.department === deptFilter;
        return matchYear && matchDept;
    });

    return (
        <div className="page">
            <div className="page-header">
                <h1>Placement Data</h1>
                <p>View all placement records</p>
            </div>

            <div className="filters-bar">
                <select
                    className="filter-select"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                >
                    <option value="all">All Years</option>
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <select
                    className="filter-select"
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                >
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
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-row">No records found</td>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
