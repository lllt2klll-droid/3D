import React from 'react';
import { WireColor } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  Trash2,
  FolderOpen,
  RotateCcw,
  Zap,
  Undo2,
  Lightbulb,
  Fan,
  Sun,
  Wind,
  Bell,
  ShieldCheck,
} from 'lucide-react';

interface CircuitToolbarProps {
  selectedWireColor: WireColor;
  onSelectWireColor: (color: WireColor) => void;
  onClearWires: () => void;
  onResetCircuit: () => void;
  onOpenTemplates: () => void;
  onLoadQuickTemplate: (templateId: string) => void;
  connectingTerminal: string | null;
  onCancelConnecting: () => void;
  canUndo: boolean;
  onUndo: () => void;
}

export const CircuitToolbar: React.FC<CircuitToolbarProps> = ({
  selectedWireColor,
  onSelectWireColor,
  onClearWires,
  onResetCircuit,
  onOpenTemplates,
  onLoadQuickTemplate,
  connectingTerminal,
  onCancelConnecting,
  canUndo,
  onUndo,
}) => {
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

      {/* Main Control Bar: Wire Colors & Table Management */}
      <div
        className="stem-card"
        style={{
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
        }}
      >
        {/* Wire Color Picker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            padding: '4px 10px',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Màu dây nối:</span>
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
                  width: '28px',
                  height: '28px',
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

        {/* Quick Table Actions: Undo, Clear Wires, Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {canUndo && (
            <button
              className="btn-3d btn-neutral"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
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

          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              sounds.playWireDisconnect();
              onClearWires();
            }}
            title="Tháo hết tất cả dây nối"
          >
            <Trash2 size={16} color="#ef4444" />
            <span>Tháo dây</span>
          </button>

          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            onClick={() => {
              sounds.playClick();
              onResetCircuit();
            }}
            title="Làm mới bàn thí nghiệm về ban đầu"
          >
            <RotateCcw size={16} color="#f59e0b" />
            <span>Làm mới bàn</span>
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
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
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
          onClick={() => onLoadQuickTemplate('doorbell_buzzer')}
        >
          <Bell size={15} color="#8b5cf6" />
          <span>Mạch Chuông</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '5px 12px', fontSize: '0.82rem' }}
          onClick={() => onLoadQuickTemplate('fuse_protection')}
        >
          <ShieldCheck size={15} color="#ef4444" />
          <span>Cầu Chì</span>
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
