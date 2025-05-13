import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin.jsx";
import AdminResetPassword from "./AdminResetPassword.jsx";
import AdminHome from "./AdminHome.jsx";
import Announcement from "../Announcement/Announcement.jsx";
import PrivateRoute from "../routes/PrivateRoute.jsx";

export default function AdminApp() {
  return (
    <Routes>
      {/* public admin pages */}
      <Route path="login"          element={<AdminLogin />} />
      <Route path="reset-password" element={<AdminResetPassword />} />

      {/* protected admin pages */}
      <Route
        path="home"
        element={
          <PrivateRoute>
            <AdminHome />
          </PrivateRoute>
        }
      />
      <Route
        path="announcement"
        element={
          <PrivateRoute>
            <Announcement />
          </PrivateRoute>
        }
      />

      anything else → back to login
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
