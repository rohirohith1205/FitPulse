import Card from "../components/ui/Card";

function Settings() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure FitPulse branding, preferences, and notification rules.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <Card title="Branding">
          <div className="form-grid">
            <div className="form-field">
              <label className="label">Gym Name</label>
              <input className="input" type="text" defaultValue="FitPulse HQ" />
            </div>
            <div className="form-field">
              <label className="label">Primary Accent Color</label>
              <input className="input" type="color" defaultValue="#22c55e" />
            </div>
          </div>
          <button className="btn btn-primary">Save Branding</button>
        </Card>

        <Card title="Notifications">
          <div className="form-grid">
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Email summary of daily attendance</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Alert when memberships are expiring</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" />
              <span>Notify on failed payments</span>
            </label>
          </div>
          <button className="btn btn-outline">Save Notification Rules</button>
        </Card>
      </div>
    </div>
  );
}

export default Settings;

