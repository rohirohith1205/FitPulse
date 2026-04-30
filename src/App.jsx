import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MembershipPlans from "./pages/MembershipPlans";
import Payments from "./pages/Payments";
import Trainers from "./pages/Trainers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/membership-plans" element={<MembershipPlans />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
