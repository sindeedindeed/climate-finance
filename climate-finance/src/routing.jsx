import App from "./pages/App.jsx";
import {Route, Routes} from "react-router";

const Routing = ()=>{
    return (
        <>
            <Routes>
                <Route path={'/'} element={<App/>}></Route>
            </Routes>
        </>
    );
}
export default Routing