import React, { useState, useEffect } from 'react';
import { postScenario } from '../api';

export default function CropSwitchSlider({ village, cropsMeta = {} }) {
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

      {result && (
        <div className="sim-results-grid">
          <div className="metric-box water-saved">
            <span className="metric-title">Groundwater Draft Saved</span>
            <span className="metric-value">+{result.water_saved_ml.mid} ML</span>
            <span className="metric-range">Range: [{result.water_saved_ml.low} to {result.water_saved_ml.high} ML]</span>
          </div>

          <div className="metric-box income-change">
            <span className="metric-title">Farmer Net Margin Delta</span>
            <span className="metric-value">
              {result.income_change_inr.mid >= 0 ? "+" : ""}{result.income_change_inr.mid.toLocaleString()} INR
            </span>
            <span className="metric-range">
              Range: [{result.income_change_inr.low.toLocaleString()} to {result.income_change_inr.high.toLocaleString()} INR]
            </span>
          </div>

          <div className="metric-box new-balance">
            <span className="metric-title">Adjusted Net Aquifer Balance</span>
            <span className="metric-value" style={{ color: result.new_balance_ml.mid < 0 ? "#b91c1c" : "#15803d" }}>
              {result.new_balance_ml.mid > 0 ? "+" : ""}{result.new_balance_ml.mid} ML
            </span>
            <span className="metric-range">Range: [{result.new_balance_ml.low} to {result.new_balance_ml.high} ML]</span>
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
