import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import { useEffect, useMemo, useState } from "react";
import { listMembers } from "../api/members";
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

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString(undefined, { month: "short" });
}

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    overdue: 0
  });
  const [recent, setRecent] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      listMembers({ limit: 1 }),
      listMembers({ status: "Active", limit: 1 }),
      listMembers({ status: "Expiring", limit: 1 }),
      listMembers({ status: "Overdue", limit: 1 }),
      listMembers({ limit: 20 })
    ])
      .then(([all, active, expiring, overdue, recentRes]) => {
        if (cancelled) return;
        setStats({
          total: all.meta?.total ?? all.data.length,
          active: active.meta?.total ?? active.data.length,
          expiring: expiring.meta?.total ?? expiring.data.length,
          overdue: overdue.meta?.total ?? overdue.data.length
        });

        const sortedRecent = [...recentRes.data].sort(
          (a, b) => new Date(b.createdAt ?? b.joinDate).getTime() - new Date(a.createdAt ?? a.joinDate).getTime()
        );
        setRecent(sortedRecent.slice(0, 6));

        // Growth: last 6 months based on joinDate for up to 200 members.
        listMembers({ limit: 200 })
          .then((res) => {
            if (cancelled) return;
            const now = new Date();
            const keys = [];
            for (let i = 5; i >= 0; i -= 1) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              keys.push(monthKey(d));
            }
            const counts = new Map(keys.map((k) => [k, 0]));
            for (const m of res.data) {
              const jd = new Date(m.joinDate);
              if (Number.isNaN(jd.getTime())) continue;
              const k = monthKey(jd);
              if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
            }
            setGrowthData(keys.map((k) => ({ month: monthLabel(k), members: counts.get(k) ?? 0 })));
          })
          .catch(() => {
            if (cancelled) return;
            setGrowthData([]);
          });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load dashboard data");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalMembersLabel = useMemo(() => stats.total.toLocaleString(), [stats.total]);
  const activeMembersLabel = useMemo(() => stats.active.toLocaleString(), [stats.active]);
  const expiringLabel = useMemo(() => stats.expiring.toLocaleString(), [stats.expiring]);

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
          value={loading ? "…" : totalMembersLabel}
          trend={null}
          highlight
        />
        <StatCard
          label="Active Memberships"
          value={loading ? "…" : activeMembersLabel}
          trend={null}
        />
        <StatCard
          label="Expiring This Month"
          value={loading ? "…" : expiringLabel}
          trend={null}
        />
        <StatCard
          label="Monthly Revenue"
          value="—"
          trend={null}
        />
      </div>

      <div className="charts-grid">
        <Card title="Membership Growth" subtitle="Last 6 months">
          <div className="chart-wrapper">
            {error && <div>{error}</div>}
            {!error && growthData.length === 0 && <div>No membership growth data yet.</div>}
            {!error && growthData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
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
            )}
          </div>
        </Card>

        <Card title="Monthly Revenue" subtitle="Last 6 months">
          <div className="chart-wrapper">
            <div>Connect payments/invoicing to unlock revenue analytics.</div>
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
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4}>No members yet.</td>
                </tr>
              )}
              {recent.map((member) => (
                <tr key={member._id}>
                  <td>{member.fullName}</td>
                  <td>{member.phone}</td>
                  <td>{member.planName || member.membershipPlanId?.name || ""}</td>
                  <td>{formatDate(member.joinDate)}</td>
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

