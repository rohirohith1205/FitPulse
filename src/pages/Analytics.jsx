import Card from "../components/ui/Card";
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

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString(undefined, { month: "short" });
}

function Analytics() {
  const [memberGrowth, setMemberGrowth] = useState([]);
  const [popularity, setPopularity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    listMembers({ limit: 200 })
      .then((res) => {
        if (cancelled) return;
        const now = new Date();
        const keys = [];
        for (let i = 5; i >= 0; i -= 1) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          keys.push(monthKey(d));
        }

        const growthCounts = new Map(keys.map((k) => [k, 0]));
        const planCounts = new Map();

        for (const m of res.data) {
          const jd = new Date(m.joinDate);
          if (!Number.isNaN(jd.getTime())) {
            const k = monthKey(jd);
            if (growthCounts.has(k)) growthCounts.set(k, (growthCounts.get(k) ?? 0) + 1);
          }
          const planName = m.planName || m.membershipPlanId?.name || "Unknown";
          planCounts.set(planName, (planCounts.get(planName) ?? 0) + 1);
        }

        setMemberGrowth(keys.map((k) => ({ month: monthLabel(k), newMembers: growthCounts.get(k) ?? 0 })));
        setPopularity(
          [...planCounts.entries()]
            .map(([plan, count]) => ({ plan, count }))
            .sort((a, b) => b.count - a.count)
        );
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load analytics");
        setMemberGrowth([]);
        setPopularity([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const popularityTotal = useMemo(
    () => popularity.reduce((acc, item) => acc + (item.count ?? 0), 0),
    [popularity]
  );

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
            <div>Revenue data requires a payments/invoicing module.</div>
          </div>
        </Card>

        <Card title="Member Growth" subtitle="New members per month">
          <div className="chart-wrapper">
            {loading && <div>Loading...</div>}
            {!loading && error && <div>{error}</div>}
            {!loading && !error && memberGrowth.length === 0 && <div>No member growth data yet.</div>}
            {!loading && !error && memberGrowth.length > 0 && (
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
            )}
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
                {loading && (
                  <tr>
                    <td colSpan={3}>Loading...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={3}>{error}</td>
                  </tr>
                )}
                {!loading && !error && popularity.length === 0 && (
                  <tr>
                    <td colSpan={3}>No members yet.</td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  popularity.map((p) => {
                    const share = popularityTotal ? Math.round((p.count / popularityTotal) * 100) : 0;
                    return (
                      <tr key={p.plan}>
                        <td>{p.plan}</td>
                        <td>{p.count}</td>
                        <td>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${share}%` }} />
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

