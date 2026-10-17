import React, { useState } from 'react';
import { ComponentType } from '../types';
import { COMPONENT_CATALOG } from '../circuit/componentCatalog';
import { sounds } from '../audio/soundEffects';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react';

interface ComponentSidebarProps {
  onAddComponent: (type: ComponentType) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  onAddComponent,
  isOpen,
  onToggleOpen,
}) => {
  // SVG Graphic Illustrations for each component
  const illustrations: Record<ComponentType, React.ReactNode> = {
    battery: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="16" width="30" height="18" rx="4" fill="#0284C7" />
        <rect x="18" y="16" width="10" height="18" fill="#FACC15" />
        <rect x="38" y="21" width="4" height="8" rx="2" fill="#F59E0B" />
        <rect x="6" y="20" width="2" height="10" rx="1" fill="#94A3B8" />
        <text x="12" y="29" fill="#FFFFFF" fontSize="11" fontWeight="bold">+</text>
        <text x="32" y="29" fill="#FFFFFF" fontSize="11" fontWeight="bold">−</text>
      </svg>
    ),
    bulb: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="20" r="13" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
        <path d="M 18 20 Q 24 12 30 20" stroke="#EA580C" strokeWidth="2" fill="none" />
        <rect x="20" y="32" width="8" height="4" rx="1" fill="#94A3B8" />
        <rect x="21" y="36" width="6" height="3" rx="1" fill="#64748B" />
        <path d="M 24 3 L 24 6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M 37 9 L 35 11" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M 11 9 L 13 11" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    switch: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="30" width="36" height="8" rx="2" fill="#334155" />
        <circle cx="14" cy="26" r="3" fill="#F59E0B" />
        <circle cx="34" cy="26" r="3" fill="#F59E0B" />
        <line x1="14" y1="26" x2="30" y2="12" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="31" cy="11" r="3.5" fill="#EA580C" />
      </svg>
    ),
    fan: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="18" y="28" width="12" height="12" rx="2" fill="#64748B" />
        <circle cx="24" cy="20" r="4" fill="#0284C7" />
        <path d="M 24 16 C 24 8 29 8 30 14 C 30 18 26 18 24 20 Z" fill="#38BDF8" />
        <path d="M 21 23 C 14 27 12 23 16 18 C 19 15 22 18 24 20 Z" fill="#38BDF8" />
        <path d="M 26 23 C 27 31 23 33 20 28 C 18 24 22 22 24 20 Z" fill="#38BDF8" />
      </svg>
    ),
    solar_panel: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="8,34 16,14 40,14 32,34" fill="#1D4ED8" stroke="#D97706" strokeWidth="2" />
        <line x1="12" y1="24" x2="36" y2="24" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="16" y2="34" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="28" y1="14" x2="24" y2="34" stroke="#FFFFFF" strokeWidth="1.5" />
        <polygon points="18,34 20,40 28,40 30,34" fill="#94A3B8" />
      </svg>
    ),
    wind_turbine: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="22,42 23,20 25,20 26,42" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <circle cx="24" cy="20" r="3.5" fill="#0284C7" />
        <path d="M 24 20 L 24 6 Q 25 10 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 24 20 L 36 27 Q 31 26 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 24 20 L 12 27 Q 17 26 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    resistor: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="6" y1="24" x2="42" y2="24" stroke="#94A3B8" strokeWidth="2.5" />
        <rect x="14" y="17" width="20" height="14" rx="4" fill="#D97706" />
        <line x1="18" y1="17" x2="18" y2="31" stroke="#EF4444" strokeWidth="2.5" />
        <line x1="23" y1="17" x2="23" y2="31" stroke="#0F172A" strokeWidth="2.5" />
        <line x1="28" y1="17" x2="28" y2="31" stroke="#F59E0B" strokeWidth="2.5" />
      </svg>
    ),
    led: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M 17 26 C 17 18 20 14 24 14 C 28 14 31 18 31 26 Z" fill="#EF4444" />
        <rect x="16" y="26" width="16" height="3" rx="1" fill="#DC2626" />
        <line x1="21" y1="29" x2="21" y2="40" stroke="#94A3B8" strokeWidth="2" />
        <line x1="27" y1="29" x2="27" y2="36" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="24" cy="18" r="2" fill="#FFFFFF" opacity="0.6" />
      </svg>
    ),
    motor: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="16" width="20" height="18" rx="4" fill="#64748B" />
        <rect x="22" y="10" width="4" height="6" fill="#F59E0B" />
        <circle cx="24" cy="25" r="4" fill="#0284C7" />
      </svg>
    ),
  };

  const componentList: { type: ComponentType; label: string; role: string; tag: string }[] = [
    { type: 'battery', label: 'Pin 1.5V', role: 'Nguồn cung cấp điện', tag: 'Nguồn' },
    { type: 'bulb', label: 'Bóng đèn', role: 'Phát sáng khi kín mạch', tag: 'Tải' },
    { type: 'switch', label: 'Công tắc dao', role: 'Đóng/ngắt mạch điện', tag: 'Điều khiển' },
    { type: 'fan', label: 'Quạt điện', role: 'Động cơ làm quay cánh', tag: 'Tải' },
    { type: 'solar_panel', label: 'Pin Mặt Trời', role: 'Biến ánh sáng thành điện', tag: 'Nguồn xanh' },
    { type: 'wind_turbine', label: 'Tuabin Gió', role: 'Biến sức gió thành điện', tag: 'Nguồn xanh' },
    { type: 'resistor', label: 'Điện trở', role: 'Cản bớt cường độ dòng', tag: 'Bảo vệ' },
    { type: 'led', label: 'Đèn LED', role: 'Phát quang siêu sáng', tag: 'Tải' },
  ];

  return (
    <>
      {/* Toggle Tab on Left Edge */}
      <button
        onClick={() => {
          sounds.playClick();
          onToggleOpen();
        }}
        style={{
          position: 'absolute',
          top: '80px',
          left: isOpen ? '270px' : '0px',
          zIndex: 35,
          backgroundColor: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: isOpen ? '0 12px 12px 0' : '0 14px 14px 0',
          padding: '10px 6px',
          cursor: 'pointer',
          boxShadow: '2px 4px 10px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        title={isOpen ? 'Thu gọn bảng linh kiện' : 'Mở bảng linh kiện'}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Vertical Component Drawer (Left Sidebar) */}
      <aside
        className="stem-card"
        style={{
          position: 'absolute',
          top: '72px',
          left: isOpen ? '12px' : '-280px',
          width: '260px',
          maxHeight: 'calc(100vh - 88px)',
          zIndex: 30,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '4px 10px 30px rgba(15, 23, 42, 0.12)',
          transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#0284c7" />
              <span>Kho Linh Kiện 3D</span>
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Bấm vào linh kiện để thêm vào bàn</p>
          </div>
        </div>

        {/* Scrollable list of Component Cards with Graphic Illustrations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {componentList.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                sounds.playClick();
                onAddComponent(item.type);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Illustration Thumbnail */}
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                {illustrations[item.type]}
              </div>

              {/* Title & Role */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '6px',
                      backgroundColor: item.tag === 'Nguồn' ? '#dbeafe' : item.tag === 'Nguồn xanh' ? '#dcfce7' : '#fef3c7',
                      color: item.tag === 'Nguồn' ? '#1d4ed8' : item.tag === 'Nguồn xanh' ? '#15803d' : '#b45309',
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.role}
                </div>
              </div>

              {/* Add plus badge */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Plus size={14} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};
