import { NavLink } from "react-router-dom";
import Topbar from "./Topbar";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Members", to: "/members" },
  { label: "Membership Plans", to: "/membership-plans" },
  { label: "Attendance", to: "/attendance" },
  { label: "Payments", to: "/payments" },
  { label: "Trainers", to: "/trainers" },
  { label: "Analytics", to: "/analytics" },
  { label: "Settings", to: "/settings" }
];

function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-mark">FP</div>
          <div className="logo-text">
            <span className="logo-name">FitPulse</span>
            <span className="logo-tagline">Gym Control Center</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                "nav-item" + (isActive ? " nav-item-active" : "")
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">FitPulse © {new Date().getFullYear()}</p>
        </div>
      </aside>
      <div className="main-column">
        <Topbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;

