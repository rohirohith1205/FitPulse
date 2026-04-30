import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = async () => {
    try {
      await logout();
    } catch(err) {
      // ignore
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search members, plans, invoices..."
          />
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-button" aria-label="Notifications">
          <span className="notification-dot" />
          🔔
        </button>
        <div className="divider-vertical" />
        <div className="profile-chip">
          <div className="avatar">{user?.name ? user.name[0].toUpperCase() : 'U'}</div>
          <div className="profile-meta">
            <span className="profile-name">{user?.name || 'User'}</span>
            <span className="profile-role">{user?.role || 'Staff'}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="button button-outline" style={{marginLeft: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
