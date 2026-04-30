import { useMemo, useState } from "react";
import QRCode from "react-qr-code";
import Modal from "./Modal";

const UPI_PA = "fitpulse@upi";       // your UPI VPA
const UPI_PN = "FitPulse Gym";       // payee display name

/**
 * Build a UPI deep-link that any UPI app can scan.
 * Spec: https://www.npci.org.in/what-we-do/upi/upi-qr-code
 */
function buildUpiLink(amount, planName) {
  const params = new URLSearchParams({
    pa: UPI_PA,
    pn: UPI_PN,
    am: String(amount),
    cu: "INR",
    tn: `${planName} membership`
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * @param {Object}  props
 * @param {boolean} props.open
 * @param {Object}  props.member        – { id, name, plan, planId, trainerId }
 * @param {Array}   props.plans         – full plans list from backend
 * @param {number}  props.trainerFee    – additional fee when trainer is assigned (₹1000)
 * @param {Function} props.onClose
 * @param {Function} props.onPaymentComplete – called after backend confirms payment
 */
export default function PaymentModal({
  open,
  member,
  plans,
  trainerFee = 1000,
  onClose,
  onPaymentComplete
}) {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Resolve plan details from the plans array
  const plan = useMemo(() => {
    if (!member || !plans?.length) return null;
    return plans.find(
      (p) => p._id === member.planId || p.name === member.plan
    );
  }, [member, plans]);

  // Compute amount: plan price + trainer fee if applicable
  const baseAmount = plan ? plan.priceCents / 100 : 0;
  const hasTrainer = Boolean(member?.trainerId);
  const totalAmount = baseAmount + (hasTrainer ? trainerFee : 0);

  // Dynamic UPI link + QR value
  const upiLink = useMemo(
    () => buildUpiLink(totalAmount, plan?.name || "Membership"),
    [totalAmount, plan?.name]
  );

  async function handleConfirm() {
    setProcessing(true);
    setError("");
    try {
      await onPaymentComplete({
        memberId: member.id,
        planId: plan?._id,
        amount: totalAmount,
        method
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Payment recording failed");
    } finally {
      setProcessing(false);
    }
  }

  if (!member) return null;

  return (
    <Modal
      open={open}
      title={`Payment — ${member.name}`}
      onClose={() => !processing && onClose()}
      footer={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={processing || totalAmount <= 0}
          >
            {processing
              ? "Processing…"
              : "✓ I Have Received Payment"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        {error && (
          <div className="toast toast-error" style={{ gridColumn: "1 / -1", margin: 0 }}>
            <span className="toast-icon">✕</span>
            <span className="toast-message">{error}</span>
          </div>
        )}

        {/* ---- Member & plan info ---- */}
        <div className="payment-info-grid">
          <div className="payment-info-item">
            <span className="label">Member</span>
            <span className="payment-info-value">{member.name}</span>
          </div>
          <div className="payment-info-item">
            <span className="label">Plan</span>
            <span className="payment-info-value">{plan?.name || member.plan || "—"}</span>
          </div>
          <div className="payment-info-item">
            <span className="label">Plan Price</span>
            <span className="payment-info-value">₹{baseAmount.toFixed(2)}</span>
          </div>
          {hasTrainer && (
            <div className="payment-info-item">
              <span className="label">Trainer Fee</span>
              <span className="payment-info-value" style={{ color: "#f97316" }}>
                + ₹{trainerFee.toFixed(2)}
              </span>
            </div>
          )}
          <div className="payment-info-item payment-info-total">
            <span className="label">Total Amount</span>
            <span className="payment-info-value payment-total-value">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* ---- Method selector ---- */}
        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
          <span className="label">Payment Method</span>
          <div className="payment-method-tabs">
            <button
              type="button"
              className={`payment-tab ${method === "upi" ? "payment-tab-active" : ""}`}
              onClick={() => setMethod("upi")}
            >
              📱 UPI
            </button>
            <button
              type="button"
              className={`payment-tab ${method === "cash" ? "payment-tab-active" : ""}`}
              onClick={() => setMethod("cash")}
            >
              💵 Cash
            </button>
          </div>
        </div>

        {/* ---- UPI QR section ---- */}
        {method === "upi" && (
          <div className="payment-qr-section" style={{ gridColumn: "1 / -1" }}>
            <div className="payment-qr-wrapper">
              <QRCode
                value={upiLink}
                size={220}
                bgColor="#ffffff"
                fgColor="#020617"
                level="M"
                style={{ padding: 12, background: "#fff", borderRadius: 12 }}
              />
            </div>
            <p className="payment-qr-amount">₹{totalAmount.toFixed(2)}</p>
            <p className="payment-qr-hint">
              Scan using <strong>PhonePe</strong> / <strong>Google Pay</strong> / <strong>Paytm</strong>
            </p>
            <p className="payment-qr-note">
              After the customer completes payment on their UPI app,
              click <em>"I Have Received Payment"</em> below.
            </p>
          </div>
        )}

        {/* ---- Cash section ---- */}
        {method === "cash" && (
          <div className="payment-cash-section" style={{ gridColumn: "1 / -1" }}>
            <div className="payment-cash-amount">₹{totalAmount.toFixed(2)}</div>
            <p className="payment-cash-hint">
              Collect <strong>₹{totalAmount.toFixed(2)}</strong> in cash from the member
              and click <em>"I Have Received Payment"</em> to confirm.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
