import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { ToastContainer } from "./NotificationBell";

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-body">
                <Sidebar />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
            <ToastContainer />
        </div>
    );
}
