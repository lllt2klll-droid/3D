import * as THREE from 'three';
import { Wire, CircuitComponent, WireColor } from '../types';
import { MATERIALS } from './materials';

interface WireMeshRecord {
  wireId: string;
  group: THREE.Group;
  curve: THREE.Curve<THREE.Vector3>;
  tubeMesh: THREE.Mesh;
  particles: THREE.Mesh[];
  particleOffsets: number[];
}

export class WireRenderer {
  private group: THREE.Group;
  private wireRecords: Map<string, WireMeshRecord> = new Map();

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'wire_renderer_group';
  }

  public getRoot(): THREE.Group {
    return this.group;
  }

  private getWireMaterial(color: WireColor): THREE.MeshStandardMaterial {
    switch (color) {
      case 'red':
        return MATERIALS.wireRed;
      case 'black':
        return MATERIALS.wireBlack;
      case 'blue':
        return MATERIALS.wireBlue;
      case 'yellow':
        return MATERIALS.wireYellow;
      case 'green':
        return MATERIALS.wireGreen;
      default:
        return MATERIALS.wireRed;
    }
  }

  /**
   * Calculate absolute world position of a component terminal
   */
  public getTerminalWorldPosition(
    comp: CircuitComponent,
    termId: string
  ): THREE.Vector3 {
    const term = comp.terminals.find((t) => t.id === termId) || comp.terminals[0];
    const basePos = new THREE.Vector3(...comp.position);
    if (!term) return basePos;

    // Terminal relative position
    const rel = new THREE.Vector3(...term.relativePosition);
    return basePos.clone().add(rel).add(new THREE.Vector3(0, 0.15, 0));
  }

  /**
   * Sync wires from state into 3D meshes
   */
  public updateWires(wires: Wire[], components: CircuitComponent[]) {
    const compMap = new Map<string, CircuitComponent>();
    components.forEach((c) => compMap.set(c.id, c));

    const activeWireIds = new Set(wires.map((w) => w.id));

    // Remove deleted wires
    for (const [id, record] of this.wireRecords.entries()) {
      if (!activeWireIds.has(id)) {
        this.group.remove(record.group);
        record.tubeMesh.geometry.dispose();
        this.wireRecords.delete(id);
      }
    }

    // Add or update wires
    wires.forEach((wire) => {
      const fromComp = compMap.get(wire.fromComponentId);
      const toComp = compMap.get(wire.toComponentId);

      if (!fromComp || !toComp) return;

      const pStart = this.getTerminalWorldPosition(fromComp, wire.fromTerminalId);
      const pEnd = this.getTerminalWorldPosition(toComp, wire.toTerminalId);

      // Create natural arching 3D catenary curve
      const dist = pStart.distanceTo(pEnd);
      const archHeight = Math.min(1.2, 0.25 + dist * 0.15);
      const pMid = new THREE.Vector3()
        .addVectors(pStart, pEnd)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, archHeight, 0));

      const curve = new THREE.QuadraticBezierCurve3(pStart, pMid, pEnd);

      if (this.wireRecords.has(wire.id)) {
        const record = this.wireRecords.get(wire.id)!;
        record.curve = curve;
        record.tubeMesh.geometry.dispose();
        record.tubeMesh.geometry = new THREE.TubeGeometry(curve, 28, 0.038, 8, false);
        record.tubeMesh.material = this.getWireMaterial(wire.color);

        // Update particle visibility
        record.particles.forEach((p) => {
          p.visible = wire.hasCurrent;
        });
      } else {
        const wireGroup = new THREE.Group();
        wireGroup.name = `wire::${wire.id}`;

        // Flexible 3D tube geometry
        const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.038, 8, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, this.getWireMaterial(wire.color));
        tubeMesh.castShadow = true;
        tubeMesh.receiveShadow = true;
        tubeMesh.userData = { wireId: wire.id };
        wireGroup.add(tubeMesh);

        // Terminal plug connectors at both ends
        const plugGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.12, 12);
        const plugMat = MATERIALS.plasticDark;

        const startPlug = new THREE.Mesh(plugGeo, plugMat);
        startPlug.position.copy(pStart);
        wireGroup.add(startPlug);

        const endPlug = new THREE.Mesh(plugGeo, plugMat);
        endPlug.position.copy(pEnd);
        wireGroup.add(endPlug);

        // Flowing current particles (yellow glowing mini-spheres)
        const particleCount = Math.max(4, Math.floor(dist * 2.5));
        const particles: THREE.Mesh[] = [];
        const particleOffsets: number[] = [];

        const particleGeo = new THREE.SphereGeometry(0.06, 12, 12);
        for (let i = 0; i < particleCount; i++) {
          const p = new THREE.Mesh(particleGeo, MATERIALS.currentParticle);
          p.visible = wire.hasCurrent;
          wireGroup.add(p);
          particles.push(p);
          particleOffsets.push(i / particleCount);
        }

        this.group.add(wireGroup);
        this.wireRecords.set(wire.id, {
          wireId: wire.id,
          group: wireGroup,
          curve,
          tubeMesh,
          particles,
          particleOffsets,
        });
      }
    });
  }

  /**
   * Animate flowing current particles along the wire
   */
  public animateCurrent(delta: number, flowSpeed: number = 0.6) {
    for (const record of this.wireRecords.values()) {
      for (let i = 0; i < record.particles.length; i++) {
        const p = record.particles[i];
        if (!p.visible) continue;

        record.particleOffsets[i] = (record.particleOffsets[i] + flowSpeed * delta) % 1.0;
        const pos = record.curve.getPoint(record.particleOffsets[i]);
        p.position.copy(pos);
      }
    }
  }

  public clear() {
    for (const record of this.wireRecords.values()) {
      this.group.remove(record.group);
      record.tubeMesh.geometry.dispose();
    }
    this.wireRecords.clear();
  }
}
