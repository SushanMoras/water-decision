import React from 'react';
import VillageScene from './components/VillageScene';
import Home from './pages/Home';
import Disclaimer from './components/Disclaimer';
import { STRINGS } from './strings';
import './styles.css';

export default function App() {
  return (
    <div className="app-root">
      {/* 1. Full-page VillageScene rendered once at the top, outside main content */}
      <VillageScene fullPage />

      {/* 2. App content wrapped with position: relative, z-index: 1 */}
      <div className="app-content-wrapper">
        {/* Sample Data Warning Banner */}
        <div className="banner-wrapper">
          <div className="sample-data-banner">
            <span className="banner-badge">PROTOTYPE</span>
            <span>{STRINGS.sampleBanner}</span>
          </div>
        </div>

        <Home />

        <Disclaimer text={STRINGS.disclaimer} />
      </div>
    </div>
  );
}
