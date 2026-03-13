import Card from "../components/ui/Card";

const payments = [
  {
    member: "Alex Carter",
    amount: "$49",
    date: "2026-03-10",
    method: "Credit Card"
  },
  {
    member: "Jordan Smith",
    amount: "$129",
    date: "2026-03-09",
    method: "UPI"
  },
  {
    member: "Taylor Lee",
    amount: "$399",
    date: "2026-03-08",
    method: "Bank Transfer"
  },
  {
    member: "Morgan Ray",
    amount: "$49",
    date: "2026-03-07",
    method: "Cash"
  }
];

function Payments() {
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
            placeholder="Search by member or method"
          />
          <select className="input select">
            <option>All Methods</option>
            <option>Credit Card</option>
            <option>UPI</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>

      <Card title="Payment History">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th style={{ width: 120 }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.member + p.date}>
                  <td>{p.member}</td>
                  <td>{p.amount}</td>
                  <td>{p.date}</td>
                  <td>{p.method}</td>
                  <td>
                    <button className="btn btn-outline-sm">View Invoice</button>
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

export default Payments;

