import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface SwitchObject extends THREE.Group {
  updateSwitchState: (comp: CircuitComponent) => void;
  animateLever: (delta: number) => void;
  toggleLever: () => void;
}

export function createSwitchMesh(
  comp: CircuitComponent,
  onToggle?: (comp: CircuitComponent) => void
): SwitchObject {
  const group = new THREE.Group() as SwitchObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated rectangular base with soft rounded corners & beveled edges
  const baseGeo = new RoundedBoxGeometry(1.6, 0.12, 0.7, 4, 0.05);
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
  const jawGeo = new RoundedBoxGeometry(0.06, 0.12, 0.15, 2, 0.02);
  const jawMesh = new THREE.Mesh(jawGeo, MATERIALS.metalBrass);
  jawMesh.position.set(0.45, 0.32, 0);
  group.add(jawMesh);

  // Status indicator LED dot (green = closed / red = open)
  const indicatorGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const indicatorMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // starts red (open)
  const indicatorMesh = new THREE.Mesh(indicatorGeo, indicatorMat);
  indicatorMesh.position.set(0, 0.16, 0.3);
  group.add(indicatorMesh);

  // Movable Lever Pivot Group — pivots around the left post
  const leverGroup = new THREE.Group();
  leverGroup.position.set(-0.45, 0.28, 0);
  leverGroup.name = `lever::${comp.id}`;

  // Knife brass blade with smoothed edges
  const bladeGeo = new RoundedBoxGeometry(0.95, 0.06, 0.04, 2, 0.015);
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

  // Hitbox for lever click — large enough for easy touch
  const leverHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.3, 0.25),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  leverHitbox.position.set(0.5, 0, 0);
  leverHitbox.name = `lever::${comp.id}`;
  leverGroup.add(leverHitbox);

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

    const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticLightBlue);
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
    haloMesh.position.y = 0.16;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  // Target angle: open = +35° tilt up, closed = 0° (horizontal touching catch)
  // Positive Z rotation tilts the blade tip upward (open/OFF position)
  const OPEN_ANGLE = Math.PI / 5;   // ~36° — lever raised (open, OFF)
  const CLOSED_ANGLE = 0;           // 0° — lever horizontal (closed, ON)

  let targetAngle = comp.state.isOpen ? OPEN_ANGLE : CLOSED_ANGLE;
  leverGroup.rotation.z = targetAngle;

  // Called from React state changes — just updates target
  group.updateSwitchState = (currentComp: CircuitComponent) => {
    const isOpen = currentComp.state.isOpen ?? false;
    targetAngle = isOpen ? OPEN_ANGLE : CLOSED_ANGLE;
    // Indicator light: green when closed (ON), red when open (OFF)
    indicatorMat.color.setHex(isOpen ? 0xef4444 : 0x22c55e);
  };

  // Called every animation frame — smoothly interpolates lever rotation
  group.animateLever = (_delta: number) => {
    leverGroup.rotation.z = THREE.MathUtils.lerp(leverGroup.rotation.z, targetAngle, 0.12);
  };

  group.toggleLever = () => {
    if (onToggle) {
      onToggle(comp);
    }
  };

  return group;
}
