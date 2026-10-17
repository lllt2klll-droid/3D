import React from 'react';
import { sounds } from '../audio/soundEffects';
import { Sun, Wind, Zap, Sparkles, BatteryCharging, ArrowRight } from 'lucide-react';

interface EnergyControlsProps {
  sunlight: number;
  onSunlightChange: (val: number) => void;
  windSpeed: number;
  onWindSpeedChange: (val: number) => void;
}

export const EnergyControls: React.FC<EnergyControlsProps> = ({
  sunlight,
  onSunlightChange,
  windSpeed,
  onWindSpeedChange,
}) => {
  const solarWatts = Math.round(sunlight * 120);
  const windWatts = Math.round(windSpeed * 45);
  const totalWatts = solarWatts + windWatts;

  return (
    <div
      className="stem-card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#10b981" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            Bảng điều khiển Năng lượng Tự nhiên
          </h3>
        </div>

        {/* Total clean energy badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ecfdf5',
            padding: '4px 12px',
            borderRadius: '12px',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontWeight: 800,
            fontSize: '0.88rem',
          }}
        >
          <BatteryCharging size={18} color="#059669" />
          <span>Tổng phát điện: {totalWatts} W</span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}
      >
        {/* Sunlight Control */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '16px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sun size={20} color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e' }}>
                Ánh sáng Mặt Trời
              </span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#b45309' }}>
              {Math.round(sunlight * 100)}% ({solarWatts} W)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sunlight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onSunlightChange(val);
            }}
            style={{
              width: '100%',
              accentColor: '#f59e0b',
              cursor: 'pointer',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#b45309',
              marginTop: '4px',
            }}
          >
            <span>Trời mây râm (0%)</span>
            <span>Nắng vừa (50%)</span>
            <span>Nắng gắt (100%)</span>
          </div>
        </div>

        {/* Wind Speed Control */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wind size={20} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e40af' }}>
                Tốc độ Gió
              </span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1d4ed8' }}>
              Cấp {windSpeed} ({windWatts} W)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={windSpeed}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onWindSpeedChange(val);
            }}
            style={{
              width: '100%',
              accentColor: '#0284c7',
              cursor: 'pointer',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#1e40af',
              marginTop: '4px',
            }}
          >
            <span>Lặng gió (0)</span>
            <span>Gió nhẹ (2)</span>
            <span>Gió mạnh (5)</span>
          </div>
        </div>
      </div>

      {/* Energy Transformation Pipeline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '12px',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          fontSize: '0.82rem',
          color: '#475569',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 700, color: '#0f172a' }}>Chu trình chuyển hóa:</span>
        <span>☀️ Quang năng / 💨 Động năng</span>
        <ArrowRight size={14} />
        <span style={{ color: '#0284c7', fontWeight: 700 }}>⚡ Điện năng sạch</span>
        <ArrowRight size={14} />
        <span>💡 Ánh sáng & 🌀 Gió mát ngôi nhà STEM</span>
      </div>
    </div>
  );
};
