import LandingPage from "./pages/LandingPage.jsx";
import FundingSources from "./pages/FundingSources.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import { Route, Routes, Navigate } from "react-router-dom";

const Routing = () => {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<LandingPage />} />
                <Route path={'/funding-sources'} element={<FundingSources />} />
                <Route path={'/projects'} element={<Projects />} />
                <Route path={'/projects/:projectId'} element={<ProjectDetails />} />
                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};
export default Routing;