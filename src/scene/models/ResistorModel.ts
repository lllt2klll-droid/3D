import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export function createResistorMesh(comp: CircuitComponent): THREE.Group {
  const group = new THREE.Group();
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base stand with soft rounded corners
  const baseGeo = new RoundedBoxGeometry(1.3, 0.1, 0.6, 4, 0.05);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticLightBlue);
  baseMesh.position.y = 0.05;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Ceramic resistor body
  const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.65, 20);
  const bodyMesh = new THREE.Mesh(bodyGeo, MATERIALS.woodTrim);
  bodyMesh.rotation.z = Math.PI / 2;
  bodyMesh.position.y = 0.25;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Color bands (Brown, Black, Red, Gold)
  const colors = [0x78350f, 0x0f172a, 0xef4444, 0xf59e0b];
  const positions = [-0.18, -0.06, 0.06, 0.2];

  colors.forEach((col, idx) => {
    const bandGeo = new THREE.CylinderGeometry(0.185, 0.185, 0.045, 20);
    const bandMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 });
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.rotation.z = Math.PI / 2;
    bandMesh.position.set(positions[idx], 0.25, 0);
    group.add(bandMesh);
  });

  // Metal axial leads
  const leadGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12);
  const leftLead = new THREE.Mesh(leadGeo, MATERIALS.metalSilver);
  leftLead.rotation.z = Math.PI / 2;
  leftLead.position.set(-0.45, 0.25, 0);
  group.add(leftLead);

  const rightLead = new THREE.Mesh(leadGeo, MATERIALS.metalSilver);
  rightLead.rotation.z = Math.PI / 2;
  rightLead.position.set(0.45, 0.25, 0);
  group.add(rightLead);

  // Terminals
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 16);
    const pMesh = new THREE.Mesh(pGeo, MATERIALS.metalBrass);
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.plasticDark);
    capMesh.position.y = 0.09;
    postGroup.add(capMesh);

    const haloGeo = new THREE.RingGeometry(0.12, 0.18, 16);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.12;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  return group;
}
