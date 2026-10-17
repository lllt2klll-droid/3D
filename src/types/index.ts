export type ComponentType =
  | 'battery'
  | 'bulb'
  | 'switch'
  | 'motor'
  | 'fan'
  | 'solar_panel'
  | 'wind_turbine'
  | 'resistor'
  | 'led';

export type TerminalPolarity = 'positive' | 'negative' | 'neutral' | 'anode' | 'cathode';

export interface Terminal {
  id: string; // e.g. "pos", "neg", "t1", "t2"
  label: string; // "+", "-", "A", "B"
  polarity: TerminalPolarity;
  relativePosition: [number, number, number]; // [x, y, z] relative to component center
}

export interface ComponentState {
  isOpen?: boolean; // For switch: true = open (off), false = closed (on)
  voltage?: number; // In Volts (e.g., 1.5, 9)
  resistance?: number; // In Ohms
  isLit?: boolean; // Bulb/LED active
  brightness?: number; // 0 to 1
  isSpinning?: boolean; // Motor/fan active
  speed?: number; // 0 to 1
  sunlight?: number; // 0 to 1 (0% to 100%)
  windSpeed?: number; // 0 to 5 level
  energyOutput?: number; // Calculated generated power in Watts/Volts
  color?: string; // For LED
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  state: ComponentState;
  terminals: Terminal[];
}

export type WireColor = 'red' | 'black' | 'yellow' | 'blue' | 'green';

export interface Wire {
  id: string;
  fromComponentId: string;
  fromTerminalId: string;
  toComponentId: string;
  toTerminalId: string;
  color: WireColor;
  hasCurrent: boolean;
  currentDirection: 1 | -1 | 0;
}

export interface CircuitAnalysisResult {
  isClosedCircuit: boolean;
  isShortCircuit: boolean;
  hasPowerSource: boolean;
  activeLoops: string[][]; // Paths of connected component IDs
  poweredComponentIds: string[];
  statusMessage: string;
  statusType: 'success' | 'warning' | 'error' | 'idle';
  pedagogicalHint: string;
}

export type AppMode = 'explore' | 'lab' | 'energy' | 'challenge';

export interface ComponentCatalogItem {
  type: ComponentType;
  name: string;
  vietnameseName: string;
  iconName: string;
  category: 'source' | 'load' | 'control' | 'passive';
  shortDesc: string;
  fullDesc: string;
  howItWorks: string;
  funFact: string;
  challengeQuestion: string;
  specs: string;
  defaultState: ComponentState;
  terminals: Terminal[];
}

export interface Challenge {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  hint: string;
  mode: 'circuit' | 'energy';
  setupComponents?: Partial<CircuitComponent>[];
  setupWires?: Wire[];
  predictionQuestion?: string;
  predictionOptions?: string[];
  correctPredictionIndex?: number;
  predictionExplanation?: string;
  checkCondition: (
    analysis: CircuitAnalysisResult,
    components: CircuitComponent[],
    wires: Wire[],
    energyEnv?: { sunlight: number; windSpeed: number }
  ) => boolean;
  successMessage: string;
  educationalTakeaway: string;
}
