import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer, Zoom } from "react-toastify";

const App = () => {
    return (
        <Router>
            <AppRoutes />
            <ToastContainer
                transition={Zoom}
                hideProgressBar
                autoClose={1000}
            />
        </Router>
    );
};

export default App;
