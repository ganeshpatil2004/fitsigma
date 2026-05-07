import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Login          from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Signup         from "./pages/Signup";
import Dashboard      from "./pages/Dashboard";
import Customer       from "./pages/Customer";
import Trainer        from "./pages/Trainer";
import Payment        from "./pages/Payment";
import Attendance     from "./pages/Attendance";
import Report         from "./pages/Report";
import GymEnquiries   from "./pages/GymEnquiries";
import History        from "./pages/History";
import MyProfile      from "./pages/MyProfile";   // ← new
import Settings       from "./pages/Settings";    // ← new

const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/"                element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/signup"          element={<Signup />} />

      {/* Main App */}
      <Route path="/dashboard"       element={<Dashboard />} />
      <Route path="/customer"        element={<Customer />} />
      <Route path="/trainer"         element={<Trainer />} />
      <Route path="/payment"         element={<Payment />} />
      <Route path="/attendance"      element={<Attendance />} />
      <Route path="/report"          element={<Report />} />
      <Route path="/gym-enquiries"   element={<GymEnquiries />} />
      <Route path="/history"         element={<History />} />

      {/* Profile & Settings */}
      <Route path="/profile"         element={<MyProfile />} />  {/* ← new */}
      <Route path="/settings"        element={<Settings />} />   {/* ← new */}
    </Routes>
  );
};

export default App;