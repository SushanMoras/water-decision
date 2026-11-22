import React, { useState, useEffect } from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import ForecastChart from './ForecastChart';
import CropSwitchSlider from './CropSwitchSlider';
import ActionList from './ActionList';
import BriefButton from './BriefButton';
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
        <div className="empty-icon">📍</div>
        <h3>Select a Village to Inspect</h3>
        <p>Click any colored marker on the district map to analyze groundwater drawdown, seasonal water balances, and simulate diversification scenarios.</p>
      </div>
    );
  }

  const stressColorClass = `badge-stress-${village.stress_class}`;
  const totalAreaText = village.area_ha != null ? `${village.area_ha} ha` : "Not available";
  const populationText = village.population != null ? Number(village.population).toLocaleString() : "Not available";

  return (
    <div className="village-panel-card">
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
              {village.stress_class.toUpperCase()} STRESS ({village.stress_score?.mid}%)
            </span>
            <ConfidenceBadge confidence={village.confidence} />
          </div>
          <BriefButton villageId={village.id} season="2027-pre-summer" />
        </div>
      </div>

      {loading && <div className="panel-loading-state">Refreshing observation datasets...</div>}
      {error && <div className="panel-error-state">⚠️ Error: {error}</div>}

      {!loading && !error && (
        <div className="panel-tabs-section">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'forecast' ? 'active' : ''}`}
              onClick={() => setActiveTab('forecast')}
            >
              📊 Forecast & Water Balance
            </button>
            <button 
              className={`tab-btn ${activeTab === 'whatif' ? 'active' : ''}`}
              onClick={() => setActiveTab('whatif')}
            >
              🌾 What-If Crop Scenario
            </button>
            <button 
              className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              🛠️ Priority Interventions ({actions.length})
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
                        <span className="card-val">{forecast.supply_ml?.mid} ML</span>
                        <span className="card-sub">Rain recharge + return flow</span>
                      </div>
                      <div className="summary-card">
                        <span className="card-label">Seasonal Demand</span>
                        <span className="card-val">{forecast.demand_ml?.mid} ML</span>
                        <span className="card-sub">Crop + domestic + livestock</span>
                      </div>
                      <div className="summary-card" style={{ borderColor: forecast.balance_ml?.mid < 0 ? '#fca5a5' : '#86efac' }}>
                        <span className="card-label">Net Water Balance</span>
                        <span className="card-val" style={{ color: forecast.balance_ml?.mid < 0 ? '#b91c1c' : '#15803d' }}>
                          {forecast.balance_ml?.mid} ML
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
              <CropSwitchSlider village={village} cropsMeta={cropsMeta} />
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
