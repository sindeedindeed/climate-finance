import LandingPage from "./pages/LandingPage.jsx";
import FundingSources from "./pages/FundingSources.jsx";
import { Route, Routes } from "react-router-dom";

const Routing = () => {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<LandingPage />} />
                <Route path={'/funding-sources'} element={<FundingSources />} />
            </Routes>
        </>
    );
};
export default Routing;