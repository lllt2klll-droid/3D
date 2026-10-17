import React from 'react';
import { ComponentType, WireColor } from '../types';
import { COMPONENT_CATALOG } from '../circuit/componentCatalog';
import { sounds } from '../audio/soundEffects';
import {
  Plus,
  Trash2,
  FolderOpen,
  RotateCcw,
  Zap,
  Battery,
  Lightbulb,
  ToggleLeft,
  Fan,
  Sun,
  Wind,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CircuitToolbarProps {
  onAddComponent: (type: ComponentType) => void;
  selectedWireColor: WireColor;
  onSelectWireColor: (color: WireColor) => void;
  onClearWires: () => void;
  onResetCircuit: () => void;
  onOpenTemplates: () => void;
  connectingTerminal: string | null;
  onCancelConnecting: () => void;
}

export const CircuitToolbar: React.FC<CircuitToolbarProps> = ({
  onAddComponent,
  selectedWireColor,
  onSelectWireColor,
  onClearWires,
  onResetCircuit,
  onOpenTemplates,
  connectingTerminal,
  onCancelConnecting,
}) => {
  const componentButtons: { type: ComponentType; label: string; icon: React.ReactNode }[] = [
    { type: 'battery', label: 'Pin 1.5V', icon: <Battery size={18} /> },
    { type: 'switch', label: 'Công tắc', icon: <ToggleLeft size={18} /> },
    { type: 'bulb', label: 'Bóng đèn', icon: <Lightbulb size={18} /> },
    { type: 'fan', label: 'Quạt điện', icon: <Fan size={18} /> },
    { type: 'solar_panel', label: 'Pin mặt trời', icon: <Sun size={18} /> },
    { type: 'wind_turbine', label: 'Tuabin gió', icon: <Wind size={18} /> },
    { type: 'resistor', label: 'Điện trở', icon: <Layers size={18} /> },
    { type: 'led', label: 'Đèn LED', icon: <Sparkles size={18} /> },
  ];

  const wireColors: { id: WireColor; label: string; hex: string }[] = [
    { id: 'red', label: 'Đỏ (+)', hex: '#ef4444' },
    { id: 'black', label: 'Đen (−)', hex: '#0f172a' },
    { id: 'blue', label: 'Xanh', hex: '#2563eb' },
    { id: 'yellow', label: 'Vàng', hex: '#eab308' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
      }}
    >
      {/* Active Connecting Notice (if in the middle of wire connection) */}
      {connectingTerminal && (
        <div
          className="stem-card animate-pulse-glow"
          style={{
            backgroundColor: '#eff6ff',
            borderColor: '#93c5fd',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1d4ed8' }}>
            <Zap size={18} />
            <span>
              <strong>Đang nối dây:</strong> Hãy bấm vào chốt kim loại thứ hai để hoàn thành đoạn dây!
            </span>
          </div>
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={onCancelConnecting}
          >
            Hủy nối
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div
        className="stem-card"
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Component Add Palette */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '100%', padding: '4px 0' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
            Thêm linh kiện:
          </span>

          {componentButtons.map((btn) => (
            <button
              key={btn.type}
              className="btn-3d btn-neutral"
              style={{
                padding: '7px 12px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                gap: '6px',
              }}
              onClick={() => {
                sounds.playClick();
                onAddComponent(btn.type);
              }}
              title={COMPONENT_CATALOG[btn.type]?.shortDesc}
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Wire Color Picker & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Wire Color Picker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              padding: '4px 8px',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Màu dây:</span>
            {wireColors.map((wc) => {
              const isSelected = selectedWireColor === wc.id;
              return (
                <button
                  key={wc.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectWireColor(wc.id);
                  }}
                  title={wc.label}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: wc.hex,
                    border: isSelected ? '3px solid #ffffff' : '2px solid rgba(0,0,0,0.1)',
                    boxShadow: isSelected ? '0 0 0 2px #0284c7' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              );
            })}
          </div>

          {/* Templates Button */}
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              sounds.playClick();
              onOpenTemplates();
            }}
            title="Chọn các mẫu mạch có sẵn"
          >
            <FolderOpen size={16} color="#0284c7" />
            <span>Mẫu mạch</span>
          </button>

          {/* Clear Wires */}
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              sounds.playWireDisconnect();
              onClearWires();
            }}
            title="Tháo hết tất cả dây dẫn trong mạch"
          >
            <Trash2 size={16} color="#ef4444" />
            <span>Tháo dây</span>
          </button>

          {/* Reset Circuit */}
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            onClick={() => {
              sounds.playClick();
              onResetCircuit();
            }}
            title="Làm mới bàn thí nghiệm về ban đầu"
          >
            <RotateCcw size={16} color="#f59e0b" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>
    </div>
  );
};
