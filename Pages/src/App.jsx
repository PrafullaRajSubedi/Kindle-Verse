import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/adminLogin/adminLogin.jsx";
import AdminHome from "./pages/adminHome/adminHome.jsx";
import Sales from "./pages/Sales/sales.jsx";
import Announcement from "./pages/Announcement/Announcement.jsx";
import AdminResetPassword from "./pages/AdminResetPassword/AdminResetPassword.jsx";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            {/* Protected Routes (Requires JWT Token) */}
            <Route
                path="/admin/home"
                element={
                    <PrivateRoute>
                        <AdminHome />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/sales"
                element={
                    <PrivateRoute>
                        <Sales />
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/announcement"
                element={
                    <PrivateRoute>
                        <Announcement />
                    </PrivateRoute>
                }
            />

            {/* Redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
    );
}

export default App;
