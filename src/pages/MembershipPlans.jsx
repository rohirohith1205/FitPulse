import Card from "../components/ui/Card";

const plans = [
  {
    name: "Monthly",
    price: "$49",
    duration: "30 days",
    description: "Flexible access, ideal for short-term goals."
  },
  {
    name: "Quarterly",
    price: "$129",
    duration: "90 days",
    description: "Great balance of commitment and savings."
  },
  {
    name: "Yearly",
    price: "$399",
    duration: "365 days",
    description: "Best value for long-term members."
  }
];

function MembershipPlans() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Membership Plans</h1>
          <p className="page-subtitle">Configure and manage FitPulse membership offerings.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">+ Add Plan</button>
        </div>
      </div>

      <div className="plan-grid">
        {plans.map((plan) => (
          <Card key={plan.name} title={plan.name} subtitle={plan.duration}>
            <div className="plan-card-body">
              <div className="plan-price">{plan.price}</div>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-actions">
                <button className="btn btn-outline-sm">Edit</button>
                <button className="btn btn-ghost-sm btn-danger">Delete</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MembershipPlans;

