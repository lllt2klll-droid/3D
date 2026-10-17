import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MATERIALS } from '../materials';
import { CircuitComponent } from '../../types';

export interface LedObject extends THREE.Group {
  updateLedState: (comp: CircuitComponent) => void;
}

export function createLedMesh(comp: CircuitComponent): LedObject {
  const group = new THREE.Group() as LedObject;
  group.name = comp.id;
  group.position.set(...comp.position);

  // Insulated base with soft rounded corners
  const baseGeo = new RoundedBoxGeometry(1.0, 0.1, 0.8, 4, 0.05);
  const baseMesh = new THREE.Mesh(baseGeo, MATERIALS.plasticDark);
  baseMesh.position.y = 0.05;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // LED Epoxy Dome (clone material so each LED has independent emissive state)
  const domeMat = new THREE.MeshPhysicalMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
    transmission: 0.6,
  });

  const domeGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.35, 20);
  const domeCyl = new THREE.Mesh(domeGeo, domeMat);
  domeCyl.position.y = 0.28;
  group.add(domeCyl);

  const topSphereGeo = new THREE.SphereGeometry(0.18, 20, 16);
  const topSphere = new THREE.Mesh(topSphereGeo, domeMat);
  topSphere.position.y = 0.45;
  group.add(topSphere);

  // Point light for LED glow
  const ledLight = new THREE.PointLight(0xef4444, 0, 4, 2);
  ledLight.position.set(0, 0.45, 0);
  group.add(ledLight);

  // Outer soft glow aura
  const glowGeo = new THREE.SphereGeometry(0.32, 12, 12);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff2222,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.position.y = 0.45;
  group.add(glowMesh);

  // Terminals (+ Anode, - Cathode) — with hitBox for reliable clicking
  comp.terminals.forEach((term) => {
    const postGroup = new THREE.Group();
    postGroup.name = `terminal::${comp.id}::${term.id}`;
    postGroup.position.set(...term.relativePosition);

    const pGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 16);
    const pMesh = new THREE.Mesh(
      pGeo,
      term.polarity === 'anode' ? MATERIALS.terminalPositive : MATERIALS.terminalNegative
    );
    pMesh.castShadow = true;
    postGroup.add(pMesh);

    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    const capMesh = new THREE.Mesh(capGeo, MATERIALS.metalSilver);
    capMesh.position.y = 0.09;
    postGroup.add(capMesh);

    // ✅ Invisible hitbox for reliable click/touch interaction
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.name = `terminal::${comp.id}::${term.id}`;
    postGroup.add(hitBox);

    const haloGeo = new THREE.RingGeometry(0.12, 0.20, 16);
    const haloMesh = new THREE.Mesh(haloGeo, MATERIALS.terminalHighlight);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.12;
    haloMesh.visible = false;
    haloMesh.name = `halo::${comp.id}::${term.id}`;
    postGroup.add(haloMesh);

    group.add(postGroup);
  });

  group.updateLedState = (currentComp: CircuitComponent) => {
    const isLit = currentComp.state.isLit ?? false;
    ledLight.intensity = THREE.MathUtils.lerp(ledLight.intensity, isLit ? 2.5 : 0, 0.2);
    domeMat.emissive.setHex(isLit ? 0xff2222 : 0x000000);
    domeMat.emissiveIntensity = isLit ? 1.5 : 0;
    glowMat.opacity = THREE.MathUtils.lerp(glowMat.opacity, isLit ? 0.4 : 0, 0.2);
  };

  return group;
}
