import React from 'react';
import { CircuitAnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, Sparkles } from 'lucide-react';

interface CircuitStatusAlertProps {
  analysis: CircuitAnalysisResult;
}

export const CircuitStatusAlert: React.FC<CircuitStatusAlertProps> = ({ analysis }) => {
  let bgColor = '#f0f9ff';
  let borderColor = '#bae6fd';
  let textColor = '#0369a1';
  let icon = <Info size={22} color="#0284c7" />;
  let badgeText = 'Trạng thái mạch';

  if (analysis.isShortCircuit) {
    bgColor = '#fef2f2';
    borderColor = '#fecaca';
    textColor = '#991b1b';
    icon = <ShieldAlert size={24} color="#ef4444" />;
    badgeText = 'CẢNH BÁO NGUY HIỂM';
  } else if (analysis.isClosedCircuit) {
    bgColor = '#f0fdf4';
    borderColor = '#bbf7d0';
    textColor = '#166534';
    icon = <CheckCircle2 size={24} color="#22c55e" />;
    badgeText = 'MẠCH KÍN HOẠT ĐỘNG';
  } else if (analysis.statusType === 'warning') {
    bgColor = '#fffbeb';
    borderColor = '#fde68a';
    textColor = '#92400e';
    icon = <AlertTriangle size={24} color="#f59e0b" />;
    badgeText = 'MẠCH ĐANG HỞ';
  }

  return (
    <div
      className="stem-card"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        transition: 'all 0.25s ease',
        boxShadow: analysis.isClosedCircuit ? '0 4px 14px rgba(34, 197, 94, 0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: textColor,
            }}
          >
            {badgeText}
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: textColor }}>
            {analysis.statusMessage}
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.35 }}>
          {analysis.pedagogicalHint}
        </div>
      </div>

      {analysis.isClosedCircuit && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#dcfce7',
            padding: '6px 12px',
            borderRadius: '12px',
            color: '#15803d',
            fontWeight: 700,
            fontSize: '0.8rem',
            flexShrink: 0,
          }}
        >
          <Sparkles size={16} />
          <span>Dòng điện chạy</span>
        </div>
      )}
    </div>
  );
};
