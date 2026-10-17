import { CircuitComponent, Wire, ComponentType } from '../types';
import { COMPONENT_CATALOG } from './componentCatalog';

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  components: CircuitComponent[];
  wires: Wire[];
}

export function createComponent(
  type: ComponentType,
  id: string,
  pos: [number, number, number],
  initialState: Record<string, unknown> = {}
): CircuitComponent {
  const cat = COMPONENT_CATALOG[type];
  return {
    id,
    type,
    name: cat.name,
    position: pos,
    state: { ...cat.defaultState, ...initialState },
    terminals: cat.terminals.map((t) => ({ ...t })),
  };
}

export const CIRCUIT_TEMPLATES: CircuitTemplate[] = [
  {
    id: 'empty',
    name: 'Bàn thí nghiệm tự do',
    description: 'Không gian trống để em tự chọn linh kiện và sáng tạo mạch điện theo ý thích.',
    components: [],
    wires: [],
  },

  {
    id: 'simple_bulb',
    name: 'Mạch thắp sáng bóng đèn',
    description: 'Mạch cơ bản gồm Pin 1.5V, Công tắc và Bóng đèn sợi đốt.',
    components: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: true }),
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    wires: [
      {
        id: 'w-1',
        fromComponentId: 'bat-1',
        fromTerminalId: 'pos',
        toComponentId: 'sw-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-2',
        fromComponentId: 'sw-1',
        fromTerminalId: 't2',
        toComponentId: 'bulb-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-3',
        fromComponentId: 'bulb-1',
        toComponentId: 'bat-1',
        fromTerminalId: 't2',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
  },

  {
    id: 'motor_fan',
    name: 'Mạch quạt điện mini',
    description: 'Nối Pin với Động cơ điện và Quạt để tạo ra luồng gió mát!',
    components: [
      createComponent('battery', 'bat-1', [-1.6, 0, 0]),
      createComponent('switch', 'sw-1', [0, 0, -1.2], { isOpen: true }),
      createComponent('fan', 'fan-1', [1.5, 0, 0]),
    ],
    wires: [
      {
        id: 'w-1',
        fromComponentId: 'bat-1',
        fromTerminalId: 'pos',
        toComponentId: 'sw-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-2',
        fromComponentId: 'sw-1',
        fromTerminalId: 't2',
        toComponentId: 'fan-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-3',
        fromComponentId: 'fan-1',
        fromTerminalId: 't2',
        toComponentId: 'bat-1',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
  },

  {
    id: 'solar_light',
    name: 'Mạch năng lượng mặt trời',
    description: 'Tấm pin đón ánh nắng biến quang năng thành điện năng thắp sáng bóng đèn.',
    components: [
      createComponent('solar_panel', 'solar-1', [-1.5, 0, 0], { sunlight: 0.9 }),
      createComponent('bulb', 'bulb-1', [1.5, 0, 0]),
    ],
    wires: [
      {
        id: 'w-1',
        fromComponentId: 'solar-1',
        fromTerminalId: 'pos',
        toComponentId: 'bulb-1',
        toTerminalId: 't1',
        color: 'red',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-2',
        fromComponentId: 'bulb-1',
        fromTerminalId: 't2',
        toComponentId: 'solar-1',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
  },

  {
    id: 'wind_fan',
    name: 'Mạch tuabin gió phát điện',
    description: 'Tuabin đón gió quay máy phát điện, truyền năng lượng làm quay quạt mát.',
    components: [
      createComponent('wind_turbine', 'wind-1', [-1.6, 0, 0], { windSpeed: 4 }),
      createComponent('fan', 'fan-1', [1.5, 0, 0]),
    ],
    wires: [
      {
        id: 'w-1',
        fromComponentId: 'wind-1',
        fromTerminalId: 'pos',
        toComponentId: 'fan-1',
        toTerminalId: 't1',
        color: 'blue',
        hasCurrent: false,
        currentDirection: 1,
      },
      {
        id: 'w-2',
        fromComponentId: 'fan-1',
        fromTerminalId: 't2',
        toComponentId: 'wind-1',
        toTerminalId: 'neg',
        color: 'black',
        hasCurrent: false,
        currentDirection: 1,
      },
    ],
  },
];
