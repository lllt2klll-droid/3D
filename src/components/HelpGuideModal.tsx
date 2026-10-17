import React from 'react';
import { sounds } from '../audio/soundEffects';
import {
  X,
  Compass,
  Zap,
  MousePointer,
  RotateCw,
  ShieldCheck,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
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
          maxWidth: '600px',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Hướng dẫn sử dụng Phòng Lab STEM 3D
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Dành cho các nhà khoa học nhí và thầy cô giáo
              </p>
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
          {/* Controls */}
          <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MousePointer size={18} color="#0284c7" />
              <span>Cách tương tác với mô hình 3D</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.85rem', color: '#334155' }}>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <strong>🔄 Xoay góc nhìn:</strong> Giữ chuột trái hoặc vuốt 1 ngón tay trên điện thoại.
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <strong>🔍 Phóng to / Thu nhỏ:</strong> Lăn con lăn chuột hoặc chụm 2 ngón tay.
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <strong>🔌 Nối dây dẫn:</strong> Bấm vào một đầu chốt kim loại, rồi bấm tiếp vào chốt thứ hai.
              </div>
              <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <strong>⚡ Bật/Tắt công tắc:</strong> Bấm trực tiếp vào cần gạt màu đồng để đóng/ngắt mạch.
              </div>
            </div>
          </div>

          {/* 5-step learning loop */}
          <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1d4ed8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={18} color="#2563eb" />
              <span>Chu trình khoa học 5 bước</span>
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.5 }}>
              <strong>1. Quan sát:</strong> Nhìn kỹ từng bộ phận của pin, bóng đèn, công tắc.<br />
              <strong>2. Dự đoán:</strong> Tự hỏi & chọn dự đoán trước khi đóng công tắc.<br />
              <strong>3. Thao tác:</strong> Tự tay lắp ráp các đoạn dây dẫn mạch điện.<br />
              <strong>4. Kiểm tra:</strong> Xem bóng đèn có sáng, quạt có quay không.<br />
              <strong>5. Giải thích:</strong> Đọc bảng thông báo và lý giải tại sao mạch hoạt động!
            </div>
          </div>

          {/* Electrical Safety Notice */}
          <div style={{ padding: '14px', borderRadius: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#991b1b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="#ef4444" />
              <span>Quy tắc an toàn điện trong đời sống</span>
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.45 }}>
              Trong ứng dụng này, chúng ta sử dụng mô hình pin 1.5V an toàn cho học tập. Tuyệt đối không được cắm bất kỳ dây dẫn hoặc vật kim loại nào vào ổ cắm điện 220V trong nhà vì cực kỳ nguy hiểm đến tính mạng!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-3d btn-primary"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
          >
            <CheckCircle size={18} />
            <span>Bắt đầu trải nghiệm ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
