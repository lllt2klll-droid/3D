import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface SolarPanelObject extends THREE.Group {
  updateSolarState: (comp: CircuitComponent, sunlight: number) => void;
}

export function createSolarPanelMesh(comp: CircuitComponent): SolarPanelObject {
  const group = new THREE.Group() as SolarPanelObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Triangular side support stands (matching the wooden/white diorama stand in user image)
  const standMat = MATERIALS.woodTrim;
  const standGeo = new THREE.BoxGeometry(0.1, 0.9, 0.8);
  const leftStand = new THREE.Mesh(standGeo, standMat);
  leftStand.position.set(-0.65, 0.45, -0.1);
  leftStand.castShadow = true;
  group.add(leftStand);

  const rightStand = new THREE.Mesh(standGeo, standMat);
  rightStand.position.set(0.65, 0.45, -0.1);
  rightStand.castShadow = true;
  group.add(rightStand);

  // Base bottom plate
  const baseGeo = new THREE.BoxGeometry(1.5, 0.1, 1.0);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticWhite);
  baseMesh.position.set(0, 0.05, 0);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Tilted Panel Assembly Group (tilted at ~35 degrees)
  const panelTiltGroup = new THREE.Group();
  panelTiltGroup.position.set(0, 0.65, 0);
  panelTiltGroup.rotation.x = -Math.PI / 5; // Tilted towards viewer/sun

  // Panel outer frame (Clean warm wood/white border)
  const frameGeo = new THREE.BoxGeometry(1.3, 1.0, 0.08);
  const frameMesh = new THREE.Mesh(frameGeo, MATERIALS.woodTrim);
  frameMesh.castShadow = true;
  panelTiltGroup.add(frameMesh);

  // Photovoltaic surface (Deep blue silicon cells)
  const cellGeo = new THREE.PlaneGeometry(1.2, 0.9);
  const cellMat = MATERIALS.solarCell.clone();
  const cellMesh = new THREE.Mesh(cellGeo, cellMat);
  cellMesh.position.z = 0.045;
  panelTiltGroup.add(cellMesh);

  // Grid lines (White 4x3 grid)
  const gridGroup = new THREE.Group();
  gridGroup.position.z = 0.048;

  // Horizontal wire lines
  for (let r = 1; r <= 3; r++) {
    const y = -0.45 + (r * 0.9) / 4;
    const hLineGeo = new THREE.BoxGeometry(1.2, 0.015, 0.005);
    const hLine = new THREE.Mesh(hLineGeo, MATERIALS.solarGridLine);
    hLine.position.y = y;
    gridGroup.add(hLine);
  }

  // Vertical busbar lines
  for (let c = 1; c <= 2; c++) {
    const x = -0.6 + (c * 1.2) / 3;
    const vLineGeo = new THREE.BoxGeometry(0.02, 0.9, 0.005);
    const vLine = new THREE.Mesh(vLineGeo, MATERIALS.solarGridLine);
    vLine.position.x = x;
    gridGroup.add(vLine);
  }

  panelTiltGroup.add(gridGroup);
  group.add(panelTiltGroup);

  // Sun energy glow indicator
  const sunGlowGeo = new THREE.PlaneGeometry(1.2, 0.9);
  const sunGlowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const sunGlowMesh = new THREE.Mesh(sunGlowGeo, sunGlowMat);
  sunGlowMesh.position.z = 0.049;
  panelTiltGroup.add(sunGlowMesh);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.18, 16);
    const pMat = term.polarity === 'positive' ? MATERIALS.terminalPositive : MATERIALS.terminalNegative;
    const pMesh = new THREE.Mesh(pGeo, pMat);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.metalSilver);
    capMesh.position.y = 0.12;
    postGroup.add(capMesh);

    // Generous invisible click hitbox
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.name = `terminal::${comp.id}::${term.id}`;
    postGroup.add(hitBox);

    const haloGeo = new THREE.RingGeometry(0.14, 0.26, 20);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.15;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  group.updateSolarState = (_currentComp: CircuitComponent, sunlight: number) => {
    // Glow intensifies with sunlight
    sunGlowMat.opacity = THREE.MathUtils.lerp(sunGlowMat.opacity, sunlight * 0.4, 0.1);
  };

  return group;
}
