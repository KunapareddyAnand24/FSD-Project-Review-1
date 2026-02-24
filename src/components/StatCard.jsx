export default function StatCard({ icon, label, value, color }) {
    return (
        <div className="stat-card" style={{ borderLeftColor: color || "#6c63ff" }}>
            <div className="stat-icon" style={{ color: color || "#6c63ff" }}>
                {icon}
            </div>
            <div className="stat-content">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}
