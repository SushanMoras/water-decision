import React, { useState, useEffect } from 'react';
import { postScenario } from '../api';
import AnimatedStat from './AnimatedStat';

export default function CropSwitchSlider({ village, cropsMeta = {}, baselineBalance }) {
  const [fromCrop, setFromCrop] = useState("paddy");
  const [toCrop, setToCrop] = useState("maize");
  const [shiftPercent, setShiftPercent] = useState(20);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableCrops = Object.keys(cropsMeta.crops || { paddy: {}, maize: {}, cotton: {}, moong: {} });

  useEffect(() => {
    if (!village) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await postScenario({
          village_id: village.id,
          from_crop: fromCrop,
          to_crop: toCrop,
          shift_percent: Number(shiftPercent),
          season: "kharif"
        });
        setResult(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [village?.id, fromCrop, toCrop, shiftPercent]);

  if (!village) return null;

  const currentBal = baselineBalance || { low: -1200, mid: -850, high: -450 };

  return (
    <div className="crop-slider-card">
      <div className="slider-header">
        <h4>What-If Crop Diversification Simulator</h4>
        <p className="slider-desc">
          Evaluate village aquifer recharge and net farmer income impact when transitioning high-water paddy acreage to alternative crops.
        </p>
      </div>

      <div className="crop-controls-grid">
        <div className="control-group">
          <label>Original High-Water Crop</label>
          <select value={fromCrop} onChange={(e) => setFromCrop(e.target.value)}>
            {availableCrops.map((c) => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Target Diversification Crop</label>
          <select value={toCrop} onChange={(e) => setToCrop(e.target.value)}>
            {availableCrops.map((c) => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="slider-bar-container">
        <div className="slider-label-row">
          <span>Shift Percentage: <strong>{shiftPercent}%</strong> of village crop acreage</span>
          <span>(Range: 0% - 100%)</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="5" 
          value={shiftPercent}
          onChange={(e) => setShiftPercent(e.target.value)}
          className="acreage-slider"
        />
      </div>

      {loading && <div className="sim-loading">Simulating hydrological & economic impact...</div>}
      {error && <div className="sim-error">{error}</div>}

      {/* Before and After Layout */}
      {result && (
        <div className="before-after-container">
          <div className="comparison-card card-before">
            <div className="comparison-badge">NOW (Status Quo)</div>
            <div className="comparison-metric">
              <span className="comp-label">Projected Seasonal Balance</span>
              <span className="comp-value deficit">
                <AnimatedStat value={Math.round(currentBal.mid)} suffix=" ML" />
              </span>
              <span className="comp-range">Range: [{Math.round(currentBal.low)} to {Math.round(currentBal.high)} ML]</span>
            </div>
            <div className="comparison-sub">
              <span>Water Draft Saved: <strong>0 ML</strong></span>
            </div>
          </div>

          <div className="comparison-divider-arrow">&rarr;</div>

          <div className="comparison-card card-after">
            <div className="comparison-badge badge-after">AFTER DIVERSIFICATION</div>
            <div className="comparison-metric">
              <span className="comp-label">Adjusted Seasonal Balance</span>
              <span className={`comp-value ${result.new_balance_ml.mid < 0 ? 'deficit' : 'surplus'}`}>
                <AnimatedStat 
                  value={Math.round(result.new_balance_ml.mid)} 
                  suffix=" ML" 
                  prefix={result.new_balance_ml.mid > 0 ? "+" : ""} 
                />
              </span>
              <span className="comp-range">Range: [{Math.round(result.new_balance_ml.low)} to {Math.round(result.new_balance_ml.high)} ML]</span>
            </div>
            <div className="comparison-sub">
              <span className="highlight-saved">
                Water Draft Saved: <strong>+<AnimatedStat value={Math.round(result.water_saved_ml.mid)} suffix=" ML" /></strong>
              </span>
              <span className="saved-range">Range: [{Math.round(result.water_saved_ml.low)} to {Math.round(result.water_saved_ml.high)} ML]</span>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Economic Metrics */}
      {result && (
        <div className="sim-results-grid">
          <div className="metric-box income-change">
            <span className="metric-title">Farmer Net Margin Delta (Total Village)</span>
            <span className="metric-value">
              <AnimatedStat 
                value={Math.round(result.income_change_inr.mid)} 
                prefix={result.income_change_inr.mid >= 0 ? "+" : ""} 
                suffix=" INR" 
              />
            </span>
            <span className="metric-range">
              Range: [{Math.round(result.income_change_inr.low).toLocaleString()} to {Math.round(result.income_change_inr.high).toLocaleString()} INR]
            </span>
          </div>

          <div className="metric-box confidence-box">
            <span className="metric-title">Rule Evaluation Confidence</span>
            <span className="metric-value" style={{ textTransform: 'uppercase', color: '#ff9500' }}>
              {result.confidence.level}
            </span>
            <span className="metric-range">{result.sources[0]?.name || "Placeholder, awaiting expert review"}</span>
          </div>
        </div>
      )}

      {result?.notes && (
        <div className="sim-notes">
          <strong>Key Assumptions & Agronomic Rules:</strong>
          <ul>
            {result.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
