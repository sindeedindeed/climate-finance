import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from "./routing.jsx";
import {BrowserRouter} from "react-router";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routing/>
        </BrowserRouter>
    </StrictMode>,
);

