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
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Hand,
  Radio,
  RotateCcw,
} from 'lucide-react';

interface ComponentActionWidgetProps {
  component: CircuitComponent | null;
  onRotate: () => void;
  onMoveDelta: (dx: number, dz: number) => void;
  onDelete: () => void;
  onInspect: () => void;
  onToggleSwitch?: () => void;
  onTogglePushButton?: () => void;
  onResetFuse?: () => void;
  onAdjustPotentiometer?: (delta: number) => void;
  onDeselect: () => void;
}

export const ComponentActionWidget: React.FC<ComponentActionWidgetProps> = ({
  component,
  onRotate,
  onMoveDelta,
  onDelete,
  onInspect,
  onToggleSwitch,
  onTogglePushButton,
  onResetFuse,
  onAdjustPotentiometer,
  onDeselect,
}) => {
  if (!component) return null;

  return (
    <div
      className="stem-card animate-pulse-glow"
      style={{
        position: 'absolute',
        top: '76px',
        right: '16px',
        zIndex: 30,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '2px solid #0284c7',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(2, 132, 199, 0.22)',
        width: '260px',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {/* Title & Deselect Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '8px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#0284c7',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Đang chọn linh kiện
          </span>
          <h4
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0f172a',
              marginTop: '2px',
            }}
          >
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
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            transition: 'background 0.15s ease',
          }}
          title="Bỏ chọn linh kiện"
        >
          <X size={18} />
        </button>
      </div>

      {/* Touch/Mouse Drag Info Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          borderRadius: '12px',
          backgroundColor: '#eff6ff',
          border: '1px dashed #93c5fd',
          fontSize: '0.78rem',
          color: '#1d4ed8',
          lineHeight: 1.35,
        }}
      >
        <Hand size={18} style={{ flexShrink: 0, color: '#0284c7' }} />
        <span>
          <strong>Dí & Kéo 3D:</strong> Nhấn giữ chuột hoặc ngón tay trực tiếp vào khối trên bàn để kéo tự do!
        </span>
      </div>

      {/* Rotate & Move Controls Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: '#f8fafc',
          padding: '10px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Rotate Button */}
        <button
          className="btn-3d btn-primary"
          style={{
            padding: '8px 12px',
            fontSize: '0.85rem',
            width: '100%',
            justifyContent: 'center',
          }}
          onClick={() => {
            sounds.playClick();
            onRotate();
          }}
          title="Xoay khối 45 độ"
        >
          <RotateCw size={16} />
          <span>Xoay khối (45°)</span>
        </button>

        {/* Directional Move Pad (Nudge arrows) */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#475569',
              textAlign: 'center',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}
          >
            Di chuyển vị trí
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            <div />
            {/* UP / NORTH */}
            <button
              className="btn-3d btn-neutral"
              style={{
                width: '38px',
                height: '34px',
                padding: 0,
                borderRadius: '8px',
              }}
              onClick={() => onMoveDelta(0, -0.5)}
              title="Di chuyển lên trên (Z −)"
            >
              <ArrowUp size={16} color="#0284c7" />
            </button>
            <div />

            {/* LEFT / WEST */}
            <button
              className="btn-3d btn-neutral"
              style={{
                width: '38px',
                height: '34px',
                padding: 0,
                borderRadius: '8px',
              }}
              onClick={() => onMoveDelta(-0.5, 0)}
              title="Di chuyển sang trái (X −)"
            >
              <ArrowLeft size={16} color="#0284c7" />
            </button>

            {/* CENTER ICON */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}
            >
              <Move size={16} />
            </div>

            {/* RIGHT / EAST */}
            <button
              className="btn-3d btn-neutral"
              style={{
                width: '38px',
                height: '34px',
                padding: 0,
                borderRadius: '8px',
              }}
              onClick={() => onMoveDelta(0.5, 0)}
              title="Di chuyển sang phải (X +)"
            >
              <ArrowRight size={16} color="#0284c7" />
            </button>

            <div />
            {/* DOWN / SOUTH */}
            <button
              className="btn-3d btn-neutral"
              style={{
                width: '38px',
                height: '34px',
                padding: 0,
                borderRadius: '8px',
              }}
              onClick={() => onMoveDelta(0, 0.5)}
              title="Di chuyển xuống dưới (Z +)"
            >
              <ArrowDown size={16} color="#0284c7" />
            </button>
            <div />
          </div>
        </div>
      </div>

      {/* Switch Toggle (If Switch Component) */}
      {component.type === 'switch' && onToggleSwitch && (
        <button
          className="btn-3d btn-warning"
          style={{
            padding: '8px 12px',
            fontSize: '0.85rem',
            width: '100%',
            justifyContent: 'center',
          }}
          onClick={onToggleSwitch}
        >
          <ToggleLeft size={16} />
          <span>{component.state.isOpen ? 'Gạt ĐÓNG công tắc' : 'Gạt MỞ công tắc'}</span>
        </button>
      )}

      {/* Push Button Toggle (If Push Button) */}
      {component.type === 'push_button' && onTogglePushButton && (
        <button
          className={`btn-3d ${component.state.isPressed ? 'btn-danger' : 'btn-success'}`}
          style={{
            padding: '8px 12px',
            fontSize: '0.85rem',
            width: '100%',
            justifyContent: 'center',
          }}
          onClick={onTogglePushButton}
        >
          <Radio size={16} />
          <span>{component.state.isPressed ? 'Thả nút bấm (Ngắt điện)' : 'Nhấn GIỮ nút (Đóng điện)'}</span>
        </button>
      )}

      {/* Fuse Safety Status & Reset (If Fuse) */}
      {component.type === 'fuse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '10px',
              backgroundColor: component.state.isBlown ? '#fee2e2' : '#dcfce7',
              color: component.state.isBlown ? '#b91c1c' : '#15803d',
              fontSize: '0.78rem',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            {component.state.isBlown ? '⚠️ CẦU CHÌ ĐÃ ĐỨT BẢO VỆ!' : '✅ Cầu chì nguyên vẹn (1.0A)'}
          </div>
          {component.state.isBlown && onResetFuse && (
            <button
              className="btn-3d btn-primary"
              style={{
                padding: '7px 12px',
                fontSize: '0.82rem',
                width: '100%',
                justifyContent: 'center',
              }}
              onClick={onResetFuse}
            >
              <RotateCcw size={15} />
              <span>Thay cầu chì mới</span>
            </button>
          )}
        </div>
      )}

      {/* Potentiometer Dial Controls (If Potentiometer) */}
      {component.type === 'potentiometer' && onAdjustPotentiometer && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            backgroundColor: '#f1f5f9',
            padding: '8px 10px',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
            <span>Trị số chiết áp:</span>
            <span style={{ color: '#0284c7' }}>{component.state.resistance ?? 50} Ω</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-3d btn-neutral"
              style={{ flex: 1, padding: '5px', fontSize: '0.75rem' }}
              onClick={() => onAdjustPotentiometer(-25)}
              title="Giảm điện trở -> Tăng dòng điện (Đèn sáng hơn)"
            >
              − Giảm (Sáng)
            </button>
            <button
              className="btn-3d btn-neutral"
              style={{ flex: 1, padding: '5px', fontSize: '0.75rem' }}
              onClick={() => onAdjustPotentiometer(25)}
              title="Tăng điện trở -> Giảm dòng điện (Đèn mờ đi)"
            >
              + Tăng (Mờ)
            </button>
          </div>
        </div>
      )}

      {/* Buzzer Sound Indicator (If Buzzer) */}
      {component.type === 'buzzer' && (
        <div
          style={{
            padding: '6px 10px',
            borderRadius: '10px',
            backgroundColor: component.state.isBeeping ? '#e0f2fe' : '#f8fafc',
            color: component.state.isBeeping ? '#0369a1' : '#64748b',
            fontSize: '0.8rem',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {component.state.isBeeping ? '🔊 Đang kêu bíp bíp liên tục!' : '🔇 Đang tắt (chờ mạch kín)'}
        </div>
      )}

      {/* Bottom Actions: Inspect & Delete */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          className="btn-3d btn-neutral"
          style={{
            padding: '8px 10px',
            fontSize: '0.8rem',
            flex: 1,
            justifyContent: 'center',
          }}
          onClick={() => {
            sounds.playClick();
            onInspect();
          }}
          title="Xem thông tin và nguyên lý của linh kiện"
        >
          <Info size={15} color="#0284c7" />
          <span>Tìm hiểu</span>
        </button>

        <button
          className="btn-3d btn-danger"
          style={{
            padding: '8px 10px',
            fontSize: '0.8rem',
            flex: 1,
            justifyContent: 'center',
          }}
          onClick={() => {
            sounds.playWireDisconnect();
            onDelete();
          }}
          title="Xóa linh kiện này khỏi bàn thí nghiệm"
        >
          <Trash2 size={15} />
          <span>Xóa khối</span>
        </button>
      </div>
    </div>
  );
};
