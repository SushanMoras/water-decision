import React from 'react';

export default function Disclaimer({ text = "Decision support, not a substitute for expert advice." }) {
  return (
    <footer className="app-disclaimer">
      <div className="disclaimer-content">
        <span className="disclaimer-text"><strong>DISCLAIMER:</strong> {text}</span>
      </div>
    </footer>
  );
}
