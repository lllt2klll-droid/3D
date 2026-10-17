import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface PushButtonObject extends THREE.Group {
  updatePushButtonState: (comp: CircuitComponent) => void;
  toggleButton: () => void;
}

export function createPushButtonMesh(
  comp: CircuitComponent,
  onToggle?: (comp: CircuitComponent) => void
): PushButtonObject {
  const group = new THREE.Group() as PushButtonObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Square sturdy base (Slate plastic)
  const baseGeo = new THREE.BoxGeometry(1.2, 0.12, 1.0);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticDark);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Raised collar ring housing (Yellow/gray plastic collar)
  const collarGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.16, 24);
  const collarMesh = new THREE.Mesh(collarGeo, MATERIALS.plasticYellow);
  collarMesh.position.y = 0.2;
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // Plunger Button Group (moves down when pressed)
  const plungerGroup = new THREE.Group();
  plungerGroup.name = `button::${comp.id}`;
  plungerGroup.position.y = 0.28;

  // Red dome cap
  const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.14, 24);
  const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticRed);
  capMesh.position.y = 0.07;
  capMesh.castShadow = true;
  plungerGroup.add(capMesh);

  const domeGeo = new THREE.SphereGeometry(0.28, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeo, MATERIALS.plasticRed);
  domeMesh.position.y = 0.14;
  plungerGroup.add(domeMesh);

  group.add(plungerGroup);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const postBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16),
      MATERIALS.metalBrass
    );
    postBase.position.y = 0.05;
    postGroup.add(postBase);

    const postTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 12),
      MATERIALS.metalSilver
    );
    postTop.position.y = 0.14;
    postGroup.add(postTop);

    // Glowing selection halo
    const haloGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.y = 0.14;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    haloMesh.visible = false;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  group.updatePushButtonState = (updatedComp: CircuitComponent) => {
    const isPressed = !!updatedComp.state.isPressed;
    // Visually depress button when pressed
    plungerGroup.position.y = isPressed ? 0.21 : 0.28;
  };

  group.toggleButton = () => {
    comp.state.isPressed = !comp.state.isPressed;
    group.updatePushButtonState(comp);
    if (onToggle) onToggle(comp);
  };

  return group;
}
