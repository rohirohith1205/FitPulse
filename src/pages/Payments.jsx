import Card from "../components/ui/Card";

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
            disabled
          />
          <select className="input select" disabled>
            <option>All Methods</option>
            <option>Credit Card</option>
            <option>UPI</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>

      <Card title="Payment History">
        <div>No payment data yet. Add payments endpoints to record transactions and generate invoices.</div>
      </Card>
    </div>
  );
}

export default Payments;

