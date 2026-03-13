function Topbar() {
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
          <div className="avatar">A</div>
          <div className="profile-meta">
            <span className="profile-name">Admin</span>
            <span className="profile-role">Gym Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;

