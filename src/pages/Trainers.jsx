import Card from "../components/ui/Card";

const trainers = [
  { name: "Chris Green", specialty: "Strength & Conditioning", members: 34 },
  { name: "Sam Patel", specialty: "Yoga & Mobility", members: 21 },
  { name: "Jamie Fox", specialty: "HIIT & Cardio", members: 27 }
];

function Trainers() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">Assign members and track trainer performance.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">+ Add Trainer</button>
        </div>
      </div>

      <Card title="Trainer Overview">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Assigned Members</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t) => (
                <tr key={t.name}>
                  <td>{t.name}</td>
                  <td>{t.specialty}</td>
                  <td>{t.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Trainers;

