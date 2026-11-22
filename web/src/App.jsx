import React from 'react';
import Home from './pages/Home';
import Disclaimer from './components/Disclaimer';
import { STRINGS } from './strings';
import './styles.css';

export default function App() {
  return (
    <div className="app-container">
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
  );
}
