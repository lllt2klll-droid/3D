import React, { useState } from 'react';
import { STEM_CHALLENGES } from '../circuit/challenges';
import { Challenge, CircuitAnalysisResult } from '../types';
import { sounds } from '../audio/soundEffects';
import {
  Award,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface MissionPanelProps {
  currentChallenge: Challenge;
  completedIds: number[];
  onSelectChallenge: (challenge: Challenge) => void;
  onNextChallenge: () => void;
  analysis: CircuitAnalysisResult;
  isMissionSuccess: boolean;
  onResetChallenge: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  currentChallenge,
  completedIds,
  onSelectChallenge,
  onNextChallenge,
  isMissionSuccess,
  onResetChallenge,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);

  const handleSelectPrediction = (index: number) => {
    sounds.playClick();
    setSelectedPrediction(index);
  };

  return (
    <div
      className="stem-card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
      }}
    >
      {/* Level Selection Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>
          Nhiệm vụ:
        </span>
        {STEM_CHALLENGES.map((ch) => {
          const isCurrent = currentChallenge.id === ch.id;
          const isDone = completedIds.includes(ch.id);

          return (
            <button
              key={ch.id}
              onClick={() => {
                sounds.playClick();
                setShowHint(false);
                setSelectedPrediction(null);
                onSelectChallenge(ch);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '12px',
                border: isCurrent ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                backgroundColor: isCurrent ? '#f5f3ff' : isDone ? '#ecfdf5' : '#ffffff',
                color: isCurrent ? '#7c3aed' : isDone ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {isDone ? <CheckCircle2 size={14} color="#10b981" /> : <Award size={14} />}
              <span>Bài {ch.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
              {currentChallenge.subtitle}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {currentChallenge.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
              {currentChallenge.description}
            </p>
          </div>

          <button
            className="btn-3d btn-neutral"
            style={{ padding: '6px 10px', fontSize: '0.8rem', flexShrink: 0 }}
            onClick={() => {
              sounds.playClick();
              onResetChallenge();
            }}
            title="Đặt lại bài thử thách này"
          >
            <RotateCcw size={14} />
            <span>Làm lại</span>
          </button>
        </div>

        {/* Objective Box */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '0.88rem',
            color: '#1e293b',
          }}
        >
          <strong>🎯 Mục tiêu:</strong> {currentChallenge.objective}
        </div>

        {/* Pedagogical Prediction Section */}
        {currentChallenge.predictionQuestion && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: '#faf5ff',
              border: '1px solid #e9d5ff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7e22ce', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
              <HelpCircle size={16} />
              <span>Dự đoán trước khi thử:</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#581c87', fontWeight: 600, marginBottom: '8px' }}>
              {currentChallenge.predictionQuestion}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentChallenge.predictionOptions?.map((opt, idx) => {
                const isSelected = selectedPrediction === idx;
                const isCorrect = idx === currentChallenge.correctPredictionIndex;

                let optBg = '#ffffff';
                let optBorder = '#d8b4fe';
                let optColor = '#4c1d95';

                if (isSelected) {
                  if (isCorrect) {
                    optBg = '#dcfce7';
                    optBorder = '#86efac';
                    optColor = '#14532d';
                  } else {
                    optBg = '#fef2f2';
                    optBorder = '#fecaca';
                    optColor = '#991b1b';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPrediction(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: `1px solid ${optBorder}`,
                      backgroundColor: optBg,
                      color: optColor,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedPrediction !== null && currentChallenge.predictionExplanation && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  color: '#6b21a8',
                  lineHeight: 1.4,
                }}
              >
                💡 {currentChallenge.predictionExplanation}
              </div>
            )}
          </div>
        )}

        {/* Hint toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              sounds.playClick();
              setShowHint(!showHint);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0',
            }}
          >
            <HelpCircle size={16} />
            <span>{showHint ? 'Ẩn gợi ý' : 'Em cần gợi ý?'}</span>
          </button>

          {showHint && (
            <div
              style={{
                flex: 1,
                fontSize: '0.85rem',
                color: '#0369a1',
                backgroundColor: '#f0f9ff',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #bae6fd',
              }}
            >
              💡 {currentChallenge.hint}
            </div>
          )}
        </div>

        {/* Success Card when mission condition is met */}
        {isMissionSuccess && (
          <div
            className="stem-card"
            style={{
              padding: '14px 18px',
              backgroundColor: '#ecfdf5',
              border: '2px solid #34d399',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={22} color="#059669" />
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#065f46' }}>
                  {currentChallenge.successMessage}
                </span>
              </div>

              <button
                className="btn-3d btn-success"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                onClick={() => {
                  sounds.playClick();
                  setShowHint(false);
                  setSelectedPrediction(null);
                  onNextChallenge();
                }}
              >
                <span>Bài tiếp theo</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.85rem',
                color: '#047857',
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '8px 12px',
                borderRadius: '10px',
              }}
            >
              <BookOpen size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{currentChallenge.educationalTakeaway}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
