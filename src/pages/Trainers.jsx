import Card from "../components/ui/Card";
import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import { listTrainers, createTrainer, deleteTrainer } from "../api/trainers";

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", specialization: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const res = await listTrainers();
      setTrainers(res); // api returns { data: [...] } ? wait, listTrainers from api module returns res.data
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const openAdd = () => {
    setForm({ name: "", phone: "", specialization: "" });
    setError("");
    setAddOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createTrainer(form);
      setAddOpen(false);
      await loadTrainers();
    } catch (err) {
      setError(err?.message || "Failed to create trainer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteTrainer(id);
      await loadTrainers();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainers</h1>
          <p className="page-subtitle">Assign members and track trainer performance.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Trainer
          </button>
        </div>
      </div>

      <Card title="Trainer Overview">
        {loading ? <p>Loading trainers...</p> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Assigned Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map(t => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{t.phone || "-"}</td>
                    <td>{t.specialization || "-"}</td>
                    <td>{t.assignedMembers || 0}</td>
                    <td>
                      <button className="btn btn-ghost-sm btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {trainers.length === 0 && (
                  <tr><td colSpan="5">No trainers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Modal open={addOpen} title="Add Trainer" onClose={() => !saving && setAddOpen(false)} footer={<><button type="button" className="btn btn-outline" onClick={() => setAddOpen(false)} disabled={saving}>Cancel</button><button type="submit" className="btn btn-primary" form="add-trainer-form" disabled={saving}>{saving ? "Saving..." : "Add"}</button></>}>
        <form id="add-trainer-form" className="form-grid" onSubmit={handleCreate}>
          {error && <div className="error">{error}</div>}
          <div className="form-field">
            <span className="label">Name</span>
            <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" />
          </div>
          <div className="form-field">
            <span className="label">Phone</span>
            <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="e.g. +123456789" />
          </div>
          <div className="form-field">
            <span className="label">Specialization</span>
            <input className="input" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} placeholder="e.g. Yoga, Weightlifting" />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Trainers;

