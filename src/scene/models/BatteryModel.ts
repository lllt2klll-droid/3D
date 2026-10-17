import * as THREE from 'three';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export function createBatteryMesh(comp: CircuitComponent): THREE.Group {
  const group = new THREE.Group();
  group.name = comp.id;
  group.position.set(...comp.position);

  // Main battery cylinder (AA style)
  const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.1, 24);
  const bodyMesh = new THREE.Mesh(bodyGeo, MATERIALS.plasticBlue);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyMesh.rotation.z = Math.PI / 2; // Lie horizontally or tilt slightly
  bodyMesh.position.y = 0.35;
  group.add(bodyMesh);

  // Decorative wrap stripe (Yellow center band)
  const stripeGeo = new THREE.CylinderGeometry(0.352, 0.352, 0.4, 24);
  const stripeMesh = new THREE.Mesh(stripeGeo, MATERIALS.plasticYellow);
  stripeMesh.rotation.z = Math.PI / 2;
  stripeMesh.position.y = 0.35;
  group.add(stripeMesh);

  // Negative flat base (Silver)
  const negCapGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 24);
  const negCapMesh = new THREE.Mesh(negCapGeo, MATERIALS.metalSilver);
  negCapMesh.rotation.z = Math.PI / 2;
  negCapMesh.position.set(-0.57, 0.35, 0);
  group.add(negCapMesh);

  // Positive raised contact nipple (+)
  const posCapGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
  const posCapMesh = new THREE.Mesh(posCapGeo, MATERIALS.metalBrass);
  posCapMesh.rotation.z = Math.PI / 2;
  posCapMesh.position.set(0.6, 0.35, 0);
  group.add(posCapMesh);

  // Base platform support
  const baseStandGeo = new THREE.BoxGeometry(1.4, 0.12, 0.7);
  const baseStandMesh = new THREE.Mesh(baseStandGeo, MATERIALS.plasticDark);
  baseStandMesh.position.set(0, 0.06, 0);
  baseStandMesh.castShadow = true;
  baseStandMesh.receiveShadow = true;
  group.add(baseStandMesh);

  // Terminal connection posts (where wires plug in)
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    // Terminal post cylinder
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 16);
    const postMat = term.polarity === 'positive' ? MATERIALS.terminalPositive : MATERIALS.terminalNegative;
    const postMesh = new THREE.Mesh(postGeo, postMat);
    postMesh.castShadow = true;
    postGroup.add(postMesh);

    // Metal screw cap
    const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.metalSilver);
    capMesh.position.y = 0.12;
    postGroup.add(capMesh);

    // Generous invisible click hitbox (radius 0.32) for effortless touch and mouse interaction
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.name = `terminal::${comp.id}::${term.id}`;
    postGroup.add(hitBox);

    // Terminal selection halo (shows on hover/connecting)
    const haloGeo = new THREE.RingGeometry(0.14, 0.26, 20);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.17;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  return group;
}
