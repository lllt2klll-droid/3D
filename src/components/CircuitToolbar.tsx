import React from 'react';
import { ComponentType, WireColor, CircuitComponent } from '../types';
import { COMPONENT_CATALOG } from '../circuit/componentCatalog';
import { sounds } from '../audio/soundEffects';
import {
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
  Undo2,
  Info,
  Check,
} from 'lucide-react';

interface CircuitToolbarProps {
  onAddComponent: (type: ComponentType) => void;
  selectedWireColor: WireColor;
  onSelectWireColor: (color: WireColor) => void;
  onClearWires: () => void;
  onResetCircuit: () => void;
  onOpenTemplates: () => void;
  onLoadQuickTemplate: (templateId: string) => void;
  connectingTerminal: string | null;
  onCancelConnecting: () => void;
  selectedComponent: CircuitComponent | null;
  onDeleteSelectedComponent: () => void;
  onInspectSelectedComponent: () => void;
  onToggleSwitchComponent?: () => void;
  onDeselectComponent: () => void;
  canUndo: boolean;
  onUndo: () => void;
}

export const CircuitToolbar: React.FC<CircuitToolbarProps> = ({
  onAddComponent,
  selectedWireColor,
  onSelectWireColor,
  onClearWires,
  onResetCircuit,
  onOpenTemplates,
  onLoadQuickTemplate,
  connectingTerminal,
  onCancelConnecting,
  selectedComponent,
  onDeleteSelectedComponent,
  onInspectSelectedComponent,
  onToggleSwitchComponent,
  onDeselectComponent,
  canUndo,
  onUndo,
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
        gap: '8px',
        width: '100%',
      }}
    >
      {/* Active Connecting Notice (when in the middle of wire connection) */}
      {connectingTerminal && (
        <div
          className="stem-card animate-pulse-glow"
          style={{
            backgroundColor: '#eff6ff',
            borderColor: '#93c5fd',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#1d4ed8' }}>
            <Zap size={20} color="#0284c7" />
            <span>
              <strong>Đang chọn nối dây:</strong> Các chốt kim loại đang nhấp nháy sáng trên bàn. Hãy bấm vào một chốt khác để hoàn thành đoạn dây!
            </span>
          </div>
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            onClick={onCancelConnecting}
          >
            Hủy nối
          </button>
        </div>
      )}

      {/* Selected Component Quick Action Card */}
      {selectedComponent && (
        <div
          className="stem-card"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#0284c7',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
              Đang chọn:
            </span>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
              {selectedComponent.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedComponent.type === 'switch' && onToggleSwitchComponent && (
              <button
                className="btn-3d btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                onClick={onToggleSwitchComponent}
              >
                <ToggleLeft size={16} />
                <span>{selectedComponent.state.isOpen ? 'Đóng công tắc' : 'Mở công tắc'}</span>
              </button>
            )}

            <button
              className="btn-3d btn-neutral"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={onInspectSelectedComponent}
            >
              <Info size={16} color="#0284c7" />
              <span>Tìm hiểu</span>
            </button>

            <button
              className="btn-3d btn-danger"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={onDeleteSelectedComponent}
              title="Xóa linh kiện này khỏi bàn thí nghiệm"
            >
              <Trash2 size={16} />
              <span>Xóa linh kiện này</span>
            </button>

            <button
              className="btn-3d btn-neutral"
              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              onClick={onDeselectComponent}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Main Control Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '100%', padding: '4px 0' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
            Thêm linh kiện:
          </span>

          {componentButtons.map((btn) => (
            <button
              key={btn.type}
              className="btn-3d btn-neutral"
              style={{
                padding: '6px 11px',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                gap: '5px',
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

        {/* Wire Colors & Fast Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

          {/* Quick Undo Button */}
          {canUndo && (
            <button
              className="btn-3d btn-neutral"
              style={{ padding: '6px 11px', fontSize: '0.82rem' }}
              onClick={() => {
                sounds.playClick();
                onUndo();
              }}
              title="Hoàn tác thao tác vừa rồi"
            >
              <Undo2 size={16} color="#0284c7" />
              <span>Hoàn tác</span>
            </button>
          )}

          {/* Clear Wires */}
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 11px', fontSize: '0.82rem' }}
            onClick={() => {
              sounds.playWireDisconnect();
              onClearWires();
            }}
            title="Tháo hết tất cả dây nối"
          >
            <Trash2 size={16} color="#ef4444" />
            <span>Tháo dây</span>
          </button>

          {/* Reset Circuit */}
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 11px', fontSize: '0.82rem' }}
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

      {/* 1-Click Quick Preset Circuits Bar (Convenient!) */}
      <div
        className="stem-card"
        style={{
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          overflowX: 'auto',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7', whiteSpace: 'nowrap' }}>
          ⚡ Mạch mẫu 1-chạm:
        </span>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('simple_bulb')}
        >
          <Lightbulb size={15} color="#eab308" />
          <span>Mạch Đèn</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('motor_fan')}
        >
          <Fan size={15} color="#0284c7" />
          <span>Mạch Quạt</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('solar_light')}
        >
          <Sun size={15} color="#f59e0b" />
          <span>Pin Mặt Trời</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('wind_fan')}
        >
          <Wind size={15} color="#10b981" />
          <span>Tuabin Gió</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('empty')}
        >
          <Trash2 size={15} color="#64748b" />
          <span>Bàn trống</span>
        </button>

        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn-3d btn-neutral"
            style={{ padding: '5px 12px', fontSize: '0.82rem' }}
            onClick={onOpenTemplates}
            title="Xem tất cả mẫu mạch và hướng dẫn"
          >
            <FolderOpen size={15} color="#0284c7" />
            <span>Tất cả mẫu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
