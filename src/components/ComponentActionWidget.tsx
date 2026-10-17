import React from 'react';
import { CircuitComponent } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  RotateCw,
  Move,
  Trash2,
  Info,
  ToggleLeft,
  X,
} from 'lucide-react';

interface ComponentActionWidgetProps {
  component: CircuitComponent | null;
  onRotate: () => void;
  onDelete: () => void;
  onInspect: () => void;
  onToggleSwitch?: () => void;
  onDeselect: () => void;
}

export const ComponentActionWidget: React.FC<ComponentActionWidgetProps> = ({
  component,
  onRotate,
  onDelete,
  onInspect,
  onToggleSwitch,
  onDeselect,
}) => {
  if (!component) return null;

  return (
    <div
      className="stem-card animate-pulse-glow"
      style={{
        position: 'absolute',
        top: '80px',
        right: '16px',
        zIndex: 30,
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '2px solid #0284c7',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(2, 132, 199, 0.2)',
        minWidth: '220px',
      }}
    >
      {/* Title & Deselect */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
            Đang chọn linh kiện
          </span>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
            {component.name}
          </h4>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onDeselect();
          }}
          style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
          }}
          title="Bỏ chọn"
        >
          <X size={16} />
        </button>
      </div>

      {/* Drag & Move Instruction Hint */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          borderRadius: '10px',
          backgroundColor: '#eff6ff',
          border: '1px dashed #93c5fd',
          fontSize: '0.8rem',
          color: '#1d4ed8',
        }}
      >
        <Move size={16} style={{ flexShrink: 0 }} />
        <span>
          <strong>Dí và kéo:</strong> Nhấn giữ trực tiếp vào linh kiện trên bàn và kéo để di chuyển vị trí!
        </span>
      </div>

      {/* Action Buttons Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Rotate Button */}
        <button
          className="btn-3d btn-primary"
          style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start' }}
          onClick={() => {
            sounds.playClick();
            onRotate();
          }}
          title="Xoay khối 45 độ"
        >
          <RotateCw size={16} />
          <span>Xoay khối (45°)</span>
        </button>

        {/* If Switch: Toggle switch */}
        {component.type === 'switch' && onToggleSwitch && (
          <button
            className="btn-3d btn-warning"
            style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start' }}
            onClick={() => {
              onToggleSwitch();
            }}
          >
            <ToggleLeft size={16} />
            <span>{component.state.isOpen ? 'Gạt ĐÓNG công tắc' : 'Gạt MỞ công tắc'}</span>
          </button>
        )}

        {/* Inspect / Learn */}
        <button
          className="btn-3d btn-neutral"
          style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start' }}
          onClick={() => {
            sounds.playClick();
            onInspect();
          }}
        >
          <Info size={16} color="#0284c7" />
          <span>Tìm hiểu linh kiện</span>
        </button>

        {/* Delete Component */}
        <button
          className="btn-3d btn-danger"
          style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', justifyContent: 'flex-start' }}
          onClick={() => {
            sounds.playWireDisconnect();
            onDelete();
          }}
          title="Xóa linh kiện này khỏi bàn thí nghiệm"
        >
          <Trash2 size={16} />
          <span>Xóa linh kiện này</span>
        </button>
      </div>
    </div>
  );
};
