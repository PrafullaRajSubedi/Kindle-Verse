import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/adminLogin/adminLogin.jsx";
import AdminHome from "./pages/adminHome/adminHome.jsx";
import Sales from "./pages/Sales/sales.jsx";
import Announcement from "./pages/Announcement/Announcement.jsx";
import AdminResetPassword from "./pages/AdminResetPassword/AdminResetPassword.jsx";
import StaffPanel from "./pages/StaffPanel/staffPanel.jsx";
import StaffLogin from "./pages/StaffLogin/staffLogin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StaffLogin />} />
      <Route path="/staff-panel" element={<StaffPanel />} />
    </Routes>
  );
}
export default App;
