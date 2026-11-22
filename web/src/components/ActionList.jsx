import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';

export default function ActionList({ actions = [] }) {
  if (!actions || actions.length === 0) {
    return <div className="no-actions">No specific intervention actions prioritized for this season.</div>;
  }

  const costBadge = {
    low: { text: "Low Capital", class: "cost-low" },
    medium: { text: "Medium Capital", class: "cost-med" },
    high: { text: "High Capital", class: "cost-high" }
  };

  return (
    <div className="action-list-container">
      <div className="action-list-header">
        <h4>Ranked Community & Agronomic Interventions</h4>
        <p className="action-sub">Prioritized by net water conservation potential, local hydrogeology, and implementation feasibility.</p>
      </div>

      <div className="action-cards-grid">
        {actions.map((act) => (
          <div key={act.rank} className="action-card">
            <div className="action-card-top">
              <div className="action-rank-badge">#{act.rank} Priority</div>
              <span className={`cost-pill ${costBadge[act.cost_level]?.class || ""}`}>
                {costBadge[act.cost_level]?.text || act.cost_level}
              </span>
            </div>

            <h5 className="action-title">{act.title}</h5>
            <p className="action-why">{act.why}</p>

            <div className="action-stats-row">
              <div className="action-effect">
                <span className="effect-label">Estimated Water Savings:</span>
                <span className="effect-value">
                  <strong>{act.expected_water_effect_ml.mid} ML</strong>
                  <span className="effect-range"> ({act.expected_water_effect_ml.low} to {act.expected_water_effect_ml.high} ML)</span>
                </span>
              </div>
            </div>

            <div className="action-footer">
              <div className="action-source">
                Source: <a href={act.source.url} target="_blank" rel="noopener noreferrer">{act.source.name}</a>
              </div>
              <ConfidenceBadge confidence={act.confidence} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
