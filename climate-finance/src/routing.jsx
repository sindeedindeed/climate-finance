import LandingPage from "./pages/LandingPage.jsx";
import FundingSources from "./pages/FundingSources.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProjects from "./pages/AdminProjects.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminFundingSources from "./pages/AdminFundingSources.jsx";
import AdminFundingSourceAdd from "./pages/AdminFundingSourceAdd.jsx";
import AdminFundingSourceEdit from "./pages/AdminFundingSourceEdit.jsx";
import AdminProjectAdd from "./pages/AdminProjectAdd.jsx";
import AdminProjectEdit from "./pages/AdminProjectEdit.jsx";
import AdminUserAdd from "./pages/AdminUserAdd.jsx";
import AdminUserEdit from "./pages/AdminUserEdit.jsx";
import AdminAgencies from "./pages/AdminAgencies.jsx";
import AdminAgencyAdd from "./pages/AdminAgencyAdd.jsx";
import AdminAgencyEdit from "./pages/AdminAgencyEdit.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Protected Route Component for Admin Routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    children
  );
};

const Routing = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path={"/"} element={<LandingPage />} />
        <Route path={"/funding-sources"} element={<FundingSources />} />
        <Route path={"/projects"} element={<Projects />} />
        <Route path={"/projects/:projectId"} element={<ProjectDetails />} />

        {/* Admin Authentication Route */}
        <Route
          path={"/admin/login"}
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path={"/admin/dashboard"}
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Project Management Routes */}
        <Route
          path={"/admin/projects"}
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/projects/add"}
          element={
            <ProtectedRoute>
              <AdminProjectAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/projects/edit/:projectId"}
          element={
            <ProtectedRoute>
              <AdminProjectEdit />
            </ProtectedRoute>
          }
        />

        {/* User Management Routes */}
        <Route
          path={"/admin/users"}
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/users/add"}
          element={
            <ProtectedRoute>
              <AdminUserAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/users/edit/:userId"}
          element={
            <ProtectedRoute>
              <AdminUserEdit />
            </ProtectedRoute>
          }
        />

        {/* Funding Sources Management Routes */}
        <Route
          path={"/admin/funding-sources"}
          element={
            <ProtectedRoute>
              <AdminFundingSources />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/funding-sources/add"}
          element={
            <ProtectedRoute>
              <AdminFundingSourceAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/funding-sources/edit/:sourceId"}
          element={
            <ProtectedRoute>
              <AdminFundingSourceEdit />
            </ProtectedRoute>
          }
        />

        {/* Agency Management Routes */}
        <Route
          path={"/admin/agencies"}
          element={
            <ProtectedRoute>
              <AdminAgencies />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/agencies/add"}
          element={
            <ProtectedRoute>
              <AdminAgencyAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path={"/admin/agencies/edit/:agencyId"}
          element={
            <ProtectedRoute>
              <AdminAgencyEdit />
            </ProtectedRoute>
          }
        />

        {/* Admin redirect route */}
        <Route
          path={"/admin"}
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default Routing;
