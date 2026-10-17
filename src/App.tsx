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
import { ComponentSidebar } from './components/ComponentSidebar';
import { ComponentActionWidget } from './components/ComponentActionWidget';
import { ComponentInfoModal } from './components/ComponentInfoModal';
import { TemplatesModal } from './components/TemplatesModal';
import { EnergyControls } from './components/EnergyControls';
import { MissionPanel } from './components/MissionPanel';
import { HelpGuideModal } from './components/HelpGuideModal';
import { ConfettiCelebration } from './components/ConfettiCelebration';

import {
  Eye,
  AlertCircle,
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

// Preset clean grid slots on the workbench to completely avoid overlapping
const GRID_SLOTS: [number, number, number][] = [
  [-2.2, 0, 0.8],
  [0, 0, 0.8],
  [2.2, 0, 0.8],
  [-2.2, 0, -1.0],
  [0, 0, -1.0],
  [2.2, 0, -1.0],
  [-3.4, 0, 0],
  [3.4, 0, 0],
];

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

  // Selected Component for direct action (deletion / rotation / dragging)
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Left Component Sidebar Visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Undo History Stack
  const [history, setHistory] = useState<{ components: CircuitComponent[]; wires: Wire[] }[]>([]);

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

  // Push state to undo history
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-15), { components, wires }]);
  }, [components, wires]);

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;
    sounds.playClick();
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setComponents(last.components);
    setWires(last.wires);
    setSelectedComponentId(null);
  };

  // Run Graph-based Circuit Analysis
  const circuitAnalysis: CircuitAnalysisResult = React.useMemo(() => {
    return analyzeCircuit(components, wires, { sunlight, windSpeed });
  }, [components, wires, sunlight, windSpeed]);

  // Sync physical component states (bulb isLit, motor isSpinning, etc.)
  const activeComponents = React.useMemo(() => {
    return updateComponentStates(components, circuitAnalysis);
  }, [components, circuitAnalysis]);

  // Handle Terminal Click for Wire Connection
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
        sounds.playClick();
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
        pushHistory();
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

  // Stable callbacks ref for ThreeViewer to prevent recreation on state updates
  const viewerCallbacksRef = useRef({
    onTerminalClick: (_c: string, _t: string) => {},
    onSwitchToggle: (_c: CircuitComponent) => {},
    onComponentClick: (_c: string) => {},
    onComponentMove: (_c: string, _p: [number, number, number]) => {},
    onComponentMoveEnd: (_c: string, _p: [number, number, number]) => {},
    onComponentRotate: (_c: string, _r: number) => {},
    onWireClick: (_w: string) => {},
    onEmptyClick: () => {},
  });

  // Keep callbacks ref updated with latest closures on each render
  viewerCallbacksRef.current = {
    onTerminalClick: (compId, termId) => {
      handleTerminalClick(compId, termId);
    },
    onSwitchToggle: (comp) => {
      handleToggleSwitch(comp.id);
    },
    onComponentClick: (compId) => {
      sounds.playClick();
      setSelectedComponentId(compId);
    },
    onComponentMove: (compId, pos) => {
      setComponents((prev) =>
        prev.map((c) => (c.id === compId ? { ...c, position: pos } : c))
      );
    },
    onComponentMoveEnd: (compId, pos) => {
      pushHistory();
      setComponents((prev) =>
        prev.map((c) => (c.id === compId ? { ...c, position: pos } : c))
      );
    },
    onComponentRotate: (compId, rotY) => {
      pushHistory();
      setComponents((prev) =>
        prev.map((c) => (c.id === compId ? { ...c, rotation: [0, rotY, 0] } : c))
      );
    },
    onWireClick: (wireId) => {
      handleDeleteWire(wireId);
    },
    onEmptyClick: () => {
      setSelectedComponentId(null);
    },
  };

  // Initialize ThreeViewer ONCE on mount
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    if (!mountRef.current) return;

    const viewer = new ThreeViewer(mountRef.current, {
      onTerminalClick: (c, t) => viewerCallbacksRef.current.onTerminalClick(c, t),
      onSwitchToggle: (c) => viewerCallbacksRef.current.onSwitchToggle(c),
      onComponentClick: (c) => viewerCallbacksRef.current.onComponentClick(c),
      onComponentMove: (c, p) => viewerCallbacksRef.current.onComponentMove(c, p),
      onComponentMoveEnd: (c, p) => viewerCallbacksRef.current.onComponentMoveEnd(c, p),
      onComponentRotate: (c, r) => viewerCallbacksRef.current.onComponentRotate(c, r),
      onWireClick: (w) => viewerCallbacksRef.current.onWireClick(w),
      onEmptyClick: () => viewerCallbacksRef.current.onEmptyClick(),
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
      if (sw.type === 'switch') handleToggleSwitch(sw.id);
      if (sw.type === 'push_button') handleTogglePushButton(sw.id);
    });
    viewerRef.current.syncWires(wires, activeComponents);
    viewerRef.current.updateAllComponentStates(activeComponents);
    viewerRef.current.updateEnergyEnv(sunlight, windSpeed);
  }, [activeComponents, wires, sunlight, windSpeed]);

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

    // Beep sound if any buzzer is powered
    const hasActiveBuzzer = circuitAnalysis.poweredComponentIds.some((id) => {
      const c = components.find((item) => item.id === id);
      return c?.type === 'buzzer';
    });
    if (hasActiveBuzzer && circuitAnalysis.isClosedCircuit) {
      sounds.playBuzzerBeep();
    }
  }, [circuitAnalysis.isClosedCircuit, circuitAnalysis.isShortCircuit, circuitAnalysis.poweredComponentIds, components]);

  // Handle Switch Toggle
  const handleToggleSwitch = useCallback((switchId: string) => {
    pushHistory();
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
  }, [pushHistory]);

  // Toggle Push Button
  const handleTogglePushButton = useCallback((btnId: string) => {
    pushHistory();
    sounds.playClick();
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === btnId && c.type === 'push_button') {
          return {
            ...c,
            state: { ...c.state, isPressed: !c.state.isPressed },
          };
        }
        return c;
      })
    );
  }, [pushHistory]);

  // Reset Blown Fuse
  const handleResetFuse = useCallback((fuseId: string) => {
    pushHistory();
    sounds.playClick();
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === fuseId && c.type === 'fuse') {
          return {
            ...c,
            state: { ...c.state, isBlown: false },
          };
        }
        return c;
      })
    );
  }, [pushHistory]);

  // Adjust Potentiometer Resistance
  const handleAdjustPotentiometer = useCallback((potId: string, delta: number) => {
    pushHistory();
    sounds.playClick();
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === potId && c.type === 'potentiometer') {
          const curr = c.state.resistance ?? 50;
          const next = Math.max(0, Math.min(200, curr + delta));
          return {
            ...c,
            state: { ...c.state, resistance: next },
          };
        }
        return c;
      })
    );
  }, [pushHistory]);

  // Rotate selected component 45 degrees
  const handleRotateSelectedComponent = () => {
    if (!selectedComponentId || !viewerRef.current) return;
    viewerRef.current.rotateComponent(selectedComponentId, Math.PI / 4);
    sounds.playClick();
  };

  // Move selected component by (dx, dz) offset
  const handleMoveSelectedComponentDelta = (dx: number, dz: number) => {
    if (!selectedComponentId) return;
    pushHistory();
    sounds.playClick();
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id !== selectedComponentId) return c;
        const nx = Math.max(-3.8, Math.min(3.8, Number((c.position[0] + dx).toFixed(2))));
        const nz = Math.max(-3.0, Math.min(3.0, Number((c.position[2] + dz).toFixed(2))));
        const newPos: [number, number, number] = [nx, c.position[1], nz];
        viewerRef.current?.moveComponent(selectedComponentId, newPos);
        return {
          ...c,
          position: newPos,
        };
      })
    );
  };

  // Delete a wire
  const handleDeleteWire = (wireId: string) => {
    pushHistory();
    sounds.playWireDisconnect();
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  // Delete selected component from workbench
  const handleDeleteSelectedComponent = () => {
    if (!selectedComponentId) return;
    pushHistory();
    sounds.playWireDisconnect();
    setComponents((prev) => prev.filter((c) => c.id !== selectedComponentId));
    setWires((prev) =>
      prev.filter(
        (w) =>
          w.fromComponentId !== selectedComponentId &&
          w.toComponentId !== selectedComponentId
      )
    );
    setSelectedComponentId(null);
  };

  // Add component to sandbox using smart non-overlapping grid slots
  const handleAddComponent = (type: ComponentType) => {
    pushHistory();
    const id = `${type}-${Date.now().toString().slice(-4)}`;

    // Find the first open non-overlapping slot on the bench
    let chosenPos = GRID_SLOTS[0];
    for (const slot of GRID_SLOTS) {
      const isOccupied = components.some(
        (c) => Math.hypot(c.position[0] - slot[0], c.position[2] - slot[2]) < 1.1
      );
      if (!isOccupied) {
        chosenPos = slot;
        break;
      }
    }

    const newComp = createComponent(type, id, chosenPos);
    setComponents((prev) => [...prev, newComp]);
    setSelectedComponentId(id);
    sounds.playClick();
  };

  // Clear all wires
  const handleClearWires = () => {
    pushHistory();
    setWires([]);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
  };

  // Reset circuit to clean template
  const handleResetCircuit = () => {
    pushHistory();
    setComponents(CIRCUIT_TEMPLATES[1].components);
    setWires(CIRCUIT_TEMPLATES[1].wires);
    setSelectedComponentId(null);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
    viewerRef.current?.resetCamera();
  };

  // Load a preset template
  const handleSelectTemplate = (template: CircuitTemplate) => {
    pushHistory();
    setComponents(template.components);
    setWires(template.wires);
    setSelectedComponentId(null);
    setConnectingTerminal(null);
    viewerRef.current?.setSelectedTerminal(null);
    viewerRef.current?.resetCamera();
  };

  // Load quick 1-click template
  const handleLoadQuickTemplate = (templateId: string) => {
    pushHistory();
    const tmpl = CIRCUIT_TEMPLATES.find((t) => t.id === templateId) || CIRCUIT_TEMPLATES[0];
    handleSelectTemplate(tmpl);
  };

  // Switch App Mode
  const handleSelectMode = (mode: AppMode) => {
    setCurrentMode(mode);
    setConnectingTerminal(null);
    setSelectedComponentId(null);
    viewerRef.current?.setSelectedTerminal(null);

    if (mode === 'explore') {
      handleSelectExploreComponent(selectedExploreType);
    } else if (mode === 'energy') {
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
    setSelectedComponentId(null);
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

  const selectedCompObj = activeComponents.find((c) => c.id === selectedComponentId) || null;

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

        {/* LEFT SIDEBAR: Rich Illustrated Components Drawer (in Lab mode) */}
        {currentMode === 'lab' && (
          <ComponentSidebar
            onAddComponent={handleAddComponent}
            isOpen={isSidebarOpen}
            onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}

        {/* Selected Component Floating Action Widget (Rotate, Move & Delete) */}
        <ComponentActionWidget
          component={selectedCompObj}
          onRotate={handleRotateSelectedComponent}
          onMoveDelta={handleMoveSelectedComponentDelta}
          onDelete={handleDeleteSelectedComponent}
          onInspect={() => {
            if (selectedCompObj) setInspectingItem(COMPONENT_CATALOG[selectedCompObj.type]);
          }}
          onToggleSwitch={() => {
            if (selectedComponentId) handleToggleSwitch(selectedComponentId);
          }}
          onTogglePushButton={() => {
            if (selectedComponentId) handleTogglePushButton(selectedComponentId);
          }}
          onResetFuse={() => {
            if (selectedComponentId) handleResetFuse(selectedComponentId);
          }}
          onAdjustPotentiometer={(delta) => {
            if (selectedComponentId) handleAdjustPotentiometer(selectedComponentId, delta);
          }}
          onDeselect={() => setSelectedComponentId(null)}
        />

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
            maxWidth: '960px',
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
              selectedWireColor={selectedWireColor}
              onSelectWireColor={setSelectedWireColor}
              onClearWires={handleClearWires}
              onResetCircuit={handleResetCircuit}
              onOpenTemplates={() => setIsTemplatesOpen(true)}
              onLoadQuickTemplate={handleLoadQuickTemplate}
              connectingTerminal={connectingTerminal ? `${connectingTerminal.compId}` : null}
              onCancelConnecting={() => {
                setConnectingTerminal(null);
                viewerRef.current?.setSelectedTerminal(null);
              }}
              canUndo={history.length > 0}
              onUndo={handleUndo}
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
