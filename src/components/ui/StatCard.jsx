function StatCard({ label, value, trend, highlight }) {
  return (
    <div className={"card stat-card" + (highlight ? " stat-card-highlight" : "")}>
      <div className="stat-label">{label}</div>
      <div className="stat-main">
        <span className="stat-value">{value}</span>
        {trend && (
          <span className={"stat-trend " + (trend.direction === "up" ? "trend-up" : "trend-down")}>
            {trend.direction === "up" ? "▲" : "▼"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;

