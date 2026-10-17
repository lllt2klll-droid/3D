import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface PotentiometerObject extends THREE.Group {
  updatePotentiometerState: (comp: CircuitComponent) => void;
}

export function createPotentiometerMesh(comp: CircuitComponent): PotentiometerObject {
  const group = new THREE.Group() as PotentiometerObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base plate with soft rounded corners
  const baseGeo = new RoundedBoxGeometry(1.2, 0.12, 1.0, 4, 0.06);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.06;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Metal case can (Silver pot body)
  const canGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 24);
  const canMesh = new THREE.Mesh(canGeo, MATERIALS.metalSilver);
  canMesh.position.y = 0.2;
  canMesh.castShadow = true;
  group.add(canMesh);

  // Printed dial arc on top of base
  const dialGeo = new THREE.RingGeometry(0.48, 0.58, 24, 1, 0, Math.PI * 1.5);
  const dialMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide });
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.rotation.x = -Math.PI / 2;
  dialMesh.position.y = 0.125;
  group.add(dialMesh);

  // Rotary Knob Group (rotates around Y axis)
  const knobGroup = new THREE.Group();
  knobGroup.position.y = 0.3;

  // Fluted black knob
  const knobGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.28, 24);
  const knobMesh = new THREE.Mesh(knobGeo, MATERIALS.plasticDark);
  knobMesh.position.y = 0.14;
  knobMesh.castShadow = true;
  knobGroup.add(knobMesh);

  // White indicator pointer notch on knob
  const pointerGeo = new RoundedBoxGeometry(0.06, 0.08, 0.22, 2, 0.02);
  const pointerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
  pointerMesh.position.set(0, 0.28, 0.16);
  knobGroup.add(pointerMesh);

  group.add(knobGroup);

  // Terminal connection posts — WITH hitBox for reliable clicking
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

    // ✅ Invisible hitbox for reliable click/touch
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.name = `terminal::${comp.id}::${term.id}`;
    postGroup.add(hitBox);

    const haloGeo = new THREE.RingGeometry(0.14, 0.24, 20);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.16;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    haloMesh.visible = false;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  group.updatePotentiometerState = (updatedComp: CircuitComponent) => {
    const resistance = updatedComp.state.resistance ?? 50;
    // Map resistance 0-200 to angle 0 to 1.5 * PI
    const ratio = Math.max(0, Math.min(1, resistance / 200));
    knobGroup.rotation.y = ratio * Math.PI * 1.5;
  };

  return group;
}
