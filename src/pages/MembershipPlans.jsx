import Card from "../components/ui/Card";
import { useEffect, useMemo, useState } from "react";
import { createPlan, deletePlan, listPlans } from "../api/plans";
import Modal from "../components/ui/Modal";

function formatPrice(priceCents, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0
  }).format((priceCents ?? 0) / 100);
}

function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    durationDays: 30,
    priceCents: 3000,
    currency: "USD",
    description: "",
    active: true
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    listPlans()
      .then((data) => {
        if (cancelled) return;
        setPlans(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ?? "Failed to load plans");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await listPlans();
      setPlans(data);
    } catch (e) {
      setError(e?.message ?? "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }

  const items = useMemo(() => {
    return plans.map((p) => ({
      id: p._id,
      name: p.name,
      duration: `${p.durationDays} days`,
      price: formatPrice(p.priceCents, p.currency),
      description: p.description || ""
    }));
  }, [plans]);

  function openAdd() {
    setForm({
      name: "",
      durationDays: 30,
      priceCents: 3000,
      currency: "USD",
      description: "",
      active: true
    });
    setFormError("");
    setAddOpen(true);
  }

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await createPlan({
        name: form.name.trim(),
        durationDays: Number(form.durationDays),
        priceCents: Number(form.priceCents),
        currency: form.currency.trim() || "USD",
        description: form.description.trim() || undefined,
        active: Boolean(form.active)
      });
      setAddOpen(false);
      await refresh();
    } catch (err) {
      setFormError(err?.message ?? "Failed to add plan");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Delete this plan? Members using it will break until you reassign them.");
    if (!ok) return;
    try {
      await deletePlan(id);
      await refresh();
    } catch (e) {
      setError(e?.message ?? "Failed to delete plan");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Membership Plans</h1>
          <p className="page-subtitle">Configure and manage FitPulse membership offerings.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Plan
          </button>
        </div>
      </div>

      <div className="plan-grid">
        {loading && <Card title="Loading plans...">Please wait.</Card>}
        {!loading && error && <Card title="Could not load plans">{error}</Card>}
        {!loading &&
          !error &&
          items.map((plan) => (
            <Card key={plan.id} title={plan.name} subtitle={plan.duration}>
              <div className="plan-card-body">
                <div className="plan-price">{plan.price}</div>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-actions">
                  <button className="btn btn-outline-sm" disabled>
                    Edit
                  </button>
                  <button className="btn btn-ghost-sm btn-danger" onClick={() => onDelete(plan.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Modal
        open={addOpen}
        title="Add plan"
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
            <button type="submit" className="btn btn-primary" form="add-plan-form" disabled={saving}>
              {saving ? "Saving..." : "Add plan"}
            </button>
          </>
        }
      >
        <form id="add-plan-form" className="form-grid" onSubmit={onCreate}>
          {formError && <div>{formError}</div>}
          <div className="form-field">
            <span className="label">Plan name</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Monthly"
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Duration (days)</span>
            <input
              className="input"
              type="number"
              min="1"
              value={form.durationDays}
              onChange={(e) => setForm((f) => ({ ...f, durationDays: e.target.value }))}
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Price (cents)</span>
            <input
              className="input"
              type="number"
              min="0"
              value={form.priceCents}
              onChange={(e) => setForm((f) => ({ ...f, priceCents: e.target.value }))}
              required
            />
          </div>
          <div className="form-field">
            <span className="label">Currency</span>
            <input
              className="input"
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              placeholder="USD"
            />
          </div>
          <div className="form-field">
            <span className="label">Description (optional)</span>
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What’s included..."
            />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            Active
          </label>
        </form>
      </Modal>
    </div>
  );
}

export default MembershipPlans;

