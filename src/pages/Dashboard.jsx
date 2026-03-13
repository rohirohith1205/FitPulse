import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
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

const membershipGrowthData = [
  { month: "Jan", members: 120 },
  { month: "Feb", members: 148 },
  { month: "Mar", members: 172 },
  { month: "Apr", members: 210 },
  { month: "May", members: 244 },
  { month: "Jun", members: 281 }
];

const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 6100 },
  { month: "Apr", revenue: 7400 },
  { month: "May", revenue: 8200 },
  { month: "Jun", revenue: 9050 }
];

const recentMembers = [
  { name: "Alex Carter", phone: "555-1234", plan: "Monthly", joinDate: "2026-03-10" },
  { name: "Jordan Smith", phone: "555-2345", plan: "Quarterly", joinDate: "2026-03-09" },
  { name: "Taylor Lee", phone: "555-3456", plan: "Yearly", joinDate: "2026-03-08" },
  { name: "Morgan Ray", phone: "555-4567", plan: "Monthly", joinDate: "2026-03-07" }
];

function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your gym performance today.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total Members"
          value="1,248"
          trend={{ direction: "up", value: "+4.2%" }}
          highlight
        />
        <StatCard
          label="Active Memberships"
          value="1,018"
          trend={{ direction: "up", value: "+2.3%" }}
        />
        <StatCard
          label="Expiring This Month"
          value="86"
          trend={{ direction: "down", value: "-1.1%" }}
        />
        <StatCard
          label="Monthly Revenue"
          value="$9,050"
          trend={{ direction: "up", value: "+6.8%" }}
        />
      </div>

      <div className="charts-grid">
        <Card title="Membership Growth" subtitle="Last 6 months">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={membershipGrowthData}>
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
                  dataKey="members"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Revenue" subtitle="Last 6 months">
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
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
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card
        title="Recent Member Registrations"
        subtitle="Latest members who joined your gym"
      >
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Join Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member) => (
                <tr key={member.name}>
                  <td>{member.name}</td>
                  <td>{member.phone}</td>
                  <td>{member.plan}</td>
                  <td>{member.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;

