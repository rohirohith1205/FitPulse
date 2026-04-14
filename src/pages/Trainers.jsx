import Card from "../components/ui/Card";

function Trainers() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">Assign members and track trainer performance.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" disabled>
            + Add Trainer
          </button>
        </div>
      </div>

      <Card title="Trainer Overview">
        <div>No trainer data yet. Add trainer management endpoints to enable this view.</div>
      </Card>
    </div>
  );
}

export default Trainers;

