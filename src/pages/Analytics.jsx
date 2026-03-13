import Card from "../components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 6100 },
  { month: "Apr", revenue: 7400 },
  { month: "May", revenue: 8200 },
  { month: "Jun", revenue: 9050 }
];

const memberGrowth = [
  { month: "Jan", newMembers: 32 },
  { month: "Feb", newMembers: 45 },
  { month: "Mar", newMembers: 51 },
  { month: "Apr", newMembers: 63 },
  { month: "May", newMembers: 70 },
  { month: "Jun", newMembers: 76 }
];

const popularity = [
  { plan: "Monthly", count: 620 },
  { plan: "Quarterly", count: 320 },
  { plan: "Yearly", count: 180 }
];

function Analytics() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            Deep insights into revenue, growth, and membership behavior.
          </p>
        </div>
      </div>

      <div className="charts-grid analytics-grid">
        <Card title="Revenue Analytics" subtitle="Monthly recurring revenue trend">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b2f40" />
                <XAxis dataKey="month" stroke="#8b92b7" />
                <YAxis stroke="#8b92b7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #1f2937",
                    borderRadius: 8
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Member Growth" subtitle="New members per month">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2b2f40" />
                <XAxis dataKey="month" stroke="#8b92b7" />
                <YAxis stroke="#8b92b7" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #1f2937",
                    borderRadius: 8
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="newMembers" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Most Popular Plans" subtitle="Based on current active memberships">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Active Members</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {popularity.map((p) => {
                  const total = popularity.reduce((acc, item) => acc + item.count, 0);
                  const share = Math.round((p.count / total) * 100);
                  return (
                    <tr key={p.plan}>
                      <td>{p.plan}</td>
                      <td>{p.count}</td>
                      <td>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${share}%` }}
                          />
                          <span className="progress-bar-label">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;

