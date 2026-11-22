import React from 'react';

export default function About() {
  return (
    <div className="about-page-container">
      <h2>About the Village Water Decision Platform</h2>
      <p>
        The platform provides hyper-local, village-level groundwater analytics, seasonal supply-demand budgeting, and crop-switching decision support to assist Gram Panchayats, agricultural extension officers, and water managers.
      </p>
      <h3>Methodology & Standards</h3>
      <ul>
        <li><strong>Crop Water Demand:</strong> Modeled per FAO-56 irrigation guidelines (Kc * ET0).</li>
        <li><strong>Recharge Estimation:</strong> Based on Central Ground Water Board (CGWB) GEC-2015 methodologies.</li>
        <li><strong>Confidence Metrics:</strong> Weighted by spatial proximity to observation wells and measurement recency.</li>
      </ul>
      <p><em>Decision support, not a substitute for expert advice.</em></p>
    </div>
  );
}
