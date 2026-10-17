import { CircuitComponent, Wire, CircuitAnalysisResult, ComponentState } from '../types';

interface TerminalKey {
  componentId: string;
  terminalId: string;
}

function termKey(compId: string, termId: string): string {
  return `${compId}::${termId}`;
}

function parseKey(key: string): TerminalKey {
  const [componentId, terminalId] = key.split('::');
  return { componentId, terminalId };
}

/**
 * Determines whether a component acts as an active power source
 */
export function isSource(component: CircuitComponent): boolean {
  if (component.type === 'battery') {
    return (component.state.voltage ?? 1.5) > 0;
  }
  if (component.type === 'solar_panel') {
    return (component.state.sunlight ?? 0) >= 0.2;
  }
  if (component.type === 'wind_turbine') {
    return (component.state.windSpeed ?? 0) >= 1;
  }
  return false;
}

/**
 * Determines whether a component is a load (consumes electrical power)
 */
export function isLoad(component: CircuitComponent): boolean {
  return (
    component.type === 'bulb' ||
    component.type === 'motor' ||
    component.type === 'fan' ||
    component.type === 'resistor' ||
    component.type === 'led'
  );
}

/**
 * Comprehensive graph-based circuit analysis engine
 */
export function analyzeCircuit(
  components: CircuitComponent[],
  wires: Wire[],
  energyEnv?: { sunlight: number; windSpeed: number }
): CircuitAnalysisResult {
  // Sync environmental values into components if provided
  if (energyEnv) {
    components.forEach((c) => {
      if (c.type === 'solar_panel') c.state.sunlight = energyEnv.sunlight;
      if (c.type === 'wind_turbine') c.state.windSpeed = energyEnv.windSpeed;
    });
  }

  const compMap = new Map<string, CircuitComponent>();
  components.forEach((c) => compMap.set(c.id, c));

  // Build Adjacency Graph: node = "componentId::terminalId"
  const adj = new Map<string, string[]>();

  function addEdge(k1: string, k2: string) {
    if (!adj.has(k1)) adj.set(k1, []);
    if (!adj.has(k2)) adj.set(k2, []);
    adj.get(k1)!.push(k2);
    adj.get(k2)!.push(k1);
  }

  // 1. External edges from wires
  wires.forEach((w) => {
    const k1 = termKey(w.fromComponentId, w.fromTerminalId);
    const k2 = termKey(w.toComponentId, w.toTerminalId);
    addEdge(k1, k2);
  });

  // 2. Internal conductance edges within components
  components.forEach((c) => {
    if (c.terminals.length < 2) return;

    if (c.type === 'switch') {
      // Conducts only when switch is CLOSED (!isOpen)
      if (c.state.isOpen === false) {
        addEdge(termKey(c.id, c.terminals[0].id), termKey(c.id, c.terminals[1].id));
      }
    } else if (isLoad(c)) {
      // Loads have internal resistance & conduct
      addEdge(termKey(c.id, c.terminals[0].id), termKey(c.id, c.terminals[1].id));
    }
  });

  // Identify all active power sources
  const powerSources = components.filter(isSource);

  if (wires.length === 0) {
    return {
      isClosedCircuit: false,
      isShortCircuit: false,
      hasPowerSource: powerSources.length > 0,
      activeLoops: [],
      poweredComponentIds: [],
      statusMessage: 'Mạch điện chưa được nối dây dẫn.',
      statusType: 'idle',
      pedagogicalHint: 'Em hãy chọn một đầu dây (đỏ hoặc đen) rồi bấm vào các chốt kim loại để nối mạch nhé!',
    };
  }

  if (powerSources.length === 0) {
    return {
      isClosedCircuit: false,
      isShortCircuit: false,
      hasPowerSource: false,
      activeLoops: [],
      poweredComponentIds: [],
      statusMessage: 'Chưa có nguồn điện hoạt động trong mạch.',
      statusType: 'warning',
      pedagogicalHint:
        'Mạch điện cần một nguồn cung cấp năng lượng (như Pin, Tấm pin mặt trời có ánh sáng, hoặc Tuabin gió có gió thổi).',
    };
  }

  let shortCircuitFound = false;
  const activeLoops: string[][] = [];
  const poweredCompSet = new Set<string>();

  // Check each power source for closed loops between its positive and negative terminals
  for (const src of powerSources) {
    const posTerm = src.terminals.find((t) => t.polarity === 'positive') || src.terminals[0];
    const negTerm = src.terminals.find((t) => t.polarity === 'negative') || src.terminals[1];

    if (!posTerm || !negTerm) continue;

    const startNode = termKey(src.id, posTerm.id);
    const targetNode = termKey(src.id, negTerm.id);

    // Find all simple paths from posTerm to negTerm
    const visitedNodes = new Set<string>();
    const currentPath: string[] = [];

    function dfs(currentNode: string) {
      currentPath.push(currentNode);
      visitedNodes.add(currentNode);

      if (currentNode === targetNode) {
        // Found a closed loop!
        const pathCopy = [...currentPath];
        const compsInPath = new Set<string>();
        let loadCount = 0;

        pathCopy.forEach((k) => {
          const { componentId } = parseKey(k);
          compsInPath.add(componentId);
          const comp = compMap.get(componentId);
          if (comp && isLoad(comp)) {
            loadCount++;
          }
        });

        if (loadCount === 0) {
          // Dangerous short circuit! Positive connected directly to negative with 0 loads
          shortCircuitFound = true;
        } else {
          activeLoops.push(Array.from(compsInPath));
          compsInPath.forEach((id) => poweredCompSet.add(id));
        }
      } else {
        const neighbors = adj.get(currentNode) || [];
        for (const neighbor of neighbors) {
          if (!visitedNodes.has(neighbor)) {
            dfs(neighbor);
          }
        }
      }

      currentPath.pop();
      visitedNodes.delete(currentNode);
    }

    dfs(startNode);
  }

  // Update wire current status
  wires.forEach((w) => {
    const k1 = termKey(w.fromComponentId, w.fromTerminalId);
    const k2 = termKey(w.toComponentId, w.toTerminalId);
    let wireInActiveLoop = false;

    for (const loop of activeLoops) {
      if (loop.includes(w.fromComponentId) && loop.includes(w.toComponentId)) {
        wireInActiveLoop = true;
        break;
      }
    }

    w.hasCurrent = !shortCircuitFound && wireInActiveLoop;
    w.currentDirection = w.hasCurrent ? 1 : 0;
  });

  // Short circuit has highest priority warning
  if (shortCircuitFound) {
    return {
      isClosedCircuit: false,
      isShortCircuit: true,
      hasPowerSource: true,
      activeLoops: [],
      poweredComponentIds: [],
      statusMessage: 'CẢNH BÁO: Hiện tượng chập mạch (đoản mạch)!',
      statusType: 'error',
      pedagogicalHint:
        'Cực dương (+) và cực âm (-) của nguồn điện đang bị nối tắt trực tiếp mà không qua bóng đèn hay động cơ. Điều này rất nguy hiểm vì có thể làm nóng pin hoặc cháy dây!',
    };
  }

  // If we have active loops with loads
  if (activeLoops.length > 0 && poweredCompSet.size > 0) {
    const poweredLoads = Array.from(poweredCompSet)
      .map((id) => compMap.get(id))
      .filter((c) => c && isLoad(c));

    let desc = 'Mạch điện kín hoàn toàn! ';
    if (poweredLoads.some((l) => l?.type === 'bulb')) {
      desc += 'Dòng điện chạy làm bóng đèn phát sáng rực rỡ. ';
    }
    if (poweredLoads.some((l) => l?.type === 'motor' || l?.type === 'fan')) {
      desc += 'Động cơ điện đang quay làm cánh quạt chuyển động! ';
    }

    return {
      isClosedCircuit: true,
      isShortCircuit: false,
      hasPowerSource: true,
      activeLoops,
      poweredComponentIds: Array.from(poweredCompSet),
      statusMessage: desc.trim(),
      statusType: 'success',
      pedagogicalHint:
        'Chúc mừng em! Nguồn điện tạo ra dòng điện liên tục chạy qua các thiết bị và quay trở lại nguồn thành một vòng kín.',
    };
  }

  // Pedagogical diagnosing why circuit is open
  const openSwitches = components.filter((c) => c.type === 'switch' && c.state.isOpen !== false);
  const partiallyConnected = components.filter((c) => {
    const cWires = wires.filter(
      (w) => w.fromComponentId === c.id || w.toComponentId === c.id
    );
    return cWires.length === 1;
  });

  let hint = 'Mạch điện đang bị hở (chưa khép kín), dòng điện chưa thể lưu thông.';
  let msg = 'Mạch điện hở – Thiết bị chưa hoạt động.';

  if (openSwitches.length > 0) {
    hint =
      'Công tắc đang ở trạng thái MỞ (ngắt điện). Em hãy bấm vào cần gạt công tắc để ĐÓNG mạch lại nhé!';
    msg = 'Công tắc đang mở (OFF) – Mạch bị ngắt tại công tắc.';
  } else if (partiallyConnected.length > 0) {
    const compName = partiallyConnected[0].name;
    hint = `Linh kiện "${compName}" mới chỉ được nối 1 đầu. Dòng điện cần có đường vào và đường ra về cực còn lại của pin!`;
    msg = `Linh kiện "${compName}" nối chưa đủ 2 cực.`;
  } else if (wires.length < 2) {
    hint = 'Một mạch điện cơ bản cần ít nhất 2 đoạn dây dẫn nối khép kín từ 2 cực của nguồn điện.';
    msg = 'Chưa đủ dây dẫn để khép kín vòng mạch.';
  }

  return {
    isClosedCircuit: false,
    isShortCircuit: false,
    hasPowerSource: true,
    activeLoops: [],
    poweredComponentIds: [],
    statusMessage: msg,
    statusType: 'warning',
    pedagogicalHint: hint,
  };
}

/**
 * Update dynamic physical state for each component based on circuit analysis
 */
export function updateComponentStates(
  components: CircuitComponent[],
  analysis: CircuitAnalysisResult
): CircuitComponent[] {
  return components.map((comp) => {
    const isPowered = analysis.poweredComponentIds.includes(comp.id);
    const updatedState: ComponentState = { ...comp.state };

    if (comp.type === 'bulb') {
      updatedState.isLit = isPowered;
      updatedState.brightness = isPowered ? 1.0 : 0.0;
    } else if (comp.type === 'motor' || comp.type === 'fan') {
      updatedState.isSpinning = isPowered;
      updatedState.speed = isPowered ? 1.0 : 0.0;
    } else if (comp.type === 'led') {
      updatedState.isLit = isPowered;
    }

    return {
      ...comp,
      state: updatedState,
    };
  });
}
