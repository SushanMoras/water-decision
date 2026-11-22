import React from 'react';

export default function ConfidenceBadge({ confidence }) {
  if (!confidence) return null;

  const { level, wells_used, last_reading_date, reasons = [] } = confidence;

  const colorMap = {
    high: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    medium: { bg: "#fef9c3", text: "#854d0e", border: "#fde047" },
    low: { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" }
  };

  const style = colorMap[level] || colorMap.medium;

  return (
    <div className="confidence-badge-container">
      <span 
        className="confidence-badge" 
        style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
        title={`${wells_used} wells used. Last read: ${last_reading_date || 'N/A'}\n${reasons.join('\n')}`}
      >
        <span className="dot" style={{ backgroundColor: style.text }}></span>
        Confidence: {level.toUpperCase()}
      </span>
      <div className="confidence-popover">
        <div className="popover-title">Data Confidence Breakdown</div>
        <div className="popover-item"><strong>Observation Wells:</strong> {wells_used} within 10 km</div>
        <div className="popover-item"><strong>Latest Observation:</strong> {last_reading_date || 'N/A'}</div>
        {reasons.length > 0 && (
          <ul className="popover-reasons">
            {reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
