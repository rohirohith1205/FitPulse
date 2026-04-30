import { useEffect, useState } from "react";

let toastId = 0;
let globalSetToasts = null;

/**
 * Call this anywhere to show a toast.
 * @param {"success"|"error"|"info"} type
 * @param {string} message
 * @param {number} duration - ms before auto-dismiss (default 3500)
 */
export function showToast(type, message, duration = 3500) {
  if (!globalSetToasts) return;
  const id = ++toastId;
  globalSetToasts((prev) => [...prev, { id, type, message, duration }]);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  globalSetToasts = setToasts;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onDone={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 320);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDone]);

  const iconMap = {
    success: "✓",
    error: "✕",
    info: "ℹ"
  };

  return (
    <div className={`toast toast-${toast.type} ${exiting ? "toast-exit" : ""}`}>
      <span className="toast-icon">{iconMap[toast.type] || "ℹ"}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => {
          setExiting(true);
          setTimeout(onDone, 320);
        }}
      >
        ×
      </button>
    </div>
  );
}
