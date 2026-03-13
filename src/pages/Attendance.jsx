import Card from "../components/ui/Card";

const checkIns = [
  { time: "06:15", name: "Alex Carter", plan: "Monthly" },
  { time: "06:22", name: "Jordan Smith", plan: "Quarterly" },
  { time: "06:45", name: "Taylor Lee", plan: "Yearly" },
  { time: "07:05", name: "Morgan Ray", plan: "Monthly" }
];

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
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Member</th>
                  <th>Plan</th>
                </tr>
              </thead>
              <tbody>
                {checkIns.map((c) => (
                  <tr key={c.time + c.name}>
                    <td>{c.time}</td>
                    <td>{c.name}</td>
                    <td>{c.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="QR Code Scan" subtitle="Scan member QR codes to check in">
          <div className="qr-area">
            <div className="qr-box">
              <div className="qr-border" />
              <span className="qr-placeholder-text">Camera Stream</span>
            </div>
            <button className="btn btn-outline">Start Scanner</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Attendance;

