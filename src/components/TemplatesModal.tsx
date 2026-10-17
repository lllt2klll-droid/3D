import React from 'react';
import { CIRCUIT_TEMPLATES, CircuitTemplate } from '../circuit/templates';
import { sounds } from '../audio/soundEffects';
import { X, Play, Zap } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CircuitTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

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
          maxWidth: '560px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              Mẫu mạch điện có sẵn
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Chọn một mẫu mạch để tải nhanh vào bàn thí nghiệm và khám phá
            </p>
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
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CIRCUIT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                transition: 'all 0.15s ease',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Zap size={16} color="#0284c7" />
                  <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>
                    {tmpl.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.3 }}>
                  {tmpl.description}
                </div>
              </div>

              <button
                className="btn-3d btn-primary"
                style={{ padding: '8px 14px', fontSize: '0.85rem', flexShrink: 0 }}
                onClick={() => {
                  sounds.playClick();
                  onSelectTemplate(tmpl);
                  onClose();
                }}
              >
                <Play size={16} fill="white" />
                <span>Nạp mẫu</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
