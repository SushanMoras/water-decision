import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import StressLegend from '../components/StressLegend';
import VillagePanel from '../components/VillagePanel';
import { fetchDistricts, fetchVillages, fetchCropsMeta } from '../api';
import { STRINGS } from '../strings';

export default function Home() {
  const [districts, setDistricts] = useState(["Sangrur"]);
  const [selectedDistrict, setSelectedDistrict] = useState("Sangrur");
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [cropsMeta, setCropsMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [dList, cMeta] = await Promise.all([
          fetchDistricts(),
          fetchCropsMeta()
        ]);
        setDistricts(dList);
        setCropsMeta(cMeta);

        const vList = await fetchVillages(selectedDistrict);
        setVillages(vList);
        if (vList.length > 0) {
          setSelectedVillage(vList[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [selectedDistrict]);

  const handleDistrictChange = async (dist) => {
    setSelectedDistrict(dist);
    setLoading(true);
    setError(null);
    try {
      const vList = await fetchVillages(dist);
      setVillages(vList);
      setSelectedVillage(vList.length > 0 ? vList[0] : null);
    } catch (err) {
      setError(err.message);
      setVillages([]);
      setSelectedVillage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-layout">
      {/* Top Bar Navigation */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="logo-icon">💧</div>
            <div>
              <h1 className="app-title">{STRINGS.appName}</h1>
              <p className="app-tagline">{STRINGS.tagline}</p>
            </div>
          </div>

          <div className="header-controls">
            <div className="district-selector-box">
              <label htmlFor="district-select">{STRINGS.districtLabel}</label>
              <select
                id="district-select"
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="district-select"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="lang-toggle-box">
              <button type="button" className="lang-btn lang-active" aria-label="English">EN</button>
              <button type="button" className="lang-btn lang-disabled" disabled title="Coming soon">HI</button>
              <button type="button" className="lang-btn lang-disabled" disabled title="Coming soon">PA</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content-grid">
        <section className="left-panel-column">
          <div className="map-card-container">
            <div className="map-card-header">
              <h3>District Hydrogeological Map ({villages.length} Monitored Villages)</h3>
              <span className="map-hint">Click marker to inspect</span>
            </div>
            {loading && <div className="map-loading-overlay">Loading village coordinates...</div>}
            {error && (
              <div className="map-error-state">
                <p>⚠️ {error}</p>
                <button onClick={() => handleDistrictChange(selectedDistrict)}>Retry</button>
              </div>
            )}
            {!error && (
              <>
                <MapView 
                  villages={villages} 
                  selectedVillage={selectedVillage} 
                  onSelectVillage={(v) => setSelectedVillage(v)} 
                />
                <StressLegend />
              </>
            )}
          </div>
        </section>

        <section className="right-panel-column">
          <VillagePanel 
            village={selectedVillage} 
            cropsMeta={cropsMeta} 
          />
        </section>
      </main>
    </div>
  );
}
