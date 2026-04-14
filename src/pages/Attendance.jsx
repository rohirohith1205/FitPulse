import Card from "../components/ui/Card";

function Attendance() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Track daily check-ins and member presence.</p>
        </div>
        <div className="page-header-actions">
          <input className="input" type="date" />
        </div>
      </div>

      <div className="attendance-layout">
        <Card title="Live Check-ins">
          <div>No attendance data yet. Add an attendance/check-in API to enable this view.</div>
        </Card>

        <Card title="QR Code Scan" subtitle="Scan member QR codes to check in">
          <div className="qr-area">
            <div className="qr-box">
              <div className="qr-border" />
              <span className="qr-placeholder-text">Camera Stream</span>
            </div>
            <button className="btn btn-outline" disabled>
              Start Scanner
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Attendance;

