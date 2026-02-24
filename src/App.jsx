import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import PlacementData from "./pages/admin/PlacementData";
import AdminProfile from "./pages/admin/AdminProfile";

// Public Pages
import LandingPage from "./pages/public/LandingPage";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ExploreJobs from "./pages/student/ExploreJobs";
import MyApplications from "./pages/student/MyApplications";
import StudentProfile from "./pages/student/StudentProfile";
import StudentCalendar from "./pages/student/StudentCalendar";

// Employer Pages
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import PostJob from "./pages/employer/PostJob";
import MyListings from "./pages/employer/MyListings";
import ReviewApplications from "./pages/employer/ReviewApplications";

// Officer Pages
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import PlacementRecords from "./pages/officer/PlacementRecords";
import Reports from "./pages/officer/Reports";

// Shared Pages
import Messages from "./pages/shared/Messages";

function RootRoute() {
  const { user } = useAuth();
  if (!user) return <LandingPage />;

  const routes = {
    admin: "/admin",
    student: "/student",
    employer: "/employer",
    officer: "/officer",
  };
  return <Navigate to={routes[user.role] || "/login"} replace />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<RootRoute />} />

              {/* Admin Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/placements" element={<PlacementData />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
              </Route>

              {/* Student Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/jobs" element={<ExploreJobs />} />
                <Route path="/student/applications" element={<MyApplications />} />
                <Route path="/student/messages" element={<Messages />} />
                <Route path="/student/calendar" element={<StudentCalendar />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </Route>

              {/* Employer Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["employer"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/employer" element={<EmployerDashboard />} />
                <Route path="/employer/post-job" element={<PostJob />} />
                <Route path="/employer/listings" element={<MyListings />} />
                <Route path="/employer/applications" element={<ReviewApplications />} />
                <Route path="/employer/messages" element={<Messages />} />
              </Route>

              {/* Officer Routes */}
              <Route
                element={
                  <ProtectedRoute allowedRoles={["officer"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/officer" element={<OfficerDashboard />} />
                <Route path="/officer/records" element={<PlacementRecords />} />
                <Route path="/officer/reports" element={<Reports />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
