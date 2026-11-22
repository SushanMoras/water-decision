import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STRESS_COLORS = {
  critical: "#ef4444",
  stressed: "#f97316",
  watch: "#eab308",
  safe: "#22c55e",
  unknown: "#94a3b8"
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ villages = [], selectedVillage, onSelectVillage }) {
  // Center map around Sangrur by default
  const defaultCenter = [30.245, 75.845];
  const center = selectedVillage ? [selectedVillage.lat, selectedVillage.lon] : defaultCenter;

  return (
    <div className="map-wrapper">
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", minHeight: "420px" }}
      >
        <ChangeView center={center} zoom={selectedVillage ? 11 : 10} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {villages.map((v) => {
          const isSelected = selectedVillage && selectedVillage.id === v.id;
          const markerColor = STRESS_COLORS[v.stress_class] || STRESS_COLORS.unknown;

          return (
            <CircleMarker
              key={v.id}
              center={[v.lat, v.lon]}
              radius={isSelected ? 11 : 8}
              pathOptions={{
                fillColor: markerColor,
                fillOpacity: 0.85,
                color: isSelected ? "#0f172a" : "#ffffff",
                weight: isSelected ? 3 : 1.5
              }}
              eventHandlers={{
                click: () => onSelectVillage(v)
              }}
            >
              <Popup>
                <div className="map-popup">
                  <div className="popup-name"><strong>{v.name}</strong></div>
                  <div>Block: {v.block}</div>
                  <div>
                    Stress Class: <strong style={{ color: markerColor }}>{v.stress_class.toUpperCase()}</strong>
                  </div>
                  <div>Stress Score: {v.stress_score.mid}%</div>
                  <div>Confidence: {v.confidence.level.toUpperCase()}</div>
                  <button 
                    className="popup-select-btn" 
                    onClick={() => onSelectVillage(v)}
                  >
                    Select Village
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
