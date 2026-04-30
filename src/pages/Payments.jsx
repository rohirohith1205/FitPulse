import Card from "../components/ui/Card";
import { useEffect, useState } from "react";
import { listPayments } from "../api/payments";

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listPayments({ search, method })
      .then((data) => { if (!cancelled) setPayments(data); })
      .catch(() =>   { if (!cancelled) setPayments([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, method]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">Review payment history and invoices.</p>
        </div>
        <div className="page-header-actions">
          <input
            className="input"
            type="text"
            placeholder="Search by member name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="">All Methods</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      <Card title="Payment History">
        {loading && <div>Loading payments…</div>}
        {!loading && payments.length === 0 && <div>No payments recorded yet.</div>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.memberId?.fullName || "—"}</td>
                    <td>{p.membershipPlanSnapshot?.name || "—"}</td>
                    <td>₹{(p.amount ?? 0).toFixed(2)}</td>
                    <td style={{ textTransform: "uppercase" }}>{p.method}</td>
                    <td>
                      <span className={`badge badge-${p.status === "completed" ? "active" : "overdue"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{formatDateTime(p.paidAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Payments;
