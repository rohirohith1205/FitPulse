import Card from "../components/ui/Card";
import { useEffect, useMemo, useState } from "react";
import { createMember, deleteMember, listMembers } from "../api/members";
import { listPlans } from "../api/plans";
import { listTrainers } from "../api/trainers";
import { createPayment } from "../api/payments";
import Modal from "../components/ui/Modal";
import PaymentModal from "../components/ui/PaymentModal";
import { showToast } from "../components/ui/Toast";

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
  const [trainers, setTrainers] = useState([]);

  // Add-member modal
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      fullName: "",
      email: "",
      membershipPlanId: "",
      trainerId: "",
      joinDate: today,
      expiryDate: today
    };
  });

  // Payment modal
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMember, setPaymentMember] = useState(null);

  // ── Data fetching ─────────────────────────────────────
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
    return () => { cancelled = true; };
  }, [search, status]);

  useEffect(() => {
    let cancelled = false;
    listPlans({ includeInactive: false })
      .then((data) => { if (!cancelled) setPlans(data); })
      .catch(() =>   { if (!cancelled) setPlans([]); });

    listTrainers()
      .then((data) => { if (!cancelled) setTrainers(data); })
      .catch(() =>   { if (!cancelled) setTrainers([]); });

    return () => { cancelled = true; };
  }, []);

  // ── Derived rows ──────────────────────────────────────
  const rows = useMemo(() => {
    return members.map((m) => ({
      id: m._id,
      name: m.fullName,
      email: m.email,
      plan: m.planName || m.membershipPlanId?.name || "",
      planId: m.membershipPlanId?._id || m.membershipPlanId,
      trainerId: m.trainerId?._id || m.trainerId,
      joinDate: formatDate(m.joinDate),
      expiryDate: formatDate(m.expiryDate),
      isPaid: !!m.isPaid,
      status: m.status || "Active"
    }));
  }, [members]);

  // ── Helpers ───────────────────────────────────────────
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

  function openAdd() {
    const today = new Date().toISOString().slice(0, 10);
    setForm({
      fullName: "",
      email: "",
      membershipPlanId: plans[0]?._id ?? "",
      trainerId: "",
      joinDate: today,
      expiryDate: plans[0]?.durationDays
        ? addDaysIso(today, plans[0].durationDays)
        : today
    });
    setFormError("");
    setAddOpen(true);
  }

  async function onCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await createMember({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        membershipPlanId: form.membershipPlanId,
        trainerId: form.trainerId || undefined,
        joinDate: form.joinDate,
        expiryDate: form.expiryDate
      });
      setAddOpen(false);
      showToast("success", "Member added successfully!");
      await refresh();
    } catch (err) {
      setFormError(err?.message ?? "Failed to add member");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteMember(id);
      showToast("success", "Member deleted.");
      await refresh();
    } catch (e) {
      showToast("error", e?.message ?? "Failed to delete member");
    }
  }

  // ── Payment flow ──────────────────────────────────────
  function openPayment(m) {
    setPaymentMember(m);
    setPaymentOpen(true);
  }

  async function handlePaymentComplete({ memberId, planId, amount, method }) {
    await createPayment({ memberId, planId, amount, method });
    showToast("success", `₹${amount.toFixed(2)} payment recorded via ${method.toUpperCase()}`);
    await refresh();
    // Also refresh trainers (in case member counts changed)
    listTrainers()
      .then(setTrainers)
      .catch(() => {});
  }

  // ── Computed amount for the add-member form ───────────
  const selectedPlan = plans.find((p) => p._id === form.membershipPlanId);
  let computedAmount = selectedPlan ? selectedPlan.priceCents / 100 : 0;
  if (form.trainerId) computedAmount += 1000;
  const amountDisplay = computedAmount.toFixed(2);

  // ── Render ────────────────────────────────────────────
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
              placeholder="Search by name or email"
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

      {/* ── Member table ──────────────────────────────── */}
      <Card title="Member List">
        {loading && <div>Loading members…</div>}
        {!loading && error && <div>{error}</div>}
        {!loading && !error && meta?.total === 0 && <div>No members yet.</div>}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Join Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                !error &&
                rows.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
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
                        {m.isPaid && m.status !== "Overdue" ? (
                          <button className="btn btn-paid" disabled>
                            Paid ✓
                          </button>
                        ) : (
                          <button
                            className="btn btn-pay"
                            onClick={() => openPayment(m)}
                          >
                            Pay Now
                          </button>
                        )}
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

      {/* ── Add Member Modal ──────────────────────────── */}
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
            <button
              type="submit"
              className="btn btn-primary"
              form="add-member-form"
              disabled={saving}
            >
              {saving ? "Saving…" : "Add member"}
            </button>
          </>
        }
      >
        <form id="add-member-form" className="form-grid" onSubmit={onCreate}>
          {formError && <div className="toast toast-error" style={{ margin: 0 }}>
            <span className="toast-icon">✕</span>
            <span className="toast-message">{formError}</span>
          </div>}

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
            <span className="label">Email</span>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. alex@example.com"
              required
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
                  expiryDate: plan?.durationDays
                    ? addDaysIso(f.joinDate, plan.durationDays)
                    : f.expiryDate
                }));
              }}
              required
            >
              <option value="" disabled>Select a plan…</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.durationDays} days)
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <span className="label">Trainer (Optional)</span>
            <select
              className="input select"
              value={form.trainerId}
              onChange={(e) => setForm((f) => ({ ...f, trainerId: e.target.value }))}
            >
              <option value="">No Trainer</option>
              {trainers
                .filter((t) => t.assignedMembers < 3)
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — ({t.assignedMembers}/3 assigned)
                  </option>
                ))}
            </select>
          </div>

          <div className="form-field">
            <span className="label">Amount (Calculated)</span>
            <input type="text" className="input" value={`₹${amountDisplay}`} disabled />
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
                  expiryDate: plan?.durationDays
                    ? addDaysIso(joinDate, plan.durationDays)
                    : f.expiryDate
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

      {/* ── Payment Modal (dynamic QR) ────────────────── */}
      <PaymentModal
        open={paymentOpen}
        member={paymentMember}
        plans={plans}
        trainerFee={1000}
        onClose={() => setPaymentOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default Members;
