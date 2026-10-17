import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppMode,
  CircuitComponent,
  Wire,
  WireColor,
  ComponentType,
  CircuitAnalysisResult,
  ComponentCatalogItem,
  Challenge,
} from './types';
import { COMPONENT_CATALOG } from './circuit/componentCatalog';
import { CIRCUIT_TEMPLATES, CircuitTemplate, createComponent } from './circuit/templates';
import { STEM_CHALLENGES } from './circuit/challenges';
import { analyzeCircuit, updateComponentStates } from './circuit/circuitEngine';
import { ThreeViewer } from './scene/ThreeViewer';
import { sounds } from './audio/soundEffects';

// UI Components
import { Navbar } from './components/Navbar';
import { CircuitStatusAlert } from './components/CircuitStatusAlert';
import { CircuitToolbar } from './components/CircuitToolbar';
import { ComponentInfoModal } from './components/ComponentInfoModal';
import { TemplatesModal } from './components/TemplatesModal';
import { EnergyControls } from './components/EnergyControls';
import { MissionPanel } from './components/MissionPanel';
import { HelpGuideModal } from './components/HelpGuideModal';
import { ConfettiCelebration } from './components/ConfettiCelebration';

import {
  Eye,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<ThreeViewer | null>(null);

  // App Modes: 'explore' | 'lab' | 'energy' | 'challenge'
  const [currentMode, setCurrentMode] = useState<AppMode>('lab');

  // Circuit State
  const [components, setComponents] = useState<CircuitComponent[]>(() => {
    return CIRCUIT_TEMPLATES[1].components; // Start with 'simple_bulb' template
  });
  const [wires, setWires] = useState<Wire[]>(() => {
    return CIRCUIT_TEMPLATES[1].wires;
  });

  // Wire Connection State
  const [selectedWireColor, setSelectedWireColor] = useState<WireColor>('red');
  const [connectingTerminal, setConnectingTerminal] = useState<{
    compId: string;
    termId: string;
  } | null>(null);

  // Energy Mode State
  const [sunlight, setSunlight] = useState<number>(0.8);
  const [windSpeed, setWindSpeed] = useState<number>(3);

  // Challenge Mode State
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(STEM_CHALLENGES[0]);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Modals & Panels
  const [inspectingItem, setInspectingItem] = useState<ComponentCatalogItem | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [selectedExploreType, setSelectedExploreType] = useState<ComponentType>('bulb');

  // WebGL Support State
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // Run Graph-based Circuit Analysis
  const circuitAnalysis: CircuitAnalysisResult = React.useMemo(() => {
    return analyzeCircuit(components, wires, { sunlight, windSpeed });
  }, [components, wires, sunlight, windSpeed]);

  // Sync physical component states (bulb isLit, motor isSpinning, etc.)
  const activeComponents = React.useMemo(() => {
    return updateComponentStates(components, circuitAnalysis);
  }, [components, circuitAnalysis]);

  // Initialize ThreeViewer
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    if (!mountRef.current) return;

    const viewer = new ThreeViewer(mountRef.current, {
      onTerminalClick: (compId, termId) => {
        handleTerminalClick(compId, termId);
      },
      onSwitchToggle: (comp) => {
        handleToggleSwitch(comp.id);
      },
      onComponentClick: (compId) => {
        const found = components.find((c) => c.id === compId);
        if (found && COMPONENT_CATALOG[found.type]) {
          sounds.playClick();
          setInspectingItem(COMPONENT_CATALOG[found.type]);
        }
      },
      onWireClick: (wireId) => {
        handleDeleteWire(wireId);
      },
    });

    viewerRef.current = viewer;

    return () => {
      viewer.dispose();
      viewerRef.current = null;
    };
  }, []);

  // Sync components and wires into Three.js scene
  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current.syncComponents(activeComponents, (sw) => {
      handleToggleSwitch(sw.id);
    });
    viewerRef.current.syncWires(wires, activeComponents);
    viewerRef.current.updateAllComponentStates(activeComponents);
    viewerRef.current.updateEnergyEnv(sunlight, windSpeed);
    viewerRef.current.setHouseLit(circuitAnalysis.isClosedCircuit);
  }, [activeComponents, wires, sunlight, windSpeed, circuitAnalysis.isClosedCircuit]);

  // Audio effects when circuit closes/opens or shorts
  const prevClosedRef = useRef(false);
  const prevShortRef = useRef(false);
  useEffect(() => {
    if (circuitAnalysis.isShortCircuit && !prevShortRef.current) {
      sounds.playShortCircuit();
    } else if (circuitAnalysis.isClosedCircuit && !prevClosedRef.current) {
      sounds.playBulbOn();
    } else if (!circuitAnalysis.isClosedCircuit && prevClosedRef.current) {
      sounds.playBulbOff();
    }
    prevClosedRef.current = circuitAnalysis.isClosedCircuit;
    prevShortRef.current = circuitAnalysis.isShortCircuit;

    // Update continuous motor/fan hum sound
    const hasMotor = circuitAnalysis.poweredComponentIds.some((id) => {
      const c = components.find((item) => item.id === id);
      return c?.type === 'motor' || c?.type === 'fan';
    });
    sounds.setMotorRunning(hasMotor, 0.6);
  }, [circuitAnalysis.isClosedCircuit, circuitAnalysis.isShortCircuit, circuitAnalysis.poweredComponentIds, components]);

  // Handle Switch Toggle
  const handleToggleSwitch = useCallback((switchId: string) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === switchId && c.type === 'switch') {
          const nextOpen = !(c.state.isOpen ?? false);
          sounds.playSwitchClick(nextOpen);
          return {
            ...c,
            state: { ...c.state, isOpen: nextOpen },
          };
        }
        return c;
      })
    );
  }, []);

  // Handle Terminal Click for Wire Creation
  const handleTerminalClick = (compId: string, termId: string) => {
    if (!connectingTerminal) {
      // First click: select start terminal
      sounds.playClick();
      setConnectingTerminal({ compId, termId });
      viewerRef.current?.setSelectedTerminal(`${compId}::${termId}`);
    } else {
      // Second click: create wire between start and end
      if (
        connectingTerminal.compId === compId &&
        connectingTerminal.termId === termId
      ) {
        // Clicked same terminal again -> cancel
        setConnectingTerminal(null);
        viewerRef.current?.setSelectedTerminal(null);
        return;
      }

      // Check if wire already exists
      const exists = wires.some(
        (w) =>
          (w.fromComponentId === connectingTerminal.compId &&
            w.fromTerminalId === connectingTerminal.termId &&
            w.toComponentId === compId &&
            w.toTerminalId === termId) ||
          (w.fromComponentId === compId &&
            w.fromTerminalId === termId &&
            w.toComponentId === connectingTerminal.compId &&
            w.toTerminalId === connectingTerminal.termId)
      );

      if (!exists) {
        const newWire: Wire = {
          id: `w-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fromComponentId: connectingTerminal.compId,
          fromTerminalId: connectingTerminal.termId,
          toComponentId: compId,
          toTerminalId: termId,
          color: selectedWireColor,
          hasCurrent: false,
          currentDirection: 1,
        };

        sounds.playWireConnect();
        setWires((prev) => [...prev, newWire]);
      }

      setConnectingTerminal(null);
      viewerRef.current?.setSelectedTerminal(null);
    }
  };

  // Delete a wire
  const handleDeleteWire = (wireId: string) => {
    sounds.playWireDisconnect();
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  // Add component to sandbox
  const handleAddComponent = (type: ComponentType) => {
    const id = `${type}-${Date.now().toString().slice(-4)}`;
    // Spread position near center with random offset
    const x = (Math.random() - 0.5) * 3.5;
    const z = (Math.random() - 0.5) * 2.5;
    const newComp = createComponent(type, id, [x, 0, z]);
    setComponents((prev) => [...prev, newComp]);
  };

  // Clear all wires
  const handleClearWires = () => {
    setWires([]);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
  };

  // Reset circuit to clean template
  const handleResetCircuit = () => {
    setComponents(CIRCUIT_TEMPLATES[1].components);
    setWires(CIRCUIT_TEMPLATES[1].wires);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
    viewerRef.current?.resetCamera();
  };

  // Load a preset template
  const handleSelectTemplate = (template: CircuitTemplate) => {
    setComponents(template.components);
    setWires(template.wires);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
    viewerRef.current?.resetCamera();
  };

  // Switch App Mode
  const handleSelectMode = (mode: AppMode) => {
    setCurrentMode(mode);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);

    if (mode === 'explore') {
      // Set single component in view for clean inspection
      handleSelectExploreComponent(selectedExploreType);
    } else if (mode === 'energy') {
      // Load clean energy diorama circuit
      const energyTmpl = CIRCUIT_TEMPLATES[3]; // solar_light
      setComponents(energyTmpl.components);
      setWires(energyTmpl.wires);
      viewerRef.current?.resetCamera();
    } else if (mode === 'challenge') {
      loadChallenge(currentChallenge);
    } else if (mode === 'lab') {
      handleResetCircuit();
    }
  };

  // Load Explore Component
  const handleSelectExploreComponent = (type: ComponentType) => {
    setSelectedExploreType(type);
    const comp = createComponent(type, `explore-${type}`, [0, 0, 0]);
    setComponents([comp]);
    setWires([]);
    setInspectingItem(COMPONENT_CATALOG[type]);
    if (viewerRef.current) {
      viewerRef.current.focusOnComponent(comp);
    }
  };

  // Load a Challenge
  const loadChallenge = (ch: Challenge) => {
    setCurrentChallenge(ch);
    setComponents((ch.setupComponents as CircuitComponent[]) || []);
    setWires(ch.setupWires || []);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
    viewerRef.current?.resetCamera();
  };

  // Challenge check condition
  const isChallengePassing = React.useMemo(() => {
    if (currentMode !== 'challenge') return false;
    return currentChallenge.checkCondition(circuitAnalysis, components, wires, {
      sunlight,
      windSpeed,
    });
  }, [currentMode, currentChallenge, circuitAnalysis, components, wires, sunlight, windSpeed]);

  // Handle Challenge Success
  const prevPassingRef = useRef(false);
  useEffect(() => {
    if (currentMode === 'challenge' && isChallengePassing && !prevPassingRef.current) {
      sounds.playVictory();
      setShowCelebration(true);
      if (!completedChallengeIds.includes(currentChallenge.id)) {
        setCompletedChallengeIds((prev) => [...prev, currentChallenge.id]);
      }
      const timer = setTimeout(() => setShowCelebration(false), 3500);
      return () => clearTimeout(timer);
    }
    prevPassingRef.current = isChallengePassing;
  }, [currentMode, isChallengePassing, currentChallenge.id, completedChallengeIds]);

  // Next Challenge
  const handleNextChallenge = () => {
    const currentIndex = STEM_CHALLENGES.findIndex((c) => c.id === currentChallenge.id);
    if (currentIndex < STEM_CHALLENGES.length - 1) {
      const nextCh = STEM_CHALLENGES[currentIndex + 1];
      loadChallenge(nextCh);
    }
  };

  if (!hasWebGL) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '24px',
          textAlign: 'center',
          backgroundColor: '#f8fafc',
        }}
      >
        <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Trình duyệt chưa bật đồ họa 3D (WebGL)
        </h2>
        <p style={{ maxWidth: '480px', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Để học tập và quan sát mô hình 3D, em hãy bật tùy chọn "Hardware Acceleration" (Tăng tốc phần cứng) trong cài đặt trình duyệt Chrome/Edge hoặc cập nhật trình duyệt mới nhất nhé!
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f8fafc',
      }}
    >
      {/* Confetti Celebration on challenge success */}
      <ConfettiCelebration active={showCelebration} />

      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onResetCamera={() => viewerRef.current?.resetCamera()}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main 3D Viewport & Interactive Overlay */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 3D WebGL Canvas Container */}
        <div
          ref={mountRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
        />

        {/* Top-Floating Realtime Circuit Status Bar */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '680px',
            zIndex: 20,
            pointerEvents: 'auto',
          }}
        >
          <CircuitStatusAlert analysis={circuitAnalysis} />
        </div>

        {/* Explore Mode Component Selector Drawer (Left Side) */}
        {currentMode === 'explore' && (
          <div
            className="stem-card"
            style={{
              position: 'absolute',
              top: '80px',
              left: '16px',
              zIndex: 20,
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              maxWidth: '220px',
              maxHeight: 'calc(100% - 100px)',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              Chọn linh kiện:
            </div>
            {(Object.keys(COMPONENT_CATALOG) as ComponentType[]).map((key) => {
              const item = COMPONENT_CATALOG[key];
              const isSelected = selectedExploreType === item.type;
              return (
                <button
                  key={key}
                  onClick={() => {
                    sounds.playClick();
                    handleSelectExploreComponent(item.type);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#334155',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <Eye size={16} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Control Panels depending on Mode */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: '920px',
            zIndex: 20,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* LAB MODE: Toolbar */}
          {currentMode === 'lab' && (
            <CircuitToolbar
              onAddComponent={handleAddComponent}
              selectedWireColor={selectedWireColor}
              onSelectWireColor={setSelectedWireColor}
              onClearWires={handleClearWires}
              onResetCircuit={handleResetCircuit}
              onOpenTemplates={() => setIsTemplatesOpen(true)}
              connectingTerminal={connectingTerminal ? `${connectingTerminal.compId}` : null}
              onCancelConnecting={() => {
                setConnectingTerminal(null);
                viewerRef.current?.setSelectedTerminal(null);
              }}
            />
          )}

          {/* ENERGY MODE: Solar & Wind Controls */}
          {currentMode === 'energy' && (
            <EnergyControls
              sunlight={sunlight}
              onSunlightChange={setSunlight}
              windSpeed={windSpeed}
              onWindSpeedChange={setWindSpeed}
            />
          )}

          {/* CHALLENGE MODE: Progressive STEM Missions */}
          {currentMode === 'challenge' && (
            <MissionPanel
              currentChallenge={currentChallenge}
              completedIds={completedChallengeIds}
              onSelectChallenge={(ch) => loadChallenge(ch)}
              onNextChallenge={handleNextChallenge}
              analysis={circuitAnalysis}
              isMissionSuccess={isChallengePassing}
              onResetChallenge={() => loadChallenge(currentChallenge)}
            />
          )}
        </div>
      </div>

      {/* Component Details & Pedagogical Modal */}
      <ComponentInfoModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onAddToLab={
          currentMode === 'lab'
            ? (type) => {
                handleAddComponent(type);
              }
            : undefined
        }
      />

      {/* Preset Circuit Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Help & Guide Modal */}
      <HelpGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
