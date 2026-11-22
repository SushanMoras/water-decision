import React from 'react';

export default function StressLegend() {
  const items = [
    { label: "Critical (>80% Stress / Depleting)", color: "#ef4444", text: "critical" },
    { label: "Stressed (60-80% Overdraft)", color: "#f97316", text: "stressed" },
    { label: "Watch (40-60% Vulnerable)", color: "#eab308", text: "watch" },
    { label: "Safe (<40% Replenishable)", color: "#22c55e", text: "safe" },
  ];

  return (
    <div className="stress-legend">
      <div className="legend-title">Groundwater Stress Categories</div>
      <div className="legend-grid">
        {items.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-chip" style={{ backgroundColor: item.color }}></span>
            <span className="legend-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
