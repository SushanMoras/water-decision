import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function ForecastChart({ forecast }) {
  if (!forecast) return null;

  const { history = [], water_level_bgl, baseline_comparison = {} } = forecast;

  // Format data for Recharts
  const chartData = history.map((item) => ({
    date: item.date,
    historical: item.level_bgl_m,
    projected: null,
    low: null,
    high: null,
    persistence: null,
    seasonal_avg: null,
    linear_rain: null
  }));

  // Append projected point
  if (water_level_bgl) {
    const lastHist = history.length > 0 ? history[history.length - 1].level_bgl_m : 32.0;
    
    // Connect historical to forecast
    if (chartData.length > 0) {
      chartData[chartData.length - 1].projected = lastHist;
      chartData[chartData.length - 1].low = lastHist;
      chartData[chartData.length - 1].high = lastHist;
    }

    chartData.push({
      date: forecast.season || "2027 Proj",
      historical: null,
      projected: water_level_bgl.mid,
      low: water_level_bgl.low,
      high: water_level_bgl.high,
      persistence: baseline_comparison.persistence,
      seasonal_avg: baseline_comparison.seasonal_avg,
      linear_rain: baseline_comparison.linear_rain
    });
  }

  return (
    <div className="forecast-chart-card">
      <div className="chart-header">
        <div className="chart-title">Quarterly Water Table Depth & Projected Season (m bgl)</div>
        <div className="chart-subtitle">
          Inverted scale (deeper = more depleted). Shaded area represents uncertainty range [{water_level_bgl?.low}m - {water_level_bgl?.high}m].
        </div>
      </div>
      <div className="chart-container" style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis 
              reversed={true} 
              domain={['auto', 'auto']} 
              unit=" m" 
              tick={{ fontSize: 11 }}
              label={{ value: 'Depth (m bgl)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (value === null || value === undefined) return ["-", name];
                return [`${value} m`, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            
            {/* Projected Band */}
            <Area type="monotone" dataKey="high" stroke="none" fill="#fecaca" fillOpacity={0.4} name="High Bound (Deepest)" />
            <Area type="monotone" dataKey="low" stroke="none" fill="#ffffff" fillOpacity={0.9} name="Low Bound" />
            
            {/* Historical Series */}
            <Line type="monotone" dataKey="historical" stroke="#0284c7" strokeWidth={2.2} dot={{ r: 3 }} name="Historical Observation" />
            
            {/* Projected Mid */}
            <Line type="monotone" dataKey="projected" stroke="#dc2626" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 5 }} name="Projected Model Level" />
            
            {/* Baselines */}
            <Line type="monotone" dataKey="persistence" stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="2 2" dot={{ r: 3 }} name="Baseline (Persistence)" />
            <Line type="monotone" dataKey="seasonal_avg" stroke="#64748b" strokeWidth={1.2} strokeDasharray="3 3" dot={{ r: 3 }} name="Baseline (Seasonal Avg)" />
            <Line type="monotone" dataKey="linear_rain" stroke="#38bdf8" strokeWidth={1.2} strokeDasharray="1 1" dot={{ r: 3 }} name="Baseline (Linear Rain)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {!baseline_comparison.model_beats_baseline && (
        <div className="baseline-warning-box">
          ℹ️ <strong>Baseline Notice:</strong> The statistical model did not outperform historical seasonal persistence baselines on held-out test data. Refer to baseline benchmarks first.
        </div>
      )}
    </div>
  );
}
