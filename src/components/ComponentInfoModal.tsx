import React from 'react';
import { ComponentCatalogItem } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  X,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

interface ComponentInfoModalProps {
  item: ComponentCatalogItem | null;
  onClose: () => void;
  onAddToLab?: (type: ComponentCatalogItem['type']) => void;
}

export const ComponentInfoModal: React.FC<ComponentInfoModalProps> = ({
  item,
  onClose,
  onAddToLab,
}) => {
  if (!item) return null;

  const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
    source: { bg: '#dbeafe', text: '#1d4ed8', label: 'Nguồn cung cấp điện' },
    load: { bg: '#fef3c7', text: '#b45309', label: 'Thiết bị tiêu thụ điện' },
    control: { bg: '#f3e8ff', text: '#7e22ce', label: 'Thiết bị điều khiển' },
    passive: { bg: '#e2e8f0', text: '#334155', label: 'Linh kiện bổ trợ' },
  };

  const catInfo = categoryColors[item.category] || categoryColors.passive;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="stem-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  backgroundColor: catInfo.bg,
                  color: catInfo.text,
                }}
              >
                {catInfo.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.specs}</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {item.vietnameseName}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
              Tên tiếng Anh: {item.name}
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {/* Summary */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.95rem',
              color: '#334155',
              lineHeight: 1.5,
            }}
          >
            {item.fullDesc}
          </div>

          {/* How it works */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#1d4ed8',
                marginBottom: '6px',
                fontSize: '0.95rem',
              }}
            >
              <Lightbulb size={18} />
              <span>Nguyên lý hoạt động</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>
              {item.howItWorks}
            </div>
          </div>

          {/* Fun fact */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#fefce8',
              border: '1px solid #fef08a',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#854d0e',
                marginBottom: '6px',
                fontSize: '0.95rem',
              }}
            >
              <Sparkles size={18} />
              <span>Em có biết?</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#713f12', lineHeight: 1.5 }}>
              {item.funFact}
            </div>
          </div>

          {/* Pedagogical Exploration Question */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                color: '#6b21a8',
                marginBottom: '6px',
                fontSize: '0.95rem',
              }}
            >
              <HelpCircle size={18} />
              <span>Câu hỏi khám phá</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#581c87', fontWeight: 600, lineHeight: 1.5 }}>
              {item.challengeQuestion}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {onAddToLab && (
            <button
              className="btn-3d btn-primary"
              onClick={() => {
                sounds.playClick();
                onAddToLab(item.type);
                onClose();
              }}
            >
              <CheckCircle size={18} />
              <span>Lắp vào bàn thí nghiệm</span>
            </button>
          )}

          <button
            className="btn-3d btn-neutral"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
          >
            <span>Đã hiểu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
