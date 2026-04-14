import Card from "../components/ui/Card";
import { useEffect, useMemo, useState } from "react";
import { createMember, deleteMember, listMembers } from "../api/members";
import { listPlans } from "../api/plans";
import Modal from "../components/ui/Modal";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function addDaysIso(dateIso, days) {
  const base = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(base.getTime())) return "";
  base.setDate(base.getDate() + Number(days || 0));
  return base.toISOString().slice(0, 10);
}

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [meta, setMeta] = useState(null);

  const [plans, setPlans] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      fullName: "",
      phone: "",
      email: "",
      membershipPlanId: "",
      joinDate: today,
      expiryDate: today
    };
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    listMembers({ search, status })
      .then((res) => {
        if (cancelled) return;
        setMembers(res.data);
        setMeta(res.meta);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load members");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, status]);

  useEffect(() => {
    let cancelled = false;
    listPlans({ includeInactive: false })
      .then((data) => {
        if (cancelled) return;
        setPlans(data);
      })
      .catch(() => {
        if (cancelled) return;
        setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    return members.map((m) => ({
      id: m._id,
      name: m.fullName,
      phone: m.phone,
      plan: m.planName || m.membershipPlanId?.name || "",
      joinDate: formatDate(m.joinDate),
      expiryDate: formatDate(m.expiryDate),
      status: m.status || "Active"
    }));
  }, [members]);

  function openAdd() {
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      fullName: "",
      phone: "",
      email: "",
      membershipPlanId: plans[0]?._id ?? "",
      joinDate: today,
      expiryDate: plans[0]?.durationDays ? addDaysIso(today, plans[0].durationDays) : today
    });
    setFormError("");
    setAddOpen(true);
  }

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await listMembers({ search, status });
      setMembers(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(e?.message ?? "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await createMember({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        membershipPlanId: form.membershipPlanId,
        joinDate: form.joinDate,
        expiryDate: form.expiryDate
      });
      setAddOpen(false);
      await refresh();
    } catch (err) {
      setFormError(err?.message ?? "Failed to add member");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this member?");
    if (!ok) return;
    try {
      await deleteMember(id);
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to delete member");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">Manage your member base and memberships.</p>
        </div>
        <div className="page-header-actions">
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring">Expiring</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Member
          </button>
        </div>
      </div>

      <Card title="Member List">
        {loading && <div>Loading members...</div>}
        {!loading && error && <div>{error}</div>}
        {!loading && !error && meta?.total === 0 && <div>No members yet.</div>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Join Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                !error &&
                rows.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.phone}</td>
                    <td>{m.plan}</td>
                    <td>{m.joinDate}</td>
                    <td>{m.expiryDate}</td>
                    <td>
                      <span className={`badge badge-${m.status.toLowerCase()}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost-sm" disabled>
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost-sm btn-danger"
                          onClick={() => onDelete(m.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={addOpen}
        title="Add member"
        onClose={() => (saving ? null : setAddOpen(false))}
        footer={
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setAddOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" form="add-member-form" disabled={saving}>
              {saving ? "Saving..." : "Add member"}
            </button>
          </>
        }
      >
        <form id="add-member-form" className="form-grid" onSubmit={onCreate}>
          {formError && <div>{formError}</div>}
          <div className="form-field">
            <span className="label">Full name</span>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="e.g. Alex Johnson"
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Phone</span>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +1 555 0100"
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Email (optional)</span>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. alex@example.com"
            />
          </div>
          <div className="form-field">
            <span className="label">Plan</span>
            <select
              className="input select"
              value={form.membershipPlanId}
              onChange={(e) => {
                const membershipPlanId = e.target.value;
                const plan = plans.find((p) => p._id === membershipPlanId);
                setForm((f) => ({
                  ...f,
                  membershipPlanId,
                  expiryDate: plan?.durationDays ? addDaysIso(f.joinDate, plan.durationDays) : f.expiryDate
                }));
              }}
              required
            >
              <option value="" disabled>
                Select a plan...
              </option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.durationDays} days)
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <span className="label">Join date</span>
            <input
              type="date"
              className="input"
              value={form.joinDate}
              onChange={(e) => {
                const joinDate = e.target.value;
                const plan = plans.find((p) => p._id === form.membershipPlanId);
                setForm((f) => ({
                  ...f,
                  joinDate,
                  expiryDate: plan?.durationDays ? addDaysIso(joinDate, plan.durationDays) : f.expiryDate
                }));
              }}
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Expiry date</span>
            <input
              type="date"
              className="input"
              value={form.expiryDate}
              onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Members;

