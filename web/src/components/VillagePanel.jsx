import React, { useState, useEffect } from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import ForecastChart from './ForecastChart';
import CropSwitchSlider from './CropSwitchSlider';
import ActionList from './ActionList';
import BriefButton from './BriefButton';
import ShareButton from './ShareButton';
import { fetchForecast, fetchActions } from '../api';

export default function VillagePanel({ village, cropsMeta }) {
  const [activeTab, setActiveTab] = useState("forecast");
  const [forecast, setForecast] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!village) return;

    async function loadVillageDetails() {
      setLoading(true);
      setError(null);
      try {
        const [fData, aData] = await Promise.all([
          fetchForecast(village.id, "2027-pre-summer"),
          fetchActions(village.id, "kharif")
        ]);
        setForecast(fData);
        setActions(aData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVillageDetails();
  }, [village?.id]);

  if (!village) {
    return (
      <div className="village-panel-empty">
        <div className="empty-label">Select a Village to Inspect</div>
        <p>Click any colored marker on the district map to analyze groundwater drawdown, seasonal water balances, and simulate diversification scenarios.</p>
      </div>
    );
  }

  const stressColorClass = `badge-stress-${village.stress_class}`;
  const totalAreaText = village.area_ha != null ? `${village.area_ha} ha` : "Not available";
  const populationText = village.population != null ? Number(village.population).toLocaleString() : "Not available";

  const topAction = actions.length > 0 ? actions[0] : null;
  const balanceRangeText = forecast?.balance_ml 
    ? `[${forecast.balance_ml.low > 0 ? "+" : ""}${Math.round(forecast.balance_ml.low)} to ${forecast.balance_ml.high > 0 ? "+" : ""}${Math.round(forecast.balance_ml.high)} ML]`
    : "computing...";
  const topActionTitle = topAction ? topAction.title : "Community managed aquifer recharge & micro-irrigation";

  return (
    <div className="village-panel-card">
      {/* 1. Hero Card at Top */}
      <div className="village-hero-card">
        <div className="hero-content">
          <p className="hero-plain-sentence">
            <span className="hero-village-name">{village.name}</span> is currently facing{" "}
            <span className="hero-accent-text">{village.stress_class} groundwater stress</span> with a projected seasonal balance of{" "}
            <span className="hero-accent-text">{balanceRangeText}</span>, where the primary recommended intervention is{" "}
            <span className="hero-accent-text">{topActionTitle}</span>.
          </p>
        </div>
      </div>

      <div className="village-panel-header">
        <div className="header-info">
          <h2 className="village-name-title">{village.name}</h2>
          <div className="village-meta-row">
            <span>District: <strong>{village.district || "Not available"}</strong></span>
            <span>Block: <strong>{village.block || "Not available"}</strong></span>
            <span>Population: <strong>{populationText}</strong></span>
            <span>Total Area: <strong>{totalAreaText}</strong></span>
          </div>
        </div>

        <div className="header-actions">
          <div className="badge-row">
            <span className={`stress-class-pill ${stressColorClass}`}>
              {village.stress_class.toUpperCase()} STRESS ({Math.round(village.stress_score?.mid || 0)}%)
            </span>
            <ConfidenceBadge confidence={village.confidence} />
          </div>
          <div className="btn-actions-row">
            <BriefButton villageId={village.id} season="2027-pre-summer" />
            <ShareButton village={village} forecast={forecast} topAction={topAction} />
          </div>
        </div>
      </div>

      {loading && <div className="panel-loading-state">Refreshing observation datasets...</div>}
      {error && <div className="panel-error-state">Error: {error}</div>}

      {!loading && !error && (
        <div className="panel-tabs-section">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'forecast' ? 'active' : ''}`}
              onClick={() => setActiveTab('forecast')}
            >
              Forecast & Water Balance
            </button>
            <button 
              className={`tab-btn ${activeTab === 'whatif' ? 'active' : ''}`}
              onClick={() => setActiveTab('whatif')}
            >
              What-If Crop Scenario
            </button>
            <button 
              className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Priority Interventions ({actions.length})
            </button>
          </div>

          <div className="tab-content-area">
            {activeTab === 'forecast' && (
              <div className="forecast-tab">
                {forecast && (
                  <>
                    <div className="balance-summary-row">
                      <div className="summary-card">
                        <span className="card-label">Projected Water Table</span>
                        <span className="card-val">{forecast.water_level_bgl?.mid} m bgl</span>
                        <span className="card-sub">Range: [{forecast.water_level_bgl?.low} to {forecast.water_level_bgl?.high} m]</span>
                      </div>
                      <div className="summary-card">
                        <span className="card-label">Seasonal Supply</span>
                        <span className="card-val">{Math.round(forecast.supply_ml?.mid || 0)} ML</span>
                        <span className="card-sub">Rain recharge + return flow</span>
                      </div>
                      <div className="summary-card">
                        <span className="card-label">Seasonal Demand</span>
                        <span className="card-val">{Math.round(forecast.demand_ml?.mid || 0)} ML</span>
                        <span className="card-sub">Crop + domestic + livestock</span>
                      </div>
                      <div className="summary-card" style={{ borderColor: forecast.balance_ml?.mid < 0 ? '#ff3b30' : '#34c759' }}>
                        <span className="card-label">Net Water Balance</span>
                        <span className="card-val" style={{ color: forecast.balance_ml?.mid < 0 ? 'var(--stress-critical)' : 'var(--stress-safe)' }}>
                          {forecast.balance_ml?.mid > 0 ? "+" : ""}{Math.round(forecast.balance_ml?.mid || 0)} ML
                        </span>
                        <span className="card-sub">
                          {forecast.balance_ml?.mid < 0 ? "Depleting overdraft" : "Sustainable buffer"}
                        </span>
                      </div>
                    </div>

                    <ForecastChart forecast={forecast} />
                  </>
                )}
              </div>
            )}

            {activeTab === 'whatif' && (
              <CropSwitchSlider 
                village={village} 
                cropsMeta={cropsMeta} 
                baselineBalance={forecast?.balance_ml}
              />
            )}

            {activeTab === 'actions' && (
              <ActionList actions={actions} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
