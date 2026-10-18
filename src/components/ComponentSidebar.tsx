import React, { useState } from 'react';
import { ComponentType } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Sparkles,
} from 'lucide-react';

interface ComponentSidebarProps {
  onAddComponent?: (type: ComponentType) => void;
  onSelectComponent?: (type: ComponentType) => void;
  selectedComponentType?: ComponentType;
  isOpen: boolean;
  onToggleOpen: () => void;
}

type FilterCategory = 'all' | 'source' | 'load' | 'control';

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  onAddComponent,
  onSelectComponent,
  selectedComponentType,
  isOpen,
  onToggleOpen,
}) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const isExploreMode = Boolean(onSelectComponent);

  // Rich SVG Graphic Illustrations for all 14 components
  const illustrations: Record<ComponentType, React.ReactNode> = {
    battery: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="16" width="30" height="18" rx="4" fill="#0284C7" />
        <rect x="18" y="16" width="10" height="18" fill="#FACC15" />
        <rect x="38" y="21" width="4" height="8" rx="2" fill="#F59E0B" />
        <rect x="6" y="20" width="2" height="10" rx="1" fill="#94A3B8" />
        <text x="12" y="29" fill="#FFFFFF" fontSize="11" fontWeight="bold">+</text>
        <text x="32" y="29" fill="#FFFFFF" fontSize="11" fontWeight="bold">−</text>
      </svg>
    ),
    battery_pack: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="12" width="38" height="26" rx="4" fill="#1E293B" />
        <rect x="8" y="15" width="28" height="9" rx="2" fill="#0284C7" />
        <rect x="8" y="26" width="28" height="9" rx="2" fill="#10B981" />
        <rect x="36" y="17" width="3" height="5" rx="1" fill="#F59E0B" />
        <rect x="36" y="28" width="3" height="5" rx="1" fill="#F59E0B" />
        <text x="18" y="22" fill="#FFFFFF" fontSize="7" fontWeight="bold">1.5V</text>
        <text x="18" y="33" fill="#FFFFFF" fontSize="7" fontWeight="bold">1.5V</text>
        <rect x="42" y="21" width="3" height="8" rx="1.5" fill="#EF4444" />
      </svg>
    ),
    bulb: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
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
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="30" width="36" height="8" rx="2" fill="#334155" />
        <circle cx="14" cy="26" r="3" fill="#F59E0B" />
        <circle cx="34" cy="26" r="3" fill="#F59E0B" />
        <line x1="14" y1="26" x2="30" y2="12" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="31" cy="11" r="3.5" fill="#EA580C" />
      </svg>
    ),
    push_button: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="24" width="32" height="14" rx="3" fill="#334155" />
        <rect x="14" y="16" width="20" height="9" rx="3" fill="#EF4444" />
        <path d="M 17 16 C 17 12 31 12 31 16 Z" fill="#DC2626" />
        <line x1="12" y1="38" x2="12" y2="44" stroke="#94A3B8" strokeWidth="2" />
        <line x1="36" y1="38" x2="36" y2="44" stroke="#94A3B8" strokeWidth="2" />
      </svg>
    ),
    motor: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="16" width="24" height="18" rx="4" fill="#64748B" />
        <rect x="22" y="10" width="4" height="6" fill="#F59E0B" />
        <circle cx="24" cy="25" r="5" fill="#0284C7" />
        <circle cx="24" cy="25" r="2" fill="#FACC15" />
        <path d="M 8 25 L 12 25" stroke="#EF4444" strokeWidth="2" />
        <path d="M 36 25 L 40 25" stroke="#1E293B" strokeWidth="2" />
      </svg>
    ),
    fan: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="18" y="28" width="12" height="12" rx="2" fill="#64748B" />
        <circle cx="24" cy="20" r="4" fill="#0284C7" />
        <path d="M 24 16 C 24 8 29 8 30 14 C 30 18 26 18 24 20 Z" fill="#38BDF8" />
        <path d="M 21 23 C 14 27 12 23 16 18 C 19 15 22 18 24 20 Z" fill="#38BDF8" />
        <path d="M 26 23 C 27 31 23 33 20 28 C 18 24 22 22 24 20 Z" fill="#38BDF8" />
      </svg>
    ),
    solar_panel: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <polygon points="8,34 16,14 40,14 32,34" fill="#1D4ED8" stroke="#D97706" strokeWidth="2" />
        <line x1="12" y1="24" x2="36" y2="24" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="16" y2="34" stroke="#FFFFFF" strokeWidth="1.5" />
        <line x1="28" y1="14" x2="24" y2="34" stroke="#FFFFFF" strokeWidth="1.5" />
        <polygon points="18,34 20,40 28,40 30,34" fill="#94A3B8" />
      </svg>
    ),
    wind_turbine: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <polygon points="22,42 23,20 25,20 26,42" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        <circle cx="24" cy="20" r="3.5" fill="#0284C7" />
        <path d="M 24 20 L 24 6 Q 25 10 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 24 20 L 36 27 Q 31 26 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 24 20 L 12 27 Q 17 26 24 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    buzzer: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="14" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
        <circle cx="24" cy="24" r="4" fill="#0F172A" />
        <path d="M 15 20 Q 12 24 15 28" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 33 20 Q 36 24 33 28" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 11 16 Q 7 24 11 32" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M 37 16 Q 41 24 37 32" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
    resistor: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <line x1="6" y1="24" x2="42" y2="24" stroke="#94A3B8" strokeWidth="2.5" />
        <rect x="14" y="17" width="20" height="14" rx="4" fill="#D97706" />
        <line x1="18" y1="17" x2="18" y2="31" stroke="#EF4444" strokeWidth="2.5" />
        <line x1="23" y1="17" x2="23" y2="31" stroke="#0F172A" strokeWidth="2.5" />
        <line x1="28" y1="17" x2="28" y2="31" stroke="#F59E0B" strokeWidth="2.5" />
      </svg>
    ),
    potentiometer: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill="#0284C7" />
        <circle cx="24" cy="24" r="10" fill="#0F172A" />
        <line x1="24" y1="24" x2="24" y2="15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2" fill="#FACC15" />
        <path d="M 12 32 A 14 14 0 1 1 36 32" stroke="#FEF08A" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      </svg>
    ),
    fuse: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="19" width="24" height="10" rx="2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        <rect x="8" y="18" width="6" height="12" rx="1" fill="#94A3B8" />
        <rect x="34" y="18" width="6" height="12" rx="1" fill="#94A3B8" />
        <line x1="14" y1="24" x2="34" y2="24" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
      </svg>
    ),
    led: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
        <path d="M 17 26 C 17 18 20 14 24 14 C 28 14 31 18 31 26 Z" fill="#EF4444" />
        <rect x="16" y="26" width="16" height="3" rx="1" fill="#DC2626" />
        <line x1="21" y1="29" x2="21" y2="40" stroke="#94A3B8" strokeWidth="2" />
        <line x1="27" y1="29" x2="27" y2="36" stroke="#94A3B8" strokeWidth="2" />
        <circle cx="24" cy="18" r="2" fill="#FFFFFF" opacity="0.6" />
      </svg>
    ),
  };

  // 14 Comprehensive STEM Electricity Components
  const componentList: {
    type: ComponentType;
    label: string;
    role: string;
    tag: string;
    category: FilterCategory;
  }[] = [
    // 1. Nguồn điện (Sources)
    { type: 'battery', label: 'Pin 1.5V', role: 'Nguồn điện cơ bản', tag: 'Nguồn', category: 'source' },
    { type: 'battery_pack', label: 'Hộp 2 Pin 3V', role: 'Nguồn 3V gấp đôi', tag: 'Nguồn 3V', category: 'source' },
    { type: 'solar_panel', label: 'Pin Mặt Trời', role: 'Quang năng thành điện', tag: 'Nguồn xanh', category: 'source' },
    { type: 'wind_turbine', label: 'Tuabin Gió', role: 'Sức gió thành điện', tag: 'Nguồn xanh', category: 'source' },

    // 2. Thiết bị tiêu thụ (Loads)
    { type: 'bulb', label: 'Bóng đèn', role: 'Phát sáng sợi đốt', tag: 'Tải', category: 'load' },
    { type: 'led', label: 'Đèn LED', role: 'Phát quang siêu sáng', tag: 'Tải', category: 'load' },
    { type: 'motor', label: 'Động cơ DC', role: 'Trục quay cơ năng', tag: 'Tải', category: 'load' },
    { type: 'fan', label: 'Quạt điện', role: 'Cánh quạt thổi gió', tag: 'Tải', category: 'load' },
    { type: 'buzzer', label: 'Còi báo động', role: 'Kêu bíp bíp chuông', tag: 'Tải', category: 'load' },

    // 3. Đóng ngắt & Điều khiển & Bảo vệ (Control & Safety)
    { type: 'switch', label: 'Công tắc dao', role: 'Đóng/ngắt mạch điện', tag: 'Điều khiển', category: 'control' },
    { type: 'push_button', label: 'Nút bấm chuông', role: 'Nhấn giữ đóng mạch', tag: 'Điều khiển', category: 'control' },
    { type: 'fuse', label: 'Cầu chì', role: 'Tự ngắt khi chập điện', tag: 'Bảo vệ', category: 'control' },
    { type: 'resistor', label: 'Điện trở', role: 'Cản bớt dòng điện', tag: 'Bảo vệ', category: 'control' },
    { type: 'potentiometer', label: 'Biến trở xoay', role: 'Núm vặn chỉnh độ sáng', tag: 'Điều tiết', category: 'control' },
  ];

  const filteredComponents = filter === 'all' 
    ? componentList 
    : componentList.filter((item) => item.category === filter);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Nguồn':
      case 'Nguồn 3V':
        return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'Nguồn xanh':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'Điều khiển':
      case 'Điều tiết':
        return { bg: '#e0e7ff', text: '#4338ca' };
      case 'Bảo vệ':
        return { bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { bg: '#fef3c7', text: '#b45309' };
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open on small screens */}
      {isOpen && (
        <div
          className="mobile-backdrop show-on-mobile-only"
          onClick={() => {
            sounds.playClick();
            onToggleOpen();
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 28,
          }}
        />
      )}

      {/* Toggle Tab on Left Edge */}
      <button
        onClick={() => {
          sounds.playClick();
          onToggleOpen();
        }}
        style={{
          position: 'absolute',
          top: '80px',
          left: isOpen ? '280px' : '0px',
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
        className="stem-card component-sidebar-drawer"
        style={{
          position: 'absolute',
          top: '72px',
          left: isOpen ? '12px' : '-300px',
          width: '272px',
          maxHeight: 'calc(100vh - 88px)',
          zIndex: 30,
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          boxShadow: '4px 10px 30px rgba(15, 23, 42, 0.14)',
          transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
      >
        {/* Title Header */}
        <div style={{ paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#0284c7" />
            <span>{isExploreMode ? 'Chọn linh kiện quan sát' : `Kho Linh Kiện (${componentList.length})`}</span>
          </h3>
          <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
            {isExploreMode ? 'Chọn mô hình để xem tên và chức năng' : 'Bấm vào linh kiện để đặt lên bàn 3D'}
          </p>

          {/* Category Filter Pills */}
          <div className="sidebar-category-filter" style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'source', label: 'Nguồn' },
              { id: 'load', label: 'Tải' },
              { id: 'control', label: 'Đ.Khiển' },
            ].map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playClick();
                    setFilter(cat.id as FilterCategory);
                  }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: active ? '#0284c7' : '#f1f5f9',
                    color: active ? '#ffffff' : '#475569',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable list of Component Cards with Graphic Illustrations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredComponents.map((item) => {
            const tagColors = getTagColor(item.tag);
            const isSelected = selectedComponentType === item.type;
            return (
              <button
                key={item.type}
                data-component-type={item.type}
                aria-pressed={isExploreMode ? isSelected : undefined}
                onClick={() => {
                  sounds.playClick();
                  if (onSelectComponent) {
                    onSelectComponent(item.type);
                  } else {
                    onAddComponent?.(item.type);
                  }
                  if (typeof window !== 'undefined' && window.innerWidth <= 640) {
                    onToggleOpen();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 8px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#e0f2fe' : '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? '#dbeafe' : '#f0f9ff';
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? '#e0f2fe' : '#f8fafc';
                  e.currentTarget.style.borderColor = isSelected ? '#0284c7' : '#e2e8f0';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Illustration Thumbnail */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
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
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        backgroundColor: tagColors.bg,
                        color: tagColors.text,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {item.tag}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.role}
                    </span>
                  </div>
                </div>

                {/* Add plus badge */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isExploreMode && isSelected ? '#0284c7' : '#e0f2fe',
                    color: isExploreMode && isSelected ? '#ffffff' : '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isExploreMode ? <Eye size={13} /> : <Plus size={13} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
