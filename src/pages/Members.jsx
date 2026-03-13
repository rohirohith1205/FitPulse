import Card from "../components/ui/Card";

const members = [
  {
    name: "Alex Carter",
    phone: "555-1234",
    plan: "Monthly",
    joinDate: "2025-12-01",
    expiryDate: "2026-01-01",
    status: "Active"
  },
  {
    name: "Jordan Smith",
    phone: "555-2345",
    plan: "Quarterly",
    joinDate: "2025-11-15",
    expiryDate: "2026-02-15",
    status: "Active"
  },
  {
    name: "Taylor Lee",
    phone: "555-3456",
    plan: "Yearly",
    joinDate: "2025-03-10",
    expiryDate: "2026-03-10",
    status: "Expiring"
  },
  {
    name: "Morgan Ray",
    phone: "555-4567",
    plan: "Monthly",
    joinDate: "2026-02-20",
    expiryDate: "2026-03-20",
    status: "Overdue"
  }
];

function Members() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">Manage your member base and memberships.</p>
        </div>
        <div className="page-header-actions">
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="Search by name or phone"
            />
          </div>
          <select className="input select">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Expiring</option>
            <option>Overdue</option>
          </select>
          <button className="btn btn-primary">+ Add Member</button>
        </div>
      </div>

      <Card title="Member List">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Join Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td>{m.phone}</td>
                  <td>{m.plan}</td>
                  <td>{m.joinDate}</td>
                  <td>{m.expiryDate}</td>
                  <td>
                    <span className={`badge badge-${m.status.toLowerCase()}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn btn-ghost-sm">Edit</button>
                      <button className="btn btn-ghost-sm btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Members;

