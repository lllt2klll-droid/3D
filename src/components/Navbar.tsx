import React, { useState, useEffect } from 'react';
import { AppMode } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  Zap,
  Eye,
  Sliders,
  Award,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onResetCamera: () => void;
  onOpenHelp: () => void;
  isNightMode: boolean;
  onToggleDayNight: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onResetCamera,
  onOpenHelp,
  isNightMode,
  onToggleDayNight,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) sounds.playClick();
  };

  const handleToggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const modes: { id: AppMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'explore', label: 'Quan sát 3D', icon: <Eye size={18} />, color: '#0284c7' },
    { id: 'lab', label: 'Lắp mạch điện', icon: <Zap size={18} />, color: '#f59e0b' },
    { id: 'energy', label: 'Năng lượng xanh', icon: <Sliders size={18} />, color: '#10b981' },
    { id: 'challenge', label: 'Thử thách STEM', icon: <Award size={18} />, color: '#8b5cf6' },
  ];

  return (
    <header
      className="app-navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        zIndex: 50,
        gap: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* Brand Logo & Name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
        onClick={() => onSelectMode('lab')}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 3px 0 #0369a1, 0 6px 12px rgba(2, 132, 199, 0.3)',
          }}
        >
          <Zap size={24} fill="#fde047" stroke="#0284c7" />
        </div>
        <div>
          <div
            style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            STEM 3D
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b',
            }}
          >
            Khám phá thế giới điện
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav
        className="app-navbar-modes"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '16px',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      >
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                sounds.playClick();
                onSelectMode(m.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? m.color : '#64748b',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-3d btn-neutral"
          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          onClick={() => {
            sounds.playClick();
            onResetCamera();
          }}
          title="Đặt lại góc nhìn ban đầu"
        >
          <RotateCcw size={16} />
          <span className="hide-on-mobile">Góc nhìn</span>
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '8px 10px' }}
          onClick={handleToggleSound}
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#0284c7" />}
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{ padding: '8px 10px' }}
          onClick={handleToggleFullscreen}
          title="Toàn màn hình"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          className="btn-3d btn-neutral"
          style={{
            padding: '8px 10px',
            background: isNightMode
              ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
              : 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)',
            border: isNightMode ? '1.5px solid #6366f1' : '1.5px solid #f59e0b',
            minWidth: '40px',
          }}
          onClick={onToggleDayNight}
          title={isNightMode ? 'Chuyển sang ban ngày ☀️' : 'Chuyển sang ban đêm 🌙'}
        >
          {isNightMode
            ? <Sun size={18} color="#fde047" />
            : <Moon size={18} color="#6366f1" />}
        </button>

        <button
          className="btn-3d btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          onClick={() => {
            sounds.playClick();
            onOpenHelp();
          }}
        >
          <HelpCircle size={16} />
          <span>Hướng dẫn</span>
        </button>
      </div>
    </header>
  );
};
