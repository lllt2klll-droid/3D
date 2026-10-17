import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface SwitchObject extends THREE.Group {
  updateSwitchState: (comp: CircuitComponent) => void;
  toggleLever: () => void;
}

export function createSwitchMesh(
  comp: CircuitComponent,
  onToggle?: (comp: CircuitComponent) => void
): SwitchObject {
  const group = new THREE.Group() as SwitchObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated rectangular base
  const baseGeo = new THREE.BoxGeometry(1.6, 0.12, 0.7);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticDark);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Pivot Hinge Post (Left side)
  const pivotPostGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
  const pivotPostMesh = new THREE.Mesh(pivotPostGeo, MATERIALS.metalBrass);
  pivotPostMesh.position.set(-0.45, 0.22, 0);
  pivotPostMesh.castShadow = true;
  group.add(pivotPostMesh);

  // Contact Catch Post (Right side)
  const catchPostGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
  const catchPostMesh = new THREE.Mesh(catchPostGeo, MATERIALS.metalBrass);
  catchPostMesh.position.set(0.45, 0.22, 0);
  catchPostMesh.castShadow = true;
  group.add(catchPostMesh);

  // Contact Jaws (U-bracket on catch post)
  const jawGeo = new THREE.BoxGeometry(0.06, 0.12, 0.15);
  const jawMesh = new THREE.Mesh(jawGeo, MATERIALS.metalBrass);
  jawMesh.position.set(0.45, 0.32, 0);
  group.add(jawMesh);

  // Movable Lever Pivot Group
  const leverGroup = new THREE.Group();
  leverGroup.position.set(-0.45, 0.28, 0);
  leverGroup.name = `lever::${comp.id}`;

  // Knife brass blade
  const bladeGeo = new THREE.BoxGeometry(0.95, 0.06, 0.04);
  const bladeMesh = new THREE.Mesh(bladeGeo, MATERIALS.metalBrass);
  bladeMesh.position.set(0.46, 0, 0);
  bladeMesh.castShadow = true;
  leverGroup.add(bladeMesh);

  // Insulated Knob / Handle at lever tip
  const handleGeo = new THREE.CylinderGeometry(0.07, 0.05, 0.22, 16);
  const handleMesh = new THREE.Mesh(handleGeo, MATERIALS.plasticOrange);
  handleMesh.rotation.z = Math.PI / 2;
  handleMesh.position.set(0.98, 0, 0);
  handleMesh.castShadow = true;
  leverGroup.add(handleMesh);

  // Ball tip on handle
  const knobTipGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const knobTipMesh = new THREE.Mesh(knobTipGeo, MATERIALS.plasticYellow);
  knobTipMesh.position.set(1.12, 0, 0);
  leverGroup.add(knobTipMesh);

  group.add(leverGroup);

  // Terminal connection posts
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16);
    const pMesh = new THREE.Mesh(pGeo, MATERIALS.metalSilver);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticLightBlue);
    capMesh.position.y = 0.11;
    postGroup.add(capMesh);

    const haloGeo = new THREE.RingGeometry(0.12, 0.18, 16);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.14;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  // Target angle: open = Math.PI / 4 (~45 deg), closed = 0 deg
  let targetAngle = comp.state.isOpen ? Math.PI / 4 : 0;
  leverGroup.rotation.z = targetAngle;

  group.updateSwitchState = (currentComp: CircuitComponent) => {
    const isOpen = currentComp.state.isOpen ?? false;
    targetAngle = isOpen ? Math.PI / 4 : 0;
    // Animate smoothly to target rotation
    leverGroup.rotation.z = THREE.MathUtils.lerp(leverGroup.rotation.z, targetAngle, 0.2);
  };

  group.toggleLever = () => {
    if (onToggle) {
      onToggle(comp);
    }
  };

  return group;
}
